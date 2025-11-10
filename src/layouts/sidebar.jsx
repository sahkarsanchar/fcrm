import { forwardRef, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { navbarLinks } from "../constants";

// import logoLight from "../assets/titlelogo.png";
import { cn } from "../utils/cn";

import PropTypes from "prop-types";
import { UserContext } from "../context/UserContext";
import { LogOut } from "lucide-react";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  const { logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      <Link to={"/dashboard"} className="flex gap-x-3 p-3">
        {/* <img src={logoLight} alt="Furniture" className=" " /> */}
        <h2>Logo</h2>
      </Link>
      <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
        {navbarLinks.map((navbarLink, index) => (
          <nav
            key={index}
            className={cn("sidebar-group", collapsed && "md:items-center")}
          >
            <p
              className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}
            >
              {navbarLink.title}
            </p>
            {navbarLink.links.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                end={link.path === "/dashboard"}
                className={({ isActive }) =>
                  cn(
                    "sidebar-item",
                    collapsed && "md:w-[45px]",
                    isActive && "bg-[#ffbf00] text-white font-medium rounded"
                  )
                }
              >
                <link.icon size={22} className="flex-shrink-0" />
                {!collapsed && (
                  <p className="whitespace-nowrap">{link.label}</p>
                )}
              </NavLink>
            ))}
          </nav>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};
