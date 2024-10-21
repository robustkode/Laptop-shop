import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFilterContext } from "../_context";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function FilterItem({ header, category, constant }) {
  const { filters, dispatch } = useFilterContext();
  return (
    <AccordionItem value={category}>
      <AccordionTrigger>
        <h4 className="font-bold text-muted-foreground whitespace-nowrap">
          {header}
        </h4>
      </AccordionTrigger>
      <AccordionContent>
        <ul className="flex flex-col gap-2">
          {filters[category]?.length ? (
            <li
              className="flex items-center"
              onClick={() => {
                {
                  dispatch({
                    type: "REMOVE_FILTER",
                    payload: { category: category },
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

          {constant.map((b) => (
            <li key={b.value} className="flex items-center gap-2">
              <Checkbox
                id={b.value}
                checked={filters[category]?.includes(b.value)}
                onCheckedChange={() => {
                  dispatch({
                    type: "TOGGLE_FILTER",
                    payload: { category: category, value: b.value },
                  });
                }}
              />
              <Label htmlFor="1">{b.label}</Label>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
