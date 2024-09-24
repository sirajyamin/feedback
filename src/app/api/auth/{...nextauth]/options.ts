import bcryptjs from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
   providers: [
      CredentialsProvider({
         id: "credentials",
         name: "Credentials",
         credentials: {
            email: {
               label: "Email",
               type: "text",
            },
            password: { label: "Password", type: "password" },
         }, //Simply what we require from a user while signin him up
         async authorize(credentials: any): Promise<any> {
            await dbConnect();
            try {
               const user = await UserModel.findOne({
                  $or: [
                     { email: credentials.identifier },
                     { username: credentials.identifier },
                  ],
               });
               if (!user) {
                  throw new Error("No User found with this email");
               }
               if (!user.isVerified) {
                  throw new Error("Please verify your account before login");
               }
               const password = await bcryptjs.compare(
                  credentials.password,
                  user.password
               );
               if (password) {
                  return user;
               } else {
                  throw new Error("password");
               }
            } catch (error: any) {
               throw new Error(error);
            }
         },
      }),
   ],
   pages: {
      signIn: "/sing-in",
      // signOut: "/signout",
   },
   session: {
      strategy: "jwt",
   },
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token._id = user._id?.toString();
            token.username = user.username;
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
         }
         return token;
      },
      async session({ session, token }) {
         if (token) {
            session.user._id = token._id?.toString();
            session.user.username = token.username;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
         }
         return session;
      },
   },
   secret: process.env.NEXTAUTH_SECRET,
};
