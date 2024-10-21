"use client";

import { useParams, useSearchParams } from "next/navigation";
import { z } from "zod";

export function useSafeParams(schema) {
  const params = useParams();
  const result = schema.parse(params);
  return result;
}

export function useSafeSearchParams(schema) {
  const params = useSearchParams();
  const result = schema.parse(params);
  return result;
}
