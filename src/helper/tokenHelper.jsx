// ✅ Get JWT token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// ✅ Save JWT token to localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// ✅ Set user data object to localStorage
export const setData = (data) => {
  localStorage.setItem("data", JSON.stringify(data));
};

// ✅ Set user role to localStorage
export const setRole = (role) => {
  localStorage.setItem("role", role);
};

// ✅ Get specific key from saved user data
export const getData = (key) => {
  const data = localStorage.getItem("data");
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    return parsed?.[key] ?? null;
  } catch (err) {
    console.error("Error parsing localStorage data:", err);
    return null;
  }
};

// ✅ Remove JWT token
export const removeToken = () => {
  localStorage.removeItem("token");
};

// ✅ Clear all localStorage (logout)
export const clearStorage = () => {
  localStorage.clear();
};
