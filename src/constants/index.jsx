import {
  Home,
  Image as BannerIcon,
  Boxes as ProductsIcon,
  Folder as CategoryIcon,
  FolderPlus as SubCategoryIcon,
  Newspaper as BlogIcon,
  MessageSquareQuote as TestimonialIcon,
  ShoppingCart as OrderIcon,
  Users,
  Settings,
} from "lucide-react";

export const navbarLinks = [
  {
    links: [
      {
        label: "Home",
        icon: Home,
        path: "/dashboard", // was "/"
      },
      {
        label: "Banner",
        icon: BannerIcon,
        path: "/dashboard/banner", // was "/banner"
      },
      {
        label: "Products",
        icon: ProductsIcon,
        path: "/dashboard/products",
      },
      {
        label: "Category",
        icon: CategoryIcon,
        path: "/dashboard/category",
      },
      {
        label: "SubCategory",
        icon: SubCategoryIcon,
        path: "/dashboard/subcategory",
      },
      {
        label: "Blogs",
        icon: BlogIcon,
        path: "/dashboard/blogs",
      },
      {
        label: "Testimonial",
        icon: TestimonialIcon,
        path: "/dashboard/testimonials",
      },
      // {
      //   label: "Order",
      //   icon: OrderIcon,
      //   path: "/dashboard/orders",
      // },
    ],
  },
  {
    title: "Users",
    links: [
      {
        label: "User",
        icon: Users,
        path: "/dashboard/users",
      },
    ],
  },
  // {
  //   title: "Settings",
  //   links: [
  //     {
  //       label: "Settings",
  //       icon: Settings,
  //       path: "/dashboard/settings",
  //     },
  //   ],
  // },
];
