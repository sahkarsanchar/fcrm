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
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import {
  getProductService,
  deleteProductService,
} from "../services/api.service";
import ProductForm from "./ProductForm";
import ImageSlider from "./ImageSlider";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProductService();
      console.log(res)
      setProducts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch Products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProductService(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 rounded-t-lg">
          <h2 className="text-white text-lg font-semibold">Products</h2>
        </div>

        <div className="flex justify-end px-6 py-4">
          <Button
            variant="contained"
            onClick={handleAddProduct}
            className="custom-gradient-btn"
          >
            Add Product
          </Button>
        </div>

        <div className="overflow-x-auto pb-6">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 font-medium border-y border-gray-300">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap ">Id</th>
                <th className="px-4 py-2 whitespace-nowrap">Images</th>
                <th className="px-4 py-2 whitespace-nowrap">Name</th>
                <th className="px-4 py-2 whitespace-nowrap">Description</th>
                <th className="px-4 py-2 whitespace-nowrap">Category</th>
                <th className="px-4 py-2 whitespace-nowrap">Subcategory</th>
                <th className="px-4 py-2 whitespace-nowrap">Price</th>
                <th className="px-4 py-2 whitespace-nowrap">Ratings</th>
                <th className="px-4 py-2 whitespace-nowrap">In Stock</th>
                <th className="px-4 py-2 whitespace-nowrap">New Arrival</th>
                <th className="px-4 py-2 whitespace-nowrap">Trending</th>
                <th className="px-4 py-2 whitespace-nowrap">Best Seller</th>
                <th className="px-4 py-2 whitespace-nowrap">Discount (%)</th>
                <th className="px-4 py-2 whitespace-nowrap">Customized</th>
                <th className="px-4 py-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {products.map((product, idx) => (
                
                <tr key={product._id} className="hover:bg-gray-50 text-center">
                
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">
                    {product.images?.[0] ? (
                      
                      <img
                        src={product.images[0]}
                        alt="Product"
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:scale-105 transition"
                        onClick={() => {
                          setSelectedImage(product.images || []);
                          setImageOpen(true);
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.name?.length > 7
                      ? product.name.substring(0, 7) + "..."
                      : product.name}
                  </td>
                  <td className="px-4 py-3">
                    {product.description?.length > 7
                      ? product.description.substring(0, 7) + "..."
                      : product.description}
                  </td>
                  <td className="px-4 py-3">{product.category?.name}</td>
                  <td className="px-4 py-3">{product.subcategory?.name}</td>
                  <td className="px-4 py-3">${product.price}</td>
                  <td className="px-4 py-3">{product.ratings}</td>
                  <td className="px-4 py-3">
                    {product.inStock ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    {product.newarrival ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    {product.trending ? "🔥" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    {product.bestsellor ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">{product.discount || "0"}%</td>
                  <td className="px-4 py-3">
                    {product.isCustomized ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(product)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <ProductForm
            productData={selectedProduct}
            onClose={handleClose}
            onSuccess={() => {
              fetchProducts();
              handleClose();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Product Images</DialogTitle>
        <DialogContent>
          <ImageSlider images={selectedImage || []} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Product;
