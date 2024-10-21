"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  BRANDS,
  CONDITIONS,
  GENERATION,
  PRICE_RANGE,
  RAM,
  SORT,
  STORAGE,
  STORAGE_TYPE,
} from "@/config/constants";
import { useFilterContext } from "../_context";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { memo, useMemo } from "react";
import FilterItem from "./filter-item";
import { FilterIcon } from "lucide-react";

function ProductsFiter() {
  return (
    <>
      <div className="hidden md:block border-r-2 pr-2">
        <h4 className="header ">Filters</h4>
        <Filters />
      </div>
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              Filters <FilterIcon className="icon-md" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="pt-2">
            <div className="mx-auto w-full max-w-sm overflow-y-scroll h-[80vh] px-2 ">
              <div className="overflow-y-scroll">
                <div className="flex gap-8 items-center fixed bg-background w-inherit z-10">
                  <DrawerClose asChild>
                    <Button className="w-fit px-0" variant="link">
                      <X className="icon-lg" />
                    </Button>
                  </DrawerClose>
                  <h4 className="header ">Filtters</h4>
                </div>
                <div className="mt-12">
                  <Filters />
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

function Filters() {
  const { filters, dispatch } = useFilterContext();
  console.log(filters.price);
  return (
    <div className="flex flex-col gap-2">
      <Accordion type="multiple">
        <AccordionItem value="sort">
          <AccordionTrigger>
            <h4 className=" font-bold text-muted-foreground">Sort</h4>
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              defaultValue={filters.sort}
              onValueChange={(val) => {
                dispatch({
                  type: "TOGGLE_SORT",
                  payload: { value: val },
                });
              }}
            >
              <div className="flex flex-col gap-2">
                {SORT.map((s) => (
                  <div key={s.value} className="flex gap-2 items-center">
                    <RadioGroupItem id={s.value} value={s.value} />
                    <Label htmlFor={s.value}>{s.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>
            <h4 className=" font-bold text-muted-foreground">Price</h4>
          </AccordionTrigger>
          <AccordionContent>
            {filters.price ? (
              <div
                className="flex items-center gap-2 mb-2"
                onClick={() => {
                  {
                    dispatch({
                      type: "REMOVE_FILTER",
                      payload: { category: "price" },
                    });
                  }
                }}
              >
                <X className="icon-md" />
                <Button variant="link">Remover filter</Button>
              </div>
            ) : (
              ""
            )}
            {/* fix when remove price assign price to null the ui doesn't update */}
            <RadioGroup
              defaultValue={filters.price}
              onValueChange={(val) => {
                dispatch({
                  type: "TOGGLE_PRICE",
                  payload: { value: val },
                });
              }}
            >
              <div className="flex flex-col gap-2">
                {PRICE_RANGE.map((s) => (
                  <div key={s.value} className="flex gap-2 items-center">
                    <RadioGroupItem id={s.value} value={s.value} />
                    <Label htmlFor={s.value}>{s.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="brand">
          <AccordionTrigger>
            <h4 className=" font-bold text-muted-foreground">Brand</h4>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2">
              {filters.brand?.length ? (
                <li
                  className="flex items-center gap-2"
                  onClick={() => {
                    {
                      dispatch({
                        type: "REMOVE_FILTER",
                        payload: { category: "brand" },
                      });
                    }
                  }}
                >
                  <X className="icon-md" />
                  <Button variant="link">Remover filter</Button>
                </li>
              ) : (
                ""
              )}

              {BRANDS.map((b) => (
                <li key={b.value} className="flex items-center gap-2">
                  <Checkbox
                    id={b.value}
                    checked={filters.brand.includes(b.value)}
                    onCheckedChange={() => {
                      dispatch({
                        type: "TOGGLE_FILTER",
                        payload: { category: "brand", value: b.value },
                      });
                    }}
                  />
                  <Label htmlFor="1">{b.label}</Label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="condition">
          <AccordionTrigger>
            <h4 className=" font-bold text-muted-foreground">Condition</h4>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2">
              {filters.condition?.length ? (
                <li
                  className="flex items-center"
                  onClick={() => {
                    {
                      dispatch({
                        type: "REMOVE_FILTER",
                        payload: { category: "condition" },
                      });
                    }
                  }}
                >
                  <X className="icon-md" />
                  <Button variant="link">Remover filter</Button>
                </li>
              ) : (
                ""
              )}

              {CONDITIONS.map((b) => (
                <li key={b.value} className="flex items-center gap-2">
                  <Checkbox
                    id={b.value}
                    checked={filters.condition.includes(b.value)}
                    onCheckedChange={() => {
                      dispatch({
                        type: "TOGGLE_FILTER",
                        payload: { category: "condition", value: b.value },
                      });
                    }}
                  />
                  <Label htmlFor="1">{b.label}</Label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="generation">
          <AccordionTrigger>
            <h4 className=" font-bold text-muted-foreground">Generation</h4>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2">
              {filters.generation?.length ? (
                <li
                  className="flex items-center"
                  onClick={() => {
                    {
                      dispatch({
                        type: "REMOVE_FILTER",
                        payload: { category: "generation" },
                      });
                    }
                  }}
                >
                  <X className="icon-md" />
                  <Button variant="link">Remover filter</Button>
                </li>
              ) : (
                ""
              )}

              {GENERATION.map((b) => (
                <li key={b.value} className="flex items-center gap-2">
                  <Checkbox
                    id={b.value}
                    checked={filters.generation.includes(b.value)}
                    onCheckedChange={() => {
                      dispatch({
                        type: "TOGGLE_FILTER",
                        payload: { category: "generation", value: b.value },
                      });
                    }}
                  />
                  <Label htmlFor="1">{b.label}</Label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <FilterItem header={"RAM"} category={"ram"} constant={RAM} />

        <FilterItem
          header={"Storage Type"}
          category={"storageType"}
          constant={STORAGE_TYPE}
        />
        <AccordionItem value="storage">
          <AccordionTrigger>
            <h4 className=" font-bold text-muted-foreground">Storage</h4>
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              defaultValue={filters.storage}
              onValueChange={(val) => {
                dispatch({
                  type: "TOGGLE_STORAGE",
                  payload: { value: val },
                });
              }}
            >
              <div className="flex flex-col gap-2">
                {STORAGE.map((s) => (
                  <div key={s.value} className="flex items-center gap-2">
                    <RadioGroupItem id={s.value} value={s.value} />
                    <Label htmlFor={s.value}>{s.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default memo(ProductsFiter);
