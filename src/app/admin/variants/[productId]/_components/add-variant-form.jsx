"use client";

import React, { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderButton } from "@/components/loader-button";
import useActionWrapper from "@/lib/action-wrapper";
import { addVaraintAction } from "../actions";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, { message: "Too short" }),
  price: z.coerce.number(),
  value: z.union([
    z.string().min(2, { message: "Too short" }),
    z.coerce.number(),
  ]),
  inventory: z.coerce.number(),
  productId: z.string(),
});

export default function AddVariantForm({
  productId,
  allvariants,
  allProductVariants,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const nameRef = useRef(null);
  const combinedVariantsName = useMemo(() => {
    return allvariants.map((v) => {
      return { name: v, have: allProductVariants.some((pv) => pv === v) };
    });
  }, [allvariants, allProductVariants]);

  const form = useForm({
    mode: "onchange",
    resolver: zodResolver(schema),
    defaultValues: {
      productId: productId,
      price: 2000,
      value: "Green",
      inventory: 10,
    },
  });

  const { execute, isPending, error } = useActionWrapper(addVaraintAction);

  const handleFocus = () => {
    console.log(true);
    setShowOptions(true);
  };

  //! fix onblur
  const handleBlur = () => {
    setTimeout(() => {
      setShowOptions(false);
    }, 300);
  };

  const handleVariantClick = (value) => {
    // if (value.have) return;
    form.setValue("name", value.name);
    nameRef.value = "";
  };

  const onSubmit = async (values) => {
    execute(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative">
          <FormField
            control={form.control}
            name="name"
            className="my-8"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={nameRef}
                    {...field}
                    placeholder="Color"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {showOptions ? (
            <div className="flex flex-col border shadow-md rounded-sm p-4 absolute bg-background w-[100%]">
              {combinedVariantsName.map((v) => (
                <div
                  key={v.name}
                  onClick={() => handleVariantClick(v)}
                  className={cn({
                    "cursor-pointer text-muted-foreground": v.have,
                  })}
                >
                  <p className="cursor-pointer hover:bg-muted px-2 py-0.5 rounded-sm">
                    {v.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
        <FormField
          control={form.control}
          name="value"
          className="my-8"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input {...field} placeholder={"red"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          className="my-8"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} placeholder="20000" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inventory"
          className="my-8"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Inventory</FormLabel>
              <FormControl>
                <Input {...field} placeholder="10" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="icon-lg m" />
            <AlertTitle>Oops! an error has occured.</AlertTitle>
            <AlertDescription>{error?.message}</AlertDescription>
          </Alert>
        )}
        <LoaderButton isLoading={isPending} className={"mt-32 ml-auto"}>
          Post
        </LoaderButton>
      </form>
    </Form>
  );
}
