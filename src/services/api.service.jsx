import apiAdmin from "./interceptor";

export const AdminLoginService = (data) => {
  return apiAdmin.post("/admin/auth/login", data);
};

// 🟢 Create Department
export const DepartmentCreate = (formData) => {
  return apiAdmin.post("/dep/department", formData);
};

// 📋 Get All Departments
export const GetAllDepartments = () => {
  return apiAdmin.get("/dep/department");
};

// 🔍 Get Department by ID
export const GetDepartmentById = (id) => {
  return apiAdmin.get(`/dep/department/${id}`);
};

// ✏️ Update Department
export const UpdateDepartment = (id, data) => {
  return apiAdmin.put(`/dep/department/${id}`, data);
};

// 🗑️ Delete Department
export const DeleteDepartment = (id) => {
  return apiAdmin.delete(`/dep/department/${id}`);
};

// ➕ Add Position to Department
export const AddPositionToDepartment = (deptId, positionId) => {
  return apiAdmin.post(`/dep/department/${deptId}/position`, { positionId });
};

// ❌ Remove Position from Department
export const RemovePositionFromDepartment = (deptId, positionId) => {
  return apiAdmin.delete(`/dep/department/${deptId}/position`, {
    data: { positionId },
  });
};


//
// 💼 POSITION APIS
//

// ➕ Create Position
export const CreatePosition = (data) => {
  return apiAdmin.post("/dep/position/create", data);
};

// 📋 Get All Positions
export const GetAllPositions = () => {
  return apiAdmin.get("/dep/position");
};

// 🔍 Get Position by ID
export const GetPositionById = (id) => {
  return apiAdmin.get(`/dep/position/${id}`);
};

// ✏️ Update Position
export const UpdatePosition = (id, data) => {
  return apiAdmin.put(`/dep/position/update/${id}`, data);
};

// 🗑️ Delete Position
export const DeletePosition = (id) => {
  return apiAdmin.delete(`/dep/position/${id}`);
};

// ✅ Create User (with image upload)
export const CreateUser = (formData) => {
  return apiAdmin.post("/dep/user/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ✅ Get all Users
export const GetAllUsers = () => {
  return apiAdmin.get("/dep/user");
};

// ✅ Get single User by ID
export const GetUserById = (id) => {
  return apiAdmin.get(`/dep/user/${id}`);
};

// ✅ Update User (with optional image)
export const UpdateUser = (id, formData) => {
  return apiAdmin.put(`/dep/user/edit/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ✅ Delete User
export const DeleteUser = (id) => {
  return apiAdmin.delete(`/dep/user/delete/${id}`);
};

// ✅ Login User
export const LoginUser = (data) => {
  return apiAdmin.post("/dep/user/login", data);
};

export const GetAllDepartmentRoleService = () => {
  apiAdmin.get("/dep/department");
}


export const AssignUserService = async (data) => {
  return apiAdmin.post("/ass/assign", data);
};