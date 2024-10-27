"use client";
import Container from "@/components/container";
import React, { Suspense } from "react";
import ProductForm from "../_components/create-product-form";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { config } from "dotenv";
config();

export default function CreateProduct() {
  return (
    <main>
      <Container>
        {/* //! */}
        <ProductForm datas={{ product: null, tags: [] }} />
      </Container>
    </main>
  );
}
