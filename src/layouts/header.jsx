import { Menu, User } from "lucide-react";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const Header = ({ collapsed, setCollapsed }) => {
  const { user } = useContext(UserContext);

  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
      {/* Menu Toggle Button */}
      <button
        className="btn-ghost size-10 flex items-center justify-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className={collapsed ? "rotate-180 transition-transform" : ""} />
      </button>

      {/* User Info (No Dropdown) */}
      <div className="flex items-center gap-2 mr-6">
        <User size={20} />
        <span className="text-sm font-medium whitespace-nowrap">
          {user?.fullName}
        </span>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func.isRequired,
};
