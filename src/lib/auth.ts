import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { admin as adminPlugin } from "better-auth/plugins";
import {
  accessControl,
  admin,
  developer,
  owner,
  user,
} from "./rbac";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mongodb" }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: false,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    adminPlugin({
      ac: accessControl,
      roles: {
        developer,
        owner,
        admin,
        user,
      },
      defaultRole: "user",
    }),
    nextCookies(),
  ],
  advanced: {
    cookiePrefix: "taskNX",
  },
});
