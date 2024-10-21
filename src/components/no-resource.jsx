import React from "react";
import Container from "./container";
import { cn } from "@/lib/utils";

export default function NoResource({
  header,
  body,
  headerStyle = "",
  bodyStyle = "",
}) {
  return (
    <Container>
      <div className="flex flex-col w-full justify-center">
        <h1 className={cn(headerStyle)}>{header}</h1>
        <p className={cn(bodyStyle)}>{body}</p>
      </div>
    </Container>
  );
}
