
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from "@/lib/mongodb"

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_FRONT_ID,
      clientSecret: process.env.GOOGLE_FRONT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
};

export default NextAuth(authOptions)