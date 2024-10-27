"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { operatingSystems, productStatus } from "@/db/schema/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRANDS, CONDITIONS, STORAGE_TYPE } from "@/config/constants";
import { useForm } from "react-hook-form";
import { LoaderButton } from "@/components/loader-button";
import { useFormState, useFormStatus } from "react-dom";
import {
  createProductAction,
  getPresignedPostUrlAction,
  postProductAction,
  updateProductAction,
} from "../create/action";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useActionWrapper from "@/lib/action-wrapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { CheckIcon } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn, uploadImage } from "@/lib/utils";
import Link from "next/link";
import { X } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import DropImage from "./drop-image";

const schema = z.object({
  name: z.string().min(5, { message: "Too short" }),
  description: z.string().min(5, { message: "Too short" }),
  price: z.coerce.number({ message: "Enter number!" }),
  brand: z.enum(BRANDS.map((b) => b.value)),
  inventory: z.coerce.number({ message: "Enter number!" }),
  brand: z.string().min(2, { message: "Too short!" }),
  condition: z.enum(CONDITIONS.map((c) => c.value)),
  generation: z.coerce.number({ message: "Enter number!" }),
  model: z.string().min(3, { message: "Too short!" }),
  ram: z.coerce.number({ message: "Enter number!" }),
  storage: z.coerce.number({ message: "Enter number!" }),
  storageType: z.enum(STORAGE_TYPE.map((s) => s.value)),
  tags: z.string(),
  id: z.string().optional(),
});

const initSelected = (data) => {
  let final = [];
  try {
    final = data.map((t) => {
      return t.name;
    });
  } catch (err) {}
  return final;
};

const getAllTags = async () => {
  return await apiClient.get(process.env.NEXT_PUBLIC_API_URL + "/tags");
};

