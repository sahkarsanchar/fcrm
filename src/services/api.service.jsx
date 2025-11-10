import apiAdmin from "./interceptor";

export const AdminLoginService = (data) => {
  return apiAdmin.post("/admin/login", data);
};

export const FetchCountry = () => {
  apiAdmin.fetch("https://api.sacmanagementindia.com/api/country");
}

export const DepartmentCreate = (formData) => {
  apiAdmin.post("/dep/department", formData);
}

