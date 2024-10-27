import Container from "@/components/container";
import SignUpForm from "./sign-up-form";
import { getSession } from "@/app/api/auth/[...nextauth]/config";
import { redirect } from "next/dist/server/api-utils";

export default async function SignUp() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  return (
    <main>
      <Container>
        <SignUpForm />;
      </Container>
    </main>
  );
}
