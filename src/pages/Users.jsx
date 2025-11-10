import React, { useEffect, useState } from "react";
import { GetAllUsers } from "../services/api.service";
import { Mail, Phone, Building2, Briefcase, UserCircle, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLevels, setExpandedLevels] = useState({});
  const [currentPages, setCurrentPages] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await GetAllUsers();
        setUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAssign = async (user) => {
    try {
      if (!window.confirm(`Assign ${user.name} (L3) as Team Leader (L2)?`)) return;
      const response = await fetch(`/api/users/${user._id}/assign-level`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newLevel: 2, role: "Team Leader" }),
      });

      if (!response.ok) throw new Error("Failed to assign user");

      alert(`${user.name} has been assigned to Level 2 as Team Leader`);
      window.location.reload();
    } catch (error) {
      console.error("Assign failed:", error);
      alert("Error assigning user. Please try again.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department &&
        user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const usersByLevel = filteredUsers.reduce((acc, user) => {
    const level = user.level || "Unassigned";
    if (!acc[level]) acc[level] = [];
    acc[level].push(user);
    return acc;
  }, {});

  const sortedLevels = Object.keys(usersByLevel).sort((a, b) => {
    if (a === "Unassigned") return 1;
    if (b === "Unassigned") return -1;
    return a.localeCompare(b);
  });

  const toggleLevel = (level) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const getCurrentPage = (level) => currentPages[level] || 1;

  const setCurrentPage = (level, page) => {
    setCurrentPages((prev) => ({
      ...prev,
      [level]: page,
    }));
  };

  const getPaginatedUsers = (level) => {
    const levelUsers = usersByLevel[level];
    const currentPage = getCurrentPage(level);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return levelUsers.slice(startIndex, endIndex);
  };

  const getTotalPages = (level) => {
    return Math.ceil(usersByLevel[level].length / itemsPerPage);
  };

  const getLevelColor = (level) => {
    const colors = {
      Junior: "from-green-500 to-green-600",
      Mid: "from-blue-500 to-blue-600",
      Senior: "from-purple-500 to-purple-600",
      Lead: "from-red-500 to-red-600",
      Manager: "from-yellow-500 to-yellow-600",
      Director: "from-pink-500 to-pink-600",
      Unassigned: "from-gray-500 to-gray-600",
    };
    return colors[level] || "from-orange-500 to-orange-600";
  };

  const getLevelBadgeColor = (level) => {
    const colors = {
      Junior: "bg-green-100 text-green-800",
      Mid: "bg-blue-100 text-blue-800",
      Senior: "bg-purple-100 text-purple-800",
      Lead: "bg-red-100 text-red-800",
      Manager: "bg-yellow-100 text-yellow-800",
      Director: "bg-pink-100 text-pink-800",
      Unassigned: "bg-gray-100 text-gray-800",
    };
    return colors[level] || "bg-orange-100 text-orange-800";
  };

  const getButtonColor = (level) => {
    const colors = {
      Junior: "bg-green-500 hover:bg-green-600",
      Mid: "bg-blue-500 hover:bg-blue-600",
      Senior: "bg-purple-500 hover:bg-purple-600",
      Lead: "bg-red-500 hover:bg-red-600",
      Manager: "bg-yellow-500 hover:bg-yellow-600",
      Director: "bg-pink-500 hover:bg-pink-600",
      Unassigned: "bg-gray-500 hover:bg-gray-600",
    };
    return colors[level] || "bg-orange-500 hover:bg-orange-600";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">
            Loading users...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                  <UserCircle className="text-white w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    All Registered Users
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredUsers.length}{" "}
                    {filteredUsers.length === 1 ? "user" : "users"} across{" "}
                    {sortedLevels.length}{" "}
                    {sortedLevels.length === 1 ? "level" : "levels"}
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            {/* Items per page */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Items per page:
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tables by Level */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
              <UserCircle className="w-12 h-12 text-orange-500" />
            </div>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              No users found
            </p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedLevels.map((level) => {
              const totalPages = getTotalPages(level);
              const currentPage = getCurrentPage(level);
              const paginatedUsers = getPaginatedUsers(level);
              const startIndex = (currentPage - 1) * itemsPerPage;

              return (
                <div
                  key={level}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  {/* Level Header */}
                  <button
                    onClick={() => toggleLevel(level)}
                    className={`w-full px-6 py-4 bg-gradient-to-r ${getLevelColor(
                      level
                    )} flex items-center justify-between hover:opacity-90 transition-opacity`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold text-lg">
                        {level}
                      </span>
                      <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-black text-sm font-semibold">
                        {usersByLevel[level].length}{" "}
                        {usersByLevel[level].length === 1 ? "user" : "users"}
                      </span>
                    </div>
                    {expandedLevels[level] ? (
                      <ChevronUp className="w-6 h-6 text-white" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-white" />
                    )}
                  </button>

                  {/* Table */}
                  {expandedLevels[level] && (
                    <>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                #
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Profile
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Mobile
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Department
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Position
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Created
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedUsers.map((user, index) => (
                              <tr
                                key={user._id}
                                className="hover:bg-orange-50 transition-colors duration-150"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getLevelBadgeColor(
                                      level
                                    )} font-semibold text-sm`}
                                  >
                                    {startIndex + index + 1}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="relative">
                                    <img
                                      src={
                                        user.image ||
                                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                      }
                                      alt={user.name}
                                      className="w-12 h-12 rounded-full border-2 border-orange-300 object-cover shadow-md"
                                    />
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  <Mail className="inline w-4 h-4 mr-1 text-orange-500" />
                                  {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  <Phone className="inline w-4 h-4 mr-1 text-orange-500" />
                                  {user.mobile || "—"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {user.department || "Not Assigned"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {user.position || "Not Assigned"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(user.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </td>

                                {/* Action */}
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  {user.level === "3" ? (
                                    <button
                                      onClick={() => handleAssign(user)}
                                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform"
                                    >
                                      Assign as Team Leader (L2)
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 text-sm">
                                      —
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                          <div className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-semibold">
                              {startIndex + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold">
                              {Math.min(
                                startIndex + itemsPerPage,
                                usersByLevel[level].length
                              )}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold">
                              {usersByLevel[level].length}
                            </span>{" "}
                            users
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setCurrentPage(level, currentPage - 1)
                              }
                              disabled={currentPage === 1}
                              className={`px-3 py-2 rounded-lg text-white font-medium text-sm transition-colors ${currentPage === 1
                                ? "bg-gray-300 cursor-not-allowed"
                                : getButtonColor(level)
                                }`}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(level, page)}
                                className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${currentPage === page
                                  ? `${getButtonColor(level)} text-white`
                                  : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                                  }`}
                              >
                                {page}
                              </button>
                            ))}

                            <button
                              onClick={() =>
                                setCurrentPage(level, currentPage + 1)
                              }
                              disabled={currentPage === totalPages}
                              className={`px-3 py-2 rounded-lg text-white font-medium text-sm transition-colors ${currentPage === totalPages
                                ? "bg-gray-300 cursor-not-allowed"
                                : getButtonColor(level)
                                }`}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
