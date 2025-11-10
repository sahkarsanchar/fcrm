import React, { useState, useEffect } from "react";
import { Building, Plus, Trash2 } from "lucide-react";
import {
  DepartmentCreate,
  GetAllDepartments,
  DeleteDepartment,
  AddPositionToDepartment,
  RemovePositionFromDepartment,
} from "../services/api.service";

import {
  CreatePosition,
  GetAllPositions,
  DeletePosition,
} from "../services/api.service";

const DepartmentManagement = () => {
  const [activeTab, setActiveTab] = useState("departments");
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const [deptName, setDeptName] = useState("");
  const [positionName, setPositionName] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch departments and positions on load
  useEffect(() => {
    fetchDepartments();
    fetchPositions();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await GetAllDepartments();
      setDepartments(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await GetAllPositions();
      setPositions(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  // 🟢 Add Department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!deptName.trim()) return alert("Department name required");

    try {
      setLoading(true);
      const res = await DepartmentCreate({ name: deptName.trim() });
      setDeptName("");
      await fetchDepartments();
      alert(res.data.message || "Department added!");
    } catch (error) {
      alert(error.response?.data?.message || "Error adding department");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Add Position (auto-assign to department)
  const handleAddPosition = async (e) => {
    e.preventDefault();
    if (!selectedDept) return alert("Select department");
    if (!positionName.trim()) return alert("Enter position name");

    try {
      setLoading(true);

      // Step 1️⃣ Create position
      const res = await CreatePosition({ name: positionName.trim() });
      const newPosition = res.data?.position;

      if (!newPosition?._id) {
        alert("Failed to create position");
        return;
      }

      // Step 2️⃣ Assign to department
      await AddPositionToDepartment(selectedDept, newPosition._id);

      // Step 3️⃣ Refresh lists
      setPositionName("");
      await Promise.all([fetchPositions(), fetchDepartments()]);

      alert(res.data.message || "Position added & assigned successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Error adding position");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete Department
  const handleDeleteDept = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      setLoading(true);
      const res = await DeleteDepartment(id);
      alert(res.data.message || "Department deleted");
      await fetchDepartments();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting department");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete Position (auto-unassign from department)
  const handleDeletePosition = async (id) => {
    if (!window.confirm("Delete this position?")) return;

    try {
      setLoading(true);

      // Step 1️⃣: Unassign (if selected department available)
      if (selectedDept) {
        await RemovePositionFromDepartment(selectedDept, id);
      }

      // Step 2️⃣: Delete position
      const res = await DeletePosition(id);

      // Step 3️⃣: Refresh UI
      await Promise.all([fetchPositions(), fetchDepartments()]);

      alert(res.data.message || "Position deleted & unassigned successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md border">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <Building className="text-orange-500" /> Department & Position Management
        </h1>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-6 py-2 font-medium ${
              activeTab === "departments"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("departments")}
          >
            Departments
          </button>
          <button
            className={`px-6 py-2 font-medium ${
              activeTab === "positions"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("positions")}
          >
            Positions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "departments" ? (
          // -------------------- DEPARTMENTS --------------------
          <div>
            <form onSubmit={handleAddDepartment} className="flex gap-3 mb-6">
              <input
                type="text"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                placeholder="Enter department name (e.g. HR, IT, Finance)"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <button
                disabled={loading}
                type="submit"
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
              >
                <Plus size={18} /> Add
              </button>
            </form>

            {/* List Departments */}
            {departments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No departments added yet.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div
                    key={dept._id}
                    className="flex items-center justify-between border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:border-orange-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Building className="text-orange-500" />
                      <span className="text-lg font-medium capitalize">
                        {dept.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteDept(dept._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // -------------------- POSITIONS --------------------
          <div>
            <form
              onSubmit={handleAddPosition}
              className="grid md:grid-cols-3 gap-3 mb-6"
            >
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
                placeholder="Enter position name (e.g. Manager, Developer)"
                className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />

              <button
                disabled={loading}
                type="submit"
                className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
              >
                <Plus size={18} /> Add Position
              </button>
            </form>

            {/* List Positions */}
            {positions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No positions added yet.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {positions.map((pos) => (
                  <div
                    key={pos._id}
                    className="flex items-center justify-between border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:border-orange-300 transition"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{pos.name}</h3>
                      <p className="text-sm text-gray-500">ID: {pos._id}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePosition(pos._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;
