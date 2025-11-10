import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import {
  createProductService,
  UpdateProductService,
  getCategoriesservice,
  getSubCategoriesservice,
} from "../services/api.service";
import { Button } from "@mui/material";

const ProductForm = ({ productData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ratings: "",
    price: "",
    category: "",
    subcategory: "",
    newarrival: false,
    bestsellor: false,
    trending: false,
    inStock: true,
    discount: "",
    isCustomized: false,
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [customOptions, setCustomOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subCatRes] = await Promise.all([
          getCategoriesservice(),
          getSubCategoriesservice(),
        ]);
        setCategories(catRes?.data?.data || []);
        setSubcategories(subCatRes?.data?.data || []);
      } catch (err) {
        toast.error("Failed to load categories or subcategories");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (productData) {
      const {
        name,
        description,
        ratings,
        price,
        category,
        subcategory,
        newarrival,
        bestsellor,
        trending,
        inStock,
        discount,
        isCustomized,
        custom = [],
        images = [],
      } = productData;

      setFormData({
        name,
        description,
        ratings,
        price,
        category: category?._id || "",
        subcategory: subcategory?._id || "",
        newarrival,
        bestsellor,
        trending,
        inStock,
        discount,
        isCustomized,
      });

      setCustomOptions(
        custom.map((opt) => ({
          title: opt.title,
          price: opt.price,
          image: null,
        }))
      );
      setExistingImages(images);
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleAddCustomOption = () => {
    setCustomOptions([...customOptions, { title: "", price: "", image: null }]);
  };

  const handleCustomChange = (index, e) => {
    const { name, value, files } = e.target;
    const updated = [...customOptions];
    updated[index][name] = name === "image" ? files[0] : value;
    setCustomOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    images.forEach((img) => {
      data.append("images", img);
    });

    if (formData.isCustomized) {
      customOptions.forEach((opt, index) => {
        data.append(`custom[${index}][title]`, opt.title);
        data.append(`custom[${index}][price]`, opt.price);
        data.append("customImages", opt.image); // ✅
      });
    }

    try {
      if (productData) {
        await UpdateProductService(productData._id, data);
        toast.success("Product updated successfully!");
      } else {
        await createProductService(data);
        toast.success("Product created successfully!");
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        ></textarea>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="number"
          name="ratings"
          placeholder="Ratings (1-5)"
          value={formData.ratings}
          onChange={handleChange}
          step="0.1"
          max="5"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          name="subcategory"
          value={formData.subcategory}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="newarrival"
              checked={formData.newarrival}
              onChange={handleChange}
            />
            New Arrival
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bestsellor"
              checked={formData.bestsellor}
              onChange={handleChange}
            />
            Best Seller
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="trending"
              checked={formData.trending}
              onChange={handleChange}
            />
            Trending
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            In Stock
          </label>
        </div>

        <input
          type="number"
          name="discount"
          placeholder="Discount %"
          value={formData.discount}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />

        <div>
          <label className="block mb-1">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {existingImages?.length > 0 && (
            <div className="flex gap-2 mt-2">
              {existingImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isCustomized"
            checked={formData.isCustomized}
            onChange={handleChange}
          />
          Customized
        </label>
        {formData.isCustomized && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold">Custom Options</h4>
            {customOptions.map((opt, index) => (
              <div
                key={index}
                className="grid sm:grid-cols-3 gap-4 items-center"
              >
                <input
                  type="text"
                  name="title"
                  value={opt.title}
                  onChange={(e) => handleCustomChange(index, e)}
                  placeholder="Custom Title"
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  name="price"
                  value={opt.price}
                  onChange={(e) => handleCustomChange(index, e)}
                  placeholder="Custom Price"
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => handleCustomChange(index, e)}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}

            <Button
              type="button"
              variant="contained"
              onClick={handleAddCustomOption}
              className="custom-gradient-btn"
            >
              Add Custom Option
            </Button>
          </div>
        )}

        <Button
          type="submit"
          variant="contained"
          className="custom-gradient-btn"
        >
          {productData ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default ProductForm;
