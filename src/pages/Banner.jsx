import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CreateBannerservice,
  getAllBannerservice,
  deleteBannerservice,
} from "../services/api.service";
import { toast } from "react-toastify";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Open & Close Dialog
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setImageFile(null);
    setOpen(false);
  };

  // Fetch All Banners
  const fetchBanners = () => {
    setLoading(true);
    getAllBannerservice()
      .then((res) => {
        console.log(res);
        setBanners(res.data.banners || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const formData = new FormData();
      formData.append("image", file);
      setSubmitting(true);
      CreateBannerservice(formData)
        .then(() => {
          toast.success("Banner uploaded successfully!");
          fetchBanners();
          handleClose();
        })
        .catch((err) => {
          toast.error("Upload failed");
          console.error(err);
        })
        .finally(() => setSubmitting(false));
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  // Delete Banner
  const handleDelete = (id) => {
    deleteBannerservice(id)
      .then(() => {
        toast.success("Banner deleted!");
        fetchBanners();
      })
      .catch((err) => {
        toast.error("Delete failed");
        console.error(err);
      });
  };

  // Image Preview
  const handleImageClick = (imageUrl) => {
    console.log("Image URL clicked:", imageUrl); // ✅ Check this
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewImage(null);
    setPreviewOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-6 rounded-t-lg">
          <h2 className="text-white text-lg font-semibold">Banners</h2>
        </div>

        {/* Add Button */}
        <div className="flex justify-end px-6 py-4">
          <Button
            variant="contained"
            onClick={handleOpen}
            className="bg-gradient-to-r from-amber-400 to-amber-500"
          >
            Add Banner
          </Button>
        </div>

        {/* Banner List */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <CircularProgress />
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No banners found.
          </div>
        ) : (
          <div className="overflow-x-auto pb-6">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 font-medium border-y border-gray-300">
                <tr>
                  {["Id", "Image", "Uploaded On", "Actions"].map((col) => (
                    <th key={col} className="px-4 py-2">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {banners.map((banner, index) => {
                  return (
                    <tr
                      key={banner._id}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="px-4 py-3 font-medium">{index + 1}</td>
                      <td className="px-4 py-3">
                        <img
                          src={banner.image}
                          alt={`Banner ${index + 1}`}
                          className="w-24 h-12 rounded object-cover cursor-pointer"
                          onClick={() => handleImageClick(banner.image)}
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(banner.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(banner._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Banner Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Banner</DialogTitle>
        <DialogContent>
          <div className="flex flex-col mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={previewOpen} onClose={handlePreviewClose} maxWidth="md">
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          {console.log("Preview Image:", previewImage)}
          {previewImage && (
            <img
              src={previewImage}
              alt="Banner Preview"
              className="w-full max-h-[80vh] object-contain rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Banners;
