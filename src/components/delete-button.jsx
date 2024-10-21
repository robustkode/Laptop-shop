"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DoorOpen } from "lucide-react";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import useActionWrapper from "@/lib/action-wrapper";
import { LoaderButton } from "./loader-button";

export function DeleteButton({
  action,
  tobedeltedID,
  successMessage,
  title,
  description,
  label = "Delete",
  type = "submit",
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const { execute, isPending, error, data } = useActionWrapper(action);

  const onSubmit = async () => {
    const result = await execute(tobedeltedID);
    if (result?.error) {
      toast({
        title: "Uh oh",
        variant: "destructive",
        description: "Something went wrong." + result.error.message,
      });
    } else {
      toast({
        title: "Success",
        description: successMessage,
      });
    }
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"link"} className={cn("w-fit")} type={type}>
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton
            isLoading={isPending}
            onClick={() => {
              onSubmit(tobedeltedID);
            }}
          >
            {label}
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
