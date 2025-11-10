import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getCategoriesservice,
  createCategoriesservice,
  deleteCategoriesservice,
} from "../services/api.service";
import { toast } from "react-toastify";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  // Fetch All Categories 
  const fetchCategories = () => {
    setLoading(true);
    getCategoriesservice()
      .then((res) => {
        const result = res?.data?.data || [];
        setCategories(result);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add Category
  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    createCategoriesservice({ name })
      .then(() => {
        toast.success("Category created successfully");
        fetchCategories();
        handleClose();
      })
      .catch((err) => {
        console.error("Create failed:", err);
        toast.error("Failed to create category");
      });
  };

  // Delete Category
  const handleDelete = (id) => {
    deleteCategoriesservice(id)
      .then(() => {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
        toast.success("Category deleted successfully");
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        toast.error("Failed to delete category");
      });
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 rounded-t-lg">
          <h2 className="text-white text-lg font-semibold">Categories</h2>
        </div>

        {/* Add Button */}
        <div className="flex justify-end px-6 py-4">
          <Button
            variant="contained"
            onClick={handleOpen}
            className="custom-gradient-btn text-white hover:opacity-90"
          >
            Add Category
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto pb-6">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 font-medium border-y border-gray-300">
              <tr>
                {["Id", "Name", "Actions"].map((col) => (
                  <th key={col} className="px-4 py-2">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {categories.map(({ _id, name }, index) => (
                <tr key={_id} className="hover:bg-gray-50 transition-all">
                  <td className="px-4 py-3 font-medium">{index + 1}</td>
                  <td className="px-4 py-3">{name}</td>
                  <td className="px-4 py-3">
                    <IconButton color="error" onClick={() => handleDelete(_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="text-center py-4 text-gray-600">Loading...</div>
          )}
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <div className="flex flex-col mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="custom-gradient-btn"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Category;
