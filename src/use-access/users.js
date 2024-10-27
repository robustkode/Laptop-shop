import {
  createCustomer,
  createUser,
  getUserByEmail,
} from "@/data-access/users";
import { LoginError, PublicError } from "@/lib/errors";
import { verifyPassword } from "@/lib/utils";

export async function signInUseCase({ getUser, identifier, input }) {
  const user = await getUser(identifier);
  if (!user) {
    // throw new LoginError();
    return null;
  }

  if (user.accountType !== "credentials") {
    return null;
  }
  const isCorrectPassword = await verifyPassword(
    user.password,
    user.salt,
    input.password
  );

  if (!isCorrectPassword) {
    // throw new LoginError();
    return null;
  }

  return { id: user.id, email: user.email, role: user.role, phone: user.phone };
}


export async function signUpUseCase({ getUser, identifier, input, message }) {
  const { name, email, phone, password, ...rest } = input;
  const existingUser = await getUser(identifier);
  if (existingUser) {
    throw new PublicError("User exists with this " + message);
  }
  //! create transaction

  const id = await createUser({ password, name, email, phone });
  await createCustomer({ userId: id, ...rest });
  //! send verification email
}

export async function signUpGoogleUseCase(input) {
  const { email, name } = input;
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    const { id, role, email, phone } = existingUser;
    return { id, role, email, phone };
  }
  //! create transaction
  const { id, role, phone } = await createUser({
    name,
    email,
    accountType: "google",
  });
  await createCustomer({ userId: id, emailVerified: 1 });
  return { id, role, email, phone };
}
