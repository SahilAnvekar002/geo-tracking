import { SidebarConfig } from "../sidebar.types";
import {
  User,
} from "lucide-react";

export const applicationSidebarConfig: SidebarConfig = {
  UserManagement: [
    {
      title: "Users",
      href: "/dashboard",
      icon: <User />,
      minimumAccessRole: "admin",
    },
  ],
};
