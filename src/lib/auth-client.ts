import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import {
  accessControl,
  admin,
  developer,
  owner,
  user,
} from "./rbac";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  user: {
    changeEmail: {
      enabled: false,
    },
  },
  plugins: [
    adminClient({
      ac: accessControl,
      roles: {
        developer,
        owner,
        admin,
        user,
      },
    }),
  ],
});
