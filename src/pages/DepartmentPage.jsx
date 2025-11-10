import React, { useState } from "react";
import { Building, Briefcase, Plus, Trash2 } from "lucide-react";
import { DepartmentCreate } from "../services/api.service";

const DepartmentManagement = () => {
  const [activeTab, setActiveTab] = useState("departments");
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const [department, setDeptName] = useState("");
  const [positionName, setPositionName] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const handleAddDepartment = sdy (e) => {
    e.preventDefault();
    const res = await DepartmentCreate(deptName)
  };

  const handleAddPosition = (e) => {
    e.preventDefault();
    if (!selectedDept || !positionName.trim()) return;
    const newPos = {
      id: Date.now(),
      name: positionName.trim(),
      departmentId: selectedDept,
    };
    setPositions([...positions, newPos]);
    setPositionName("");
  };

  const handleDeleteDept = (id) => {
    setDepartments(departments.filter((d) => d.id !== id));
    setPositions(positions.filter((p) => p.departmentId !== id));
  };

  const handleDeletePosition = (id) => {
    setPositions(positions.filter((p) => p.id !== id));
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

        {/* --- Departments Tab --- */}
        {activeTab === "departments" ? (
          // -------------------- DEPARTMENTS --------------------
          <div>
            <form onSubmit={handleAddDepartment} className="flex gap-3 mb-6">
              <input
                type="text"
                value={department}
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

            {/* Department List */}
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
                      <span className="text-lg font-medium capitalize">{dept.name}</span>
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
                  <option key={d.id} value={d.id}>
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

            {/* Position List */}
            {positions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No positions added yet.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {positions.map((pos) => {
                  const dept = departments.find((d) => d.id === pos.departmentId);
                  return (
                    <div
                      key={pos.id}
                      className="flex items-center justify-between border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:border-orange-300 transition"
                    >
                      <div>
                        <h3 className="text-lg font-semibold">{pos.name}</h3>
                        <p className="text-sm text-gray-500">
                          Department: {dept ? dept.name : "N/A"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePosition(pos.id)}
                        className="text-gray-400 hover:text-red-500 transition"
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
