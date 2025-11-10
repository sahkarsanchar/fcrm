import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import {
  createSubCategoriesservice,
  deleteSubCategoriesservice,
  getCategoriesservice,
  getSubCategoriesservice,
} from "../services/api.service";

const Subcategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subName, setSubName] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategoriesservice();
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
      // toast.error("Failed to load categories");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await getSubCategoriesservice();
      setSubcategories(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to load subcategories:", err);
      // toast.error("Failed to load subcategories");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSelectedCategory("");
    setSubName("");
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !subName.trim()) {
      toast.warn("Please select a category and enter a subcategory name.");
      return;
    }

    const data = {
      name: subName,
      category: selectedCategory,
    };

    try {
      await createSubCategoriesservice(data);
      toast.success("Subcategory created successfully");
      fetchSubcategories();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create subcategory");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubCategoriesservice(id);
      toast.success("Subcategory deleted successfully");

      // Update state after deletion
      setSubcategories((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting subcategory:", err);
      toast.error("Failed to delete subcategory");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 rounded-t-lg">
          <h2 className="text-white text-lg font-semibold">Subcategories</h2>
        </div>

        <div className="flex justify-end px-6 py-4">
          <Button
            variant="contained"
            className="custom-gradient-btn"
            onClick={handleOpen}
          >
            Add Subcategory
          </Button>
        </div>

        <div className="overflow-x-auto pb-6">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 font-medium border-y border-gray-300">
              <tr>
                {["Id", "Subcategory", "Category", "Actions"].map((col) => (
                  <th key={col} className="px-4 py-2">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {subcategories.map(({ _id, name, category }, index) => (
                <tr key={_id} className="hover:bg-gray-50 transition-all">
                  <td className="px-4 py-3 font-medium">{index + 1}</td>
                  <td className="px-4 py-3">{name}</td>
                  <td className="px-4 py-3">{category?.name || "N/A"}</td>
                  <td className="px-4 py-3">
                    <IconButton color="error" onClick={() => handleDelete(_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Subcategory</DialogTitle>
        <DialogContent>
          <div className="flex flex-col space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory Name
              </label>
              <input
                type="text"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="Enter subcategory name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

export default Subcategory;
