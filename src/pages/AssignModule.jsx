import React, { useEffect, useState } from "react";
import { GetAllUsers } from "../services/api.service";
import apiAdmin from "../services/interceptor";

const AssignModule = ({ user, onClose }) => {
  const [assignToList, setAssignToList] = useState([]); // possible supervisors
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [assignLabel, setAssignLabel] = useState("");

  useEffect(() => {
    const fetchAssignableUsers = async () => {
      const res = await GetAllUsers();
      const allUsers = res.data;

      let levelToAssign = "";
      let label = "";

      // Determine target level and label dynamically
      if (user.level === "level4") {
        levelToAssign = "level3";
        label = "Team Leader";
      } else if (user.level === "level3") {
        levelToAssign = "level2";
        label = "HOD";
      } else if (user.level === "level2") {
        levelToAssign = "level1";
        label = "Top Management";
      } else {
        label = "N/A";
      }

      const filtered = allUsers.filter((u) => u.level === levelToAssign);
      setAssignToList(filtered);
      setAssignLabel(label);
    };

    fetchAssignableUsers();
  }, [user]);

  const handleAssign = async () => {
    if (!selectedSupervisor) return alert("Please select a user to assign under.");

    try {
      let endpoint = "";

      if (user.level === "level4") {
        endpoint = "/assign-level3";
        await apiAdmin.post(endpoint, {
          employeeId: user._id,
          teamLeaderId: selectedSupervisor,
        });
      } else if (user.level === "level3") {
        endpoint = "/assign-level2";
        await apiAdmin.post(endpoint, {
          teamLeaderId: user._id,
          hodId: selectedSupervisor,
        });
      } else if (user.level === "level2") {
        endpoint = "/assign-level1";
        await apiAdmin.post(endpoint, {
          hodId: user._id,
          managementId: selectedSupervisor,
        });
      } else {
        return alert("This user cannot be assigned further.");
      }

      alert(`✅ ${user.name} assigned successfully!`);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error assigning user.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Assign {user.name} ({user.level}) to {assignLabel}
        </h2>

        {assignToList.length > 0 ? (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">
              Select {assignLabel}
            </label>
            <select
              className="w-full border p-2 rounded"
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
            >
              <option value="">-- Choose {assignLabel} --</option>
              {assignToList.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-gray-600 mb-4">
            No available {assignLabel} users found.
          </p>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModule;
