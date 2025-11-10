import apiAdmin from "./interceptor";

// Login User API
export const AdminLoginService = (data) => {
  return apiAdmin.post("/users/login", data);
};

// blogs
export const CreateBlogsService = (data) => {
  return apiAdmin.post("/blogs/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const GetAllBlogsService = (data) => {
  return apiAdmin.get("/blogs/all", data);
};

export const DeleteBlogsService = (id) => {
  return apiAdmin.delete(`/blogs/${id}`);
};

// testimonail

export const CreateTestimonialservice = (data) => {
  return apiAdmin.post("/testimonials/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getAllTestimonialservice = (data) => {
  return apiAdmin.get("/testimonials/all");
};
export const deleteTestimonialservice = (id) => {
  return apiAdmin.delete(`/testimonials/${id}`);
};

// banner
export const CreateBannerservice = (data) => {
  return apiAdmin.post("/banner", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getAllBannerservice = () => {
  return apiAdmin.get("/banner");
};
export const deleteBannerservice = (id) => {
  return apiAdmin.delete(`/banner/${id}`);
};

// categories/

export const createCategoriesservice = (data) => {
  return apiAdmin.post("/categories/create", data);
};
export const getCategoriesservice = (data) => {
  return apiAdmin.get("/categories/all", data);
};
export const deleteCategoriesservice = (id) => {
  return apiAdmin.delete(`/categories/delete/${id}`);
};

// subCategory

export const createSubCategoriesservice = (data) => {
  return apiAdmin.post("/subcategories/create", data);
};
export const getSubCategoriesservice = () => {
  return apiAdmin.get("/subcategories/all");
};

export const deleteSubCategoriesservice = async (id) => {
  return apiAdmin.delete(`/subcategories/delete/${id}`);
};

// products

export const createProductService = (data) => {
  return apiAdmin.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getProductService = () => {
  return apiAdmin.get("/products");
};

export const getByIdProductService = async (id) => {
  return apiAdmin.get(`/products/${id}`);
};
export const deleteProductService = async (id) => {
  return apiAdmin.delete(`/products/${id}`);
};

export const UpdateProductService = async (id, data) => {
  return apiAdmin.patch(`/products/${id}`, data);
};