export default function ProductForm({
  datas: { product: data, productTags = [] },
}) {
  const {
    data: allTags,
    error: tagsError,
    isPending: isTagsPending,
  } = useQuery({
    queryKey: ["alltags"],
    queryFn: getAllTags,
  });

  const { toast } = useToast();

  const [selectedTags, setSelectedTags] = useState(
    data ? initSelected(productTags) : []
  );
  const [tagValue, setTagValue] = useState("");
  const [similarTags, setSimilarTags] = useState([]);
  const [showSimilar, setShowSimilar] = useState(false);
  const [file, setFile] = useState(data?.images || null);

  const form = useForm({
    mode: "onchange",
    resolver: zodResolver(schema),
    defaultValues: data
      ? {
          name: data.name,
          description: data.description,
          price: data.price,
          brand: data.brand, // Replace with a valid brand from BRANDS
          inventory: data.inventory,
          condition: data.condition, // Replace with a valid condition from productStatus
          generation: data.generation,
          model: data.model,
          ram: data.ram,
          storage: data.storage,
          storageType: data.storageType, // Replace with a valid storage type from STORAGE_TYPE
          tags: initSelected(data).join(","),
          images: data.images,
          id: data.id,
        }
      : {
          name: "Sample Product",
          description: "This is a great product that does many things.",
          price: 29.99,
          brand: "apple", // Replace with a valid brand from BRANDS
          inventory: 100,
          condition: "new", // Replace with a valid condition from productStatus
          generation: 5,
          model: "ModelX123",
          ram: 16,
          storage: 256,
          storageType: "ssd", // Replace with a valid storage type from STORAGE_TYPE
          tags: "",
          images:
            "https://example.com/image1.jpg, https://example.com/image2.jpg",
        },
  });
  const { execute, isPending, error } = useActionWrapper(
    data ? updateProductAction : createProductAction
  );

  const { execute: getUrl, isPending: isUpoloadingPending } = useActionWrapper(
    getPresignedPostUrlAction
  );

  const onSubmit = async (values) => {
    const urlRes = await uploadImage(getUrl, file, toast);

    const tags = selectedTags.map((tag) => {
      const tagWithId = allTags.find((t) => t.name === tag);
      return tagWithId
        ? { id: tagWithId.id, name: tag }
        : { id: null, name: tag };
    });
    execute({
      ...values,
      tags,
      images: urlRes ? urlRes : data?.images ? data.images : "",
    });
  };

  const handleSetValue = (val, cat, setFun) => {
    if (selectedTags.includes(val)) {
      const newValList = selectedTags.filter((v) => v !== val);
      setFun([...newValList]);
    } else {
      setFun([...selectedTags, val]);
    }
  };

  const handleTagsInputChange = (e) => {
    const value = e.target.value;

    if (value.charAt(value.length - 1) === ",") {
      if (tagValue.trim()) {
        handleSetValue(tagValue.trim(), "tags", setSelectedTags);
      }
      setSimilarTags([...allTags]);
      setTagValue("");
    } else {
      setTagValue(value);
      setSimilarTags(
        allTags.filter((tag) =>
          tag.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleFocus = () => {
    setShowSimilar(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSimilar(false);
    }, 300);
  };

  useEffect(() => {
    if (allTags) {
      setSimilarTags(allTags);
    }
  }, [allTags]);

  return (
    <div className="">
      {!data ? (
        <h2 className="page-header mb-6">Post a product</h2>
      ) : (
        <h2 className="page-header mb-6">Update product</h2>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DropImage img={file} setImg={setFile} />
          <FormField
            control={form.control}
            name="name"
            className="my-8"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            className="my-8"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 items-center md:gap-8">
            <FormField
              control={form.control}
              name="brand"
              className="my-4 "
              render={({ field }) => (
                <FormItem className=" mb-4">
                  <FormLabel>Brand</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BRANDS.map((brand) => (
                        <SelectItem value={brand.value} key={brand.value}>
                          {brand.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              className="my-8"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 items-center md:gap-8">
            <FormField
              control={form.control}
              name="price"
              className="my-8"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 items-center md:gap-8">
            <FormField
              control={form.control}
              name="condition"
              className="my-4"
              render={({ field }) => (
                <FormItem className="mt-2 mb-4">
                  <FormLabel>Condition</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONDITIONS.map((condition) => (
                        <SelectItem
                          value={condition.value}
                          key={condition.value}
                        >
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="generation"
              className="my-8"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Generation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 items-center md:gap-8">
            <FormField
              control={form.control}
              name="ram"
              className="my-8"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>RAM</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storageType"
              className="my-4"
              render={({ field }) => (
                <FormItem className="mt-2 mb-4">
                  <FormLabel>Storage type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STORAGE_TYPE.map((type) => (
                        <SelectItem value={type.value} key={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid md:grid-cols-2 items-center md:gap-8"></div>

          <FormField
            control={form.control}
            name="storage"
            className="my-8"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Storage</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="relative">
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((t) => (
                <p
                  key={t}
                  className="cursor-pointer bg-primary px-2 py-1 rounded-sm text-primary-foreground flex gap-1 items-center"
                  onClick={() =>
                    setSelectedTags((oldVal) =>
                      oldVal.filter((tag) => tag !== t)
                    )
                  }
                >
                  {t}
                  <X className="icon-lg text-secondary" />
                </p>
              ))}
            </div>
            <FormField
              control={form.control}
              name="tags"
              className="my-8"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      value={tagValue}
                      onChange={handleTagsInputChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showSimilar ? (
              isTagsPending ? (
                <div>Loading</div>
              ) : (
                <div className="flex flex-col absolute bg-background shadow-md w-[100%] border p-4">
                  {similarTags.map((tag) => (
                    <div
                      key={tag.id}
                      onClick={() =>
                        handleSetValue(tag.name, "tags", setSelectedTags)
                      }
                      className={cn(
                        {
                          "text-primary": selectedTags.includes(tag.name),
                        },
                        "hover:bg-muted p-1 px-2"
                      )}
                    >
                      <p className="cursor-pointer">{tag.name}</p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              ""
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>
                Oops!, we couldn&apos;t create the product
              </AlertTitle>

              <AlertDescription>
                {error?.message || "Unknow error!"}
              </AlertDescription>
            </Alert>
          )}
          <LoaderButton
            isLoading={isPending || isUpoloadingPending}
            className={"mt-8 ml-auto"}
          >
            {data ? "Update" : "Post"}
          </LoaderButton>
        </form>
      </Form>
    </div>
  );
}
