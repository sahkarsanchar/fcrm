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
      console.log(res.data);

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 p-8">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-orange-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-lg">
            <Building className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Department & Position Management
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl">
          <button
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
              activeTab === "departments"
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
            onClick={() => setActiveTab("departments")}
          >
            Departments
          </button>
          <button
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
              activeTab === "positions"
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
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
            <form onSubmit={handleAddDepartment} className="flex gap-3 mb-8">
              <input
                type="text"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                placeholder="Enter department name (e.g. HR, IT, Finance)"
                className="flex-1 border-2 border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
              <button
                disabled={loading}
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3.5 rounded-2xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 font-semibold"
              >
                <Plus size={20} /> Add
              </button>
            </form>

            {/* List Departments */}
            {departments.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex p-4 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mb-4">
                  <Building className="text-orange-500" size={48} />
                </div>
                <p className="text-gray-500 text-lg">No departments added yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div
                    key={dept._id}
                    className="group flex items-center justify-between border-2 border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-white to-orange-50/30 shadow-md hover:shadow-xl hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Building className="text-white" size={20} />
                      </div>
                      <span className="text-lg font-semibold capitalize text-gray-800">
                        {dept.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteDept(dept._id)}
                      className="text-gray-400 hover:text-red-500 transition-all duration-300 p-2 hover:bg-red-50 rounded-xl"
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
              className="grid md:grid-cols-3 gap-3 mb-8"
            >
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="border-2 border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium"
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
                className="border-2 border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />

              <button
                disabled={loading}
                type="submit"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3.5 rounded-2xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 font-semibold"
              >
                <Plus size={20} /> Add Position
              </button>
            </form>

            {/* List Positions */}
            {positions.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex p-4 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mb-4">
                  <Building className="text-orange-500" size={48} />
                </div>
                <p className="text-gray-500 text-lg">No positions added yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {positions.map((pos) => {
                  // Find the department name based on position's assigned department ID
                  const department = departments.find((dept) =>
                    dept.positions?.some((p) => p._id === pos._id)
                  );

                  return (
                    <div
                      key={pos._id}
                      className="group flex items-center justify-between border-2 border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-white to-purple-50/30 shadow-md hover:shadow-xl hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{pos.name}</h3>
                        <p className="text-sm text-gray-500">
                          Department:{" "}
                          <span className="font-semibold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                            {department ? department.name : "Unassigned"}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePosition(pos._id)}
                        className="text-gray-400 hover:text-red-500 transition-all duration-300 p-2 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;