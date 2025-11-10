import React, { useState, useEffect } from "react";
import {
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Chip,
} from "@mui/material";
import {
  createProductService,
  getCategoriesservice,
  getSubCategoriesservice,
} from "../services/api.service"; // update path as per your project

const AddProductForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    ratings: "",
    price: "",
    colors: [],
    category: "",
    subcategory: "",
    newarrival: false,
    bestsellor: false,
    trending: false,
    inStock: true,
    discount: "",
    isCustomized: false,
    custom: [],
  });

  const [images, setImages] = useState([]);
  const [customOptionInput, setCustomOptionInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await getCategoriesservice();
        const subcategoryRes = await getSubCategoriesservice();
        setCategories(categoryRes.data.data || []);
        setSubcategories(subcategoryRes.data.data || []);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleColorsChange = (e) => {
    setForm({
      ...form,
      colors: e.target.value.split(",").map((c) => c.trim()),
    });
  };

  const handleCustomAdd = () => {
    if (customOptionInput.trim()) {
      setForm((prev) => ({
        ...prev,
        custom: [...prev.custom, customOptionInput.trim()],
      }));
      setCustomOptionInput("");
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      for (let key in form) {
        if (key === "colors") {
          form[key].forEach((color) => data.append("colors", color));
        } else if (key === "custom") {
          data.append("custom", JSON.stringify(form.custom));
        } else {
          data.append(key, form[key]);
        }
      }

      images.forEach((img) => data.append("images", img));

      const response = await createProductService(data);
      if (response.data.success) {
        alert("Product created successfully!");
        // Reset form
        setForm({
          name: "",
          description: "",
          ratings: "",
          price: "",
          colors: [],
          category: "",
          subcategory: "",
          newarrival: false,
          bestsellor: false,
          trending: false,
          inStock: true,
          discount: "",
          isCustomized: false,
          custom: [],
        });
        setImages([]);
      }
    } catch (err) {
      console.error("Product creation error:", err);
      alert("Something went wrong while creating the product.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <Typography variant="h5" className="mb-6 font-semibold">
        Add New Product
      </Typography>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        encType="multipart/form-data"
      >
        <TextField
          label="Product Name"
          name="name"
          fullWidth
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={3}
          value={form.description}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Ratings"
          name="ratings"
          fullWidth
          value={form.ratings}
          onChange={handleInputChange}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          fullWidth
          value={form.price}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Colors (comma separated)"
          fullWidth
          value={form.colors.join(", ")}
          onChange={handleColorsChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Subcategory</InputLabel>
            <Select
              name="subcategory"
              value={form.subcategory}
              onChange={handleInputChange}
              required
            >
              {subcategories.map((sub) => (
                <MenuItem key={sub._id} value={sub._id}>
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormControlLabel
            control={
              <Checkbox
                checked={form.newarrival}
                onChange={handleInputChange}
                name="newarrival"
              />
            }
            label="New Arrival"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.bestsellor}
                onChange={handleInputChange}
                name="bestsellor"
              />
            }
            label="Best Seller"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.trending}
                onChange={handleInputChange}
                name="trending"
              />
            }
            label="Trending"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.inStock}
                onChange={handleInputChange}
                name="inStock"
              />
            }
            label="In Stock"
          />
        </div>

        <TextField
          label="Discount (%)"
          name="discount"
          type="number"
          fullWidth
          value={form.discount}
          onChange={handleInputChange}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.isCustomized}
              onChange={handleInputChange}
              name="isCustomized"
            />
          }
          label="Customizable"
        />

        {form.isCustomized && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <TextField
                label="Add Custom Option"
                value={customOptionInput}
                onChange={(e) => setCustomOptionInput(e.target.value)}
              />
              <Button variant="contained" onClick={handleCustomAdd}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.custom.map((opt, idx) => (
                <Chip key={idx} label={opt} />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block mb-2 font-medium">Upload Images</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create Product
        </Button>
      </form>
    </div>
  );
};

export default AddProductForm;
