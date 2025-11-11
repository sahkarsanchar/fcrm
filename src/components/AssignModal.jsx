import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { GetAllUsers, AssignUserService } from "../services/api.service";

const AssignModal = ({ show, onClose, user, onAssigned }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const levelOrder = {
    level1: 1,
    level2: 2,
    level3: 3,
    level4: 4,
    level5: 5,
  };

  useEffect(() => {
    if (show) fetchUsers();
  }, [show]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await GetAllUsers();
      const allUsers = response?.data || [];
      setUsers(allUsers);

      if (user && user.level) {
        const currentLevel = user.level.toLowerCase();
        let allowedLevel = null;

        if (currentLevel === "level3") allowedLevel = "level2";
        else if (currentLevel === "level4") allowedLevel = "level3";
        else if (currentLevel === "level2") allowedLevel = "level1";

        const filtered = allowedLevel
          ? allUsers.filter((u) => u.level?.toLowerCase() === allowedLevel)
          : [];

        setFilteredUsers(filtered);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedUser || !user) return;

    try {
      setSubmitting(true);

      const payload = {
        fromId: user._id, // The current user from which assignment is happening
        toId: selectedUser._id, // The leader being assigned
        action: "assign",
      };

      const response = await AssignUserService(payload);

      alert(response.data.message || "Assigned successfully!");

      if (onAssigned) onAssigned();
      onClose();
    } catch (error) {
      console.error("Assignment failed:", error);
      alert(error.response?.data?.message || "Assignment failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Assign Team Leader
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          User:{" "}
          <span className="font-semibold text-gray-800">{user?.name}</span> (
          {user?.level || "Unassigned"})
        </p>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Leader from Upper Level
          </label>
          <select
            value={selectedUser?._id || ""}
            onChange={(e) => {
              const chosen = filteredUsers.find(
                (u) => u._id === e.target.value
              );
              setSelectedUser(chosen);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">
              {loading
                ? "Loading users..."
                : filteredUsers.length === 0
                ? "No available leaders found"
                : "-- Select User --"}
            </option>

            {!loading &&
              filteredUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.level})
                </option>
              ))}
          </select>
        </div>

        {selectedUser && (
          <div className="flex items-center gap-3 mb-6">
            <img
              src={
                selectedUser?.image ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={selectedUser?.name}
              className="w-12 h-12 rounded-full border-2 border-orange-300 object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {selectedUser?.name}
              </h3>
              <p className="text-sm text-gray-600">{selectedUser?.email}</p>
              <p className="text-sm text-gray-500">{selectedUser?.level}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedUser || submitting}
            className={`px-4 py-2 rounded-lg text-white transition ${
              selectedUser && !submitting
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? "Assigning..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
