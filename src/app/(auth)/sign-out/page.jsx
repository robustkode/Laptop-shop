import Container from "@/components/container";
import { redirect } from "next/navigation";

export default function SignOut() {
  redirect("/products");
}
