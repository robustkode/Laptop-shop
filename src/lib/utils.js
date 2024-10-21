import { hashIterations } from "@/config";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
import { PublicError } from "./errors";
import { ZodError } from "zod";
import _ from "lodash";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function hashPassword(plainTextPassword, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      hashIterations,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      }
    );
  });
}

export function handleError(err) {
  //! if it is instance of zod error flaten and pass
  const isAllowedError = err instanceof PublicError;
  const isDev = process.env.NODE_ENV === "development";
  if (isAllowedError || isDev) {
    //modified_err = err instanceof ZodError ? err.flatten() : err

    console.error(err);
    return {
      error: {
        code: err.code ?? "ERROR",
        message: `${!isAllowedError && isDev ? "DEV ONLY ENABLED - " : ""}${
          err.message
        }`,
      },
    };
  } else {
    return {
      error: {
        code: "ERROR",
        message: "Something went wrong",
      },
    };
  }
}

export async function verifyPassword(passwordHash, salt, plainTextPassword) {
  const hash = await hashPassword(plainTextPassword, salt);
  return passwordHash == hash;
}

function trasformToArray(item) {
  let f;
  if (_.isArray(item)) {
    f = (item.length === 1) & (item[0] === 1) ? [] : item;
  } else {
    try {
      if (f === "") {
        f = [];
      } else {
        f = item.split(",");
      }
    } catch (_) {
      f = [];
    }
  }
  return f;
}

export function compare(oldList, newList) {
  let old = trasformToArray(oldList);
  let current = trasformToArray(newList);

  // Find added items
  const addedItems = _.difference(current, old);

  // Find removed items
  const removedItems = _.difference(old, current);
  return {
    addedItems,
    removedItems,
  };
}

export function syncUrl(filters) {
  const urlParams = [];
  //console.log(Object.entries(filters), "gg");
  Object.entries(filters).map((filter) => {
    if (Array.isArray(filter[1]) && filter[1].length) {
      const filterParam = new URLSearchParams();
      filter[1].forEach((f) => {
        filterParam.append([filter[0]], f);
      });
      urlParams.push(filterParam.toString());
    } else if (filter[1] && typeof filter[1] === "string") {
      const filterParam = new URLSearchParams();
      filterParam.append(filter[0], filter[1]);
      urlParams.push(filterParam.toString());
    }
  });
  let query = "";
  if (urlParams.length) {
    urlParams.map((param, i) => {
      if (i === 0) {
        query += `?${param}`;
      } else {
        query += `&${param}`;
      }
    });
  }
  return query;
}
