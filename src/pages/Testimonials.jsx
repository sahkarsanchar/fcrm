import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CreateTestimonialservice,
  deleteTestimonialservice,
  getAllTestimonialservice,
} from "../services/api.service";
import { toast } from "react-toastify";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    location: "",
    rating: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      rating: "",
      image: null,
    });
    setImageFile(null);
    setOpen(false);
  };

  const fetchTestimonials = () => {
    setLoading(true);
    getAllTestimonialservice()
      .then((res) => {
        console.log(res);
        setTestimonials(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching testimonials:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleSubmit = () => {
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("message", formData.message);
    payload.append("location", formData.location);
    payload.append("rating", formData.rating);
    payload.append("image", imageFile);

    setSubmitting(true);
    CreateTestimonialservice(payload)
      .then((res) => {
        toast.success("Testimonial created successfully!");
        fetchTestimonials();
        handleClose();
      })
      .catch((err) => {
        const errorMessage =
          err?.response?.data?.message || "Something went wrong.";
        toast.error(errorMessage);
      })
      .finally(() => setSubmitting(false));
  };

  const handleDelete = async (id) => {
    await deleteTestimonialservice(id)
      .then(() => {
        toast.success("Deleted successfully!");
        fetchTestimonials();
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        toast.error("Failed to delete testimonial.");
      });
  };

  const tableHeaders = ["Name", "Image", "Description", "Date", "Actions"];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen relative">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="bgColor p-6 rounded-t-lg">
          <h2 className="text-white text-lg font-semibold">Testimonials</h2>
        </div>

        <div className="flex justify-end px-6 py-4">
          <Button
            variant="contained"
            onClick={handleOpen}
            className="shadow custom-gradient-btn text-white hover:opacity-90"
          >
            Add Testimonial
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <CircularProgress />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No testimonials found.
          </div>
        ) : (
          <div className="overflow-x-auto pb-6">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 font-medium border-y border-gray-300">
                <tr>
                  {tableHeaders.map((header, idx) => (
                    <th key={idx} className="px-4 py-2">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {testimonials.map((testimonial) => (
                  <tr
                    key={testimonial._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">
                      {testimonial.name}
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded object-cover border border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {testimonial.message?.split(" ").slice(0, 10).join(" ")}
                      ...
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(testimonial._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Testimonial</DialogTitle>
        <DialogContent>
          <div className="flex flex-col space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Write a short testimonial"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1 to 5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="Enter rating"
                min={1}
                max={5}
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
            className="custom-gradient-btn"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Testimonials;
