import Container from "@/components/container";
import SignInForm from "./sign-in-form";
import { getSession } from "@/app/api/auth/[...nextauth]/config";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await getSession();
  if (session) {
    //! redirect to where they were
    redirect("/");
  }
  return (
    <main>
      <Container>
        <SignInForm />;
      </Container>
    </main>
  );
}
