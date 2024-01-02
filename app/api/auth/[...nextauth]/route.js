import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/app/lib/mongo/client";
import { nanoid } from "nanoid";
import { validateZodInput } from "@/app/validators";
import { UserZodSchema } from "@/app/schema";
import UserService from "@/app/lib/mongo/user";
import { encryptString, signJwtToken, verifyJwtToken } from "@/app/lib/jwt";

const generateAccessToken = async ({ accessToken, user, isRefresh }) => {
  try {
    const verifyAccessToken = await verifyJwtToken(accessToken);
    if (!isRefresh && !accessToken) {
      const encryptData = encryptString(JSON.stringify(user));
      const signToken = await signJwtToken({ user: encryptData });
      return signToken;
    }
    if (isRefresh && verifyAccessToken.isError) {
      const result = await UserService.getCurrentUser(user.id);
      if (result.isError) throw new Error(result.message);

      const encryptData = encryptString(JSON.stringify(result.data));
      const signToken = await signJwtToken({ user: encryptData });
      return signToken;
    }
    return accessToken;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const authOptions = {
  providers: [
    /*
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email e.g me@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        try {
          const parsedResult = validateZodInput(credentials, UserZodSchema);
          if (parsedResult.isError) throw new Error(parsedResult.message);
          const result = await UserService.createUser(parsedResult.data);
          if (result.isError) throw new Error(result.message);
          return result.data;
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
    */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: async (user) => {
        const role = user?.hasOwnProperty("role") ? user.role : "user";
        const createdAt = user?.hasOwnProperty("createdAt")
          ? user?.createdAt
          : new Date().toISOString();
        const updatedAt = user?.hasOwnProperty("updatedAt")
          ? user?.updatedAt
          : new Date().toISOString();
        const avatar = user?.picture;
        const isEmailVerified = user?.hasOwnProperty("email_verified")
          ? user?.email_verified
          : false;

        return {
          id: user?.sub,
          name: user?.name,
          email: user?.email,
          role,
          createdAt,
          updatedAt,
          avatar,
          emailVerified: user?.email_verified,
        };
      },
      /*
      profile(user) {
        const role = user?.hasOwnProperty("role") ? user.role : "user";
        const createdAt = user?.hasOwnProperty("createdAt")
        ? user?.createdAt
        : new Date().toISOString();
        const updatedAt = user?.hasOwnProperty("updatedAt")
        ? user?.updatedAt
        : new Date().toISOString();
        const avatar = user?.picture;
        
        return {
          id: user?.sub,
          name: user?.name,
          email: user?.email,
          role,
          createdAt,
          updatedAt,
          avatar,
          emailVerified: user.email_verified,
        };
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      */
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return url;
      return baseUrl;
    },
    async session({ session, token, user }) {
      if (token) {
        session.user = token?.user;
        session.accessToken = token?.accessToken;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser, trigger, session }) {
      if (token && user) {
        const _user = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          avatar: user.avatar,
          cart: user.cart,
          wishlist: user.wishlist,
        };
        //generate acess token
        const accessToken = await generateAccessToken({
          accessToken: token?.accessToken,
          user: _user,
          isRefresh: false,
        });
        token.user = _user;
        token.accessToken = accessToken;
      }
      if (token && !user) {
        const _user = token?.user;
        const accessToken = await generateAccessToken({
          accessToken: token?.accessToken,
          user: _user,
          isRefresh: true,
        });
        token.user = _user;
        token.accessToken = accessToken;
      }
      if (trigger === "update" && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.user.name = session.name;
      }
      if (trigger === "update" && session?.cart) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.user.cart = session.cart;
      }
      if (trigger === "update" && session?.wishlist) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.user.wishlist = session.wishlist;
      }
      return token;
    },
  },
  pages: {
    //signIn: "/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    generateSessionToken: () => {
      return nanoid(32);
    },
  },
  adapter: MongoDBAdapter(clientPromise),
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
