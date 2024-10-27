"use client";

import { Button } from "@/components/ui/button";
import { runSeed } from "@/db/seed";

export default function SeedPage() {
  const onSubmit = async (e) => {
    e.preventDefault();
    ("use server");
    await runSeed();
  };
  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <Button>Seed</Button>
    </form>
  );
}
