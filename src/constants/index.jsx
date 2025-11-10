import {
  Home,
  Users,
  IdCard,
} from "lucide-react";

export const navbarLinks = [
  {
    links: [
      {
        label: "Home",
        icon: Home,
        path: "/dashboard",
      },
    ],
  },
  {
    links: [
      {
        label: "Department",
        icon: Users,
        path: "/dashboard/department",
      },
    ],
  },
  {
    links: [
      {
        label: "Manage Employee",
        icon: IdCard,
        path: "/dashboard/employee",
      },
    ],
  },
];
