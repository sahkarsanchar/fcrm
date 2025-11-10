import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CreateBlogsService,
  GetAllBlogsService,
  DeleteBlogsService,
} from "../services/api.service";
import { toast } from "react-toastify";

const initialFormData = {
  title: "",
  image: null,
  description: "",
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState("");

  // Open & Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData(initialFormData);
    setPreview("");
    setOpen(false);
  };

  // Fetch Blogs
  const getBlogs = async () => {
    setIsLoading(true);
    GetAllBlogsService()
      .then((res) => {
        console.log(res);
        const blogList = res?.data || [];
        console.log(blogList);
        setBlogs(blogList);
      })
      .catch((err) => {
        console.error("Fetch blogs failed:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getBlogs();
  }, []);

  // Input Handlers
  const handleChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleFileUpload = ({ target: { files } }) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      toast.warn("Please upload a valid image file.");
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("image", formData.image);
      const response = await CreateBlogsService(data);
      const newBlog = response.data.newBlog;
      toast.success("Blog created successfully!");
      getBlogs(newBlog);
      handleClose();
    } catch (err) {
      toast.error("Failed to create blog.");
      console.error("Create blog error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeleteBlogsService(id);
      toast.success("Blog deleted successfully!");
      getBlogs();
    } catch (err) {
      console.error("Delete blog failed:", err);
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 rounded-t-lg">
          <h2 className="text-white text-lg font-semibold">Blogs</h2>
        </div>

        {/* Add Button */}
        <div className="flex justify-end px-6 py-4">
          <Button
            variant="contained"
            onClick={handleOpen}
            className="shadow custom-gradient-btn text-white hover:opacity-90"
          >
            Add Blog
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto pb-6">
          {isLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No blogs found.
            </div>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 font-medium border-y border-gray-300">
                <tr>
                  {[
                    "Title",
                    "Image",
                    "Description",
                    "Posted On",
                    "Actions",
                  ].map((col) => (
                    <th key={col} className="px-4 py-2">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <td className="px-4 py-3 font-medium">{blog.title}</td>
                    <td className="px-4 py-3">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-20 h-20 rounded object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {blog.description?.split(" ").slice(0, 10).join(" ")}...
                    </td>
                    {/* <td>{blog.description}</td> */}
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(blog.postedOn).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(blog._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Blog Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Blog</DialogTitle>
        <DialogContent>
          <div className="flex flex-col space-y-4 mt-2">
            <InputField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
            />

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 mt-2 object-cover rounded"
                />
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter blog description"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            className="custom-gradient-btn"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Reusable InputField Component
const InputField = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
    />
  </div>
);

export default Blogs;
