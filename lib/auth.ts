import CredentialsProvider from "next-auth/providers/credentials";
import { gql } from "./hasura";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any) {
        const query = `query ($email:String!, $password:String!) {
          users(where:{email:{_eq:$email}, password:{_eq:$password}}) {
            id
            name
            email
            role
            department_id
            gender
            contact_number
          }
        }`;

        const res = await gql(query, {
          email: credentials.email,
          password: credentials.password, // We use below for bcrypt compare
        });

        if (res.errors) {
          console.error("GraphQL errors in auth:", res.errors);
          return null;
        }

        // Fetch user by email only (password check with bcrypt below)
        const emailQuery = `query ($email:String!) {
          users(where:{email:{_eq:$email}}) {
            id
            name
            email
            password
            role
            department_id
            gender
            contact_number
          }
        }`;

        const emailRes = await gql(emailQuery, { email: credentials.email });
        if (emailRes.errors) {
          console.error("GraphQL errors in auth:", emailRes.errors);
          return null;
        }

        const user = emailRes?.data?.users?.[0];
        if (!user) return null;

        // Try bcrypt compare first; fall back to plain-text for legacy passwords
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
          .catch(() => false);
        const legacyMatch = !passwordMatch && user.password === credentials.password;
        if (!passwordMatch && !legacyMatch) return null;

        if (user.role === "intern") {
          const internQ = `query ($user_id: uuid!) {
            interns(where: {user_id: {_eq: $user_id}}) {
               college: collage
               joining_date
               date_of_birth
               degree
            }
          }`;
          const internRes = await gql(internQ, { user_id: user.id });
          const internData = internRes.data?.interns?.[0] || {};
          user.college = internData.college;
          user.joining_date = internData.joining_date;
          user.date_of_birth = internData.date_of_birth;
          user.degree = internData.degree;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (trigger === "update" && session?.user) {
         token.user = { ...token.user, ...session.user };
      } else if (user) {
         token.user = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    },
  },
};