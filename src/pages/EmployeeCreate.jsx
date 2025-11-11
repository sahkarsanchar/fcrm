import React, { useEffect, useState } from "react";
import { UserPlus, Mail, Lock, Phone, Building, Briefcase, MapPin, Upload, Star } from "lucide-react";
import { GetAllDepartments } from "../services/api.service";
import { CreateUser } from "../services/api.service";

export default function EmployeeCreate() {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    position: "",
    mobile: "",
    level: "",
    image: null,
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  // ✅ Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await GetAllDepartments();
        setDepartments(res.data.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // ✅ Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://api.sacmanagementindia.com/api/country");
        const data = await res.json();
        setCountries(data || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // ✅ Department change
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    setFormData({ ...formData, department: departmentId, position: "" });

    const selectedDept = departments.find((d) => d._id === departmentId);
    setPositions(selectedDept?.positions || []);
  };

  // ✅ Country change
  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);

    const selectedCountryObj = countries.find((c) => c._id === countryId);
    setStates(selectedCountryObj?.states || []);
    setCities([]);

    setFormData({
      ...formData,
      address: { ...formData.address, country: countryId, state: "", city: "" },
    });
  };

  // ✅ State change
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);

    const selectedStateObj = states.find((s) => s._id === stateId);
    const stateCities = selectedStateObj?.city || [];
    setCities(stateCities);

    setFormData({
      ...formData,
      address: { ...formData.address, state: stateId, city: "" },
    });
  };

  // ✅ City change
  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setFormData({
      ...formData,
      address: { ...formData.address, city: cityId },
    });
  };

  // ✅ Input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: { ...formData.address, [name]: value },
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("mobile", formData.mobile);

      const departmentName =
        departments.find((d) => d._id === formData.department)?.name || "";
      const positionName = formData.position;
     
      formDataToSend.append("department", departmentName);
      formDataToSend.append("position", positionName);
      formDataToSend.append("level", formData.level);
      if (formData.image) formDataToSend.append("image", formData.image);

      console.log("Submitting:", Object.fromEntries(formDataToSend));

      const res = await CreateUser(formDataToSend);
      console.log("✅ User created:", res.data);
      alert("Employee created successfully! 🎉");

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        department: "",
        position: "",
        mobile: "",
        level: "",
        image: null,
        address: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      });
      setImagePreview(null);
    } catch (err) {
      console.error("❌ Error creating user:", err.response?.data || err.message);
      alert("Error creating employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <UserPlus className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create New Employee
              </h2>
              <p className="text-gray-500 mt-1">Add a new team member to your organization</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="text-purple-500" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Profile Picture</h3>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <UserPlus className="text-purple-400" size={48} />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <Upload className="text-white" size={32} />
                </div>
              </div>

              <div className="flex-1">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <div className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
                    <Upload size={20} />
                    Choose Image
                  </div>
                </label>
                <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (Max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="text-purple-500" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                  <UserPlus size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                  <Phone size={20} />
                </div>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Department & Position */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <Building className="text-purple-500" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Work Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                  <Building size={20} />
                </div>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleDepartmentChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>

              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                  <Briefcase size={20} />
                </div>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!positions.length}
                  required
                >
                  <option value="">Select Position</option>
                  {positions.map((pos) => (
                    <option key={pos._id} value={pos.name}>
                      {pos.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                  <Star size={20} />
                </div>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium appearance-none cursor-pointer"
                >
                  <option value="">Select Level</option>
                  <option value="level2">Level 2</option>
                  <option value="level3">Level 3</option>
                  <option value="level4">Level 4</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-purple-500" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Address Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                name="country"
                value={formData.address.country}
                onChange={handleCountryChange}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium appearance-none cursor-pointer"
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                name="state"
                value={formData.address.state}
                onChange={handleStateChange}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!states.length}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                name="city"
                value={formData.address.city}
                onChange={handleCityChange}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!cities.length}
              >
                <option value="">Select City</option>
                {cities.map((c, index) => (
                  <option key={c._id || index} value={c._id || c.name}>
                    {c.name || c}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium"
                value={formData.address.postalCode}
                onChange={handleAddressChange}
              />

              <input
                type="text"
                name="street"
                placeholder="Street Address"
                className="md:col-span-2 w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium"
                value={formData.address.street}
                onChange={handleAddressChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-5 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Creating Employee...
              </>
            ) : (
              <>
                <UserPlus size={24} />
                Create Employee
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}