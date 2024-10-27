import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "next-auth/react";
import { getCustomerByEmail, getUserByEmail } from "@/data-access/users";
import { signInAction } from "@/app/(auth)/sign-in/action";
import { signUpGoogleUseCase } from "@/use-access/users";
import { getServerSession } from "next-auth";

export const config = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
  },

  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      // if (account) {
      //   token.accessToken = account.access_token;
      //   token.id = profile.id;
      // }
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.phone = user.phone;
      } else {
        const user = await getUserByEmail(token?.email);
        //! assign newToken to token if fields in token are unneccessary
        const newToken = {
          id: user.id,
          name: user.name,
          picture: token.picture,
          role: user.role,
          phone: user.phone,
          email: user.email,
        };
        token = { ...token, ...newToken };
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.phone = token.phone;
      session.user.name = token.email;
      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const name = user.name;
        const email = user.email;

        try {
          const user = await signUpGoogleUseCase({ name, email });
          console.log(user, "this is the user");
          return true;
        } catch (error) {
          console.log(error, "google sign-up error");
          //# dont want to sign-in user with out registration
          return false;
        }
      }

      return true;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        phone: {},
      },
      async authorize(credentials) {
        // This is where you need to retrieve user data
        // to verify with credentials
        // Docs: https://next-auth.js.org/configuration/providers/credentials

        let user = await signInAction(credentials);
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
};

export function getSession() {
  return getServerSession(config);
}
