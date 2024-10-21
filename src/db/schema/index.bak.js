import { userRole } from "@/config";
import { randomUUID } from "crypto";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
  role: integer("role").default(userRole),
});

export const accountTokens = sqliteTable("account_tokens", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: text("email").notNull().unique(),
  token: text("token").notNull(),
  role: text("role").notNull(),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  expiresAt: integer("expires_at").notNull(),
});

// export const resetTokens = sqliteTable("reset_tokens", {
//   id: text("id", { length: 36 })
//     .primaryKey()
//     .$defaultFn(() => randomUUID()),
//   userId: text("user_id")
//     .references(() => users.id, { onDelete: "cascade" })
//     .unique()
//     .notNull(),
//   token: text("token"),
//   tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
// });

// export const verifyEmailTokens = sqliteTable("verify_email_tokens", {
//   id: text("id", { length: 36 })
//     .primaryKey()
//     .$defaultFn(() => randomUUID()),
//   userId: text("user_id")
//     .references(() => users.id, { onDelete: "cascade" })
//     .unique()
//     .notNull(),
//   token: text("token"),
//   tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
// });

// //

// export const accounts = sqliteTable("accounts", {
//   id: text("id", { length: 36 })
//     .primaryKey()
//     .$defaultFn(() => randomUUID()),
//   userId: text("user_id")
//     .references(() => users.id, { onDelete: "cascade" })
//     .unique()
//     .notNull(),
//   : text("").notNull(),
//   role: integer("role"),
// });

export const blogs = sqliteTable("blogs", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "set default" })
    .notNull()
    .$default("place-holder-id"),
  title: text("title").unique().notNull(),
  coverImage: text("cover_image"),
  content: text("content").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const scholarships = sqliteTable("scholarships", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  //! fix on delete
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  name: text("name").unique().notNull(),
  coverImage: text("cover_image"),
  university: text("university"),
  tution: integer("tution"),
  currency: text("currency"),
  openTime: integer("openTime"),
  deadline: integer("deadline"),
  about: text("about").notNull(),
  eligibility: text("eligibility"),
  documents: text("documents"),
  benefits: text("benefits"),
  howApply: text("how_apply"),
  applyLink: text("aaply_link"),
  otherFields: text("other_fields"),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

// // export const scholarshipsMetaData = sqliteTable("scholarships_meta_data", {
// //   id: text("id", { length: 36 })
// //     .primaryKey()
// //     .$defaultFn(() => randomUUID()),
// //   scholarshipId: text("scholarship_id")
// //     .references(() => users.id, { onDelete: "cascade" })
// //     .unique()
// //     .notNull(),
// // });

export const scholarshipHosts = sqliteTable("scholarship_hosts", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  country: text("country").notNull(),
  scholarshipId: text("scholarship_id")
    .references(() => scholarships.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const ScholarshipDegrees = sqliteTable("scholarship_degrees", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  degree: text("degree").notNull(),
  scholarshipId: text("scholarship_id")
    .references(() => scholarships.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

// export const country = sqliteTable("country", {
//   id: text("id", { length: 36 })
//     .primaryKey()
//     .$defaultFn(() => randomUUID()),
//   name: text("name").notNull(),
// });

export const popularCountries = sqliteTable("popular_countries", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  country: text("name").notNull(),
  //! default to count + 1
  rank: integer("rank").notNull(),
});

export const blogTags = sqliteTable("blog_tags", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  blogId: text("blog_id")
    .references(() => blogs.id, {
      onDelete: "cascade",
    })
    .notNull(),
  tag: text("tag").notNull(),
});

export const scholarshipTags = sqliteTable("scholarship_tags", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  scholarshipId: text("scholarship_id")
    .references(() => scholarships.id, {
      onDelete: "cascade",
    })
    .notNull(),
  tag: text("tag").notNull(),
});

export const videos = sqliteTable("videos", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text("title").notNull(),
  link: text("link").notNull(),
  scholarshipId: text("scholarship_id").references(() => scholarships.id, {
    onDelete: "cascade",
  }),
  tag: text("tag").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

// //@2 create country table and many to many with scholarships, and save popularity in
// // a column

// //@2 use lists insetead of tables in tags, countries
