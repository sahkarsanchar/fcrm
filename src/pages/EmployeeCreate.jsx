import React, { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { GetAllDepartments } from "../services/api.service";
import { CreateUser } from "../services/api.service"; // ✅ import CreateUser API

export default function EmployeeCreate() {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

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
        console.log(res);
        setDepartments(res.data?.data || []);
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
    setFormData({ ...formData, image: file });
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append("level", formData.level);

      // ✅ Append address
      formDataToSend.append("street", formData.address.street);
      formDataToSend.append("city", formData.address.city);
      formDataToSend.append("state", formData.address.state);
      formDataToSend.append("postalCode", formData.address.postalCode);
      formDataToSend.append("country", formData.address.country);

      // ✅ Append image
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
     console.log(formDataToSend);
      // ✅ Use CreateUser API service
      await CreateUser(formDataToSend);

      alert("✅ Employee created successfully!");

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
      setPositions([]);
      setStates([]);
      setCities([]);
    } catch (error) {
      console.error("Error creating employee:", error);
      alert("❌ Failed to create employee. Check console for details.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-5">
          <UserPlus className="text-orange-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Create Employee</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Full Name" className="border p-2 rounded"
              value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" className="border p-2 rounded"
              value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" className="border p-2 rounded"
              value={formData.password} onChange={handleChange} required />
            <input type="text" name="mobile" placeholder="Mobile" className="border p-2 rounded"
              value={formData.mobile} onChange={handleChange} />
          </div>

          {/* Department & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="department" value={formData.department}
              onChange={handleDepartmentChange} className="border p-2 rounded" required>
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>

            <select name="position" value={formData.position}
              onChange={handleChange} className="border p-2 rounded" disabled={!positions.length} required>
              <option value="">Select Position</option>
              {positions.map((pos) => (
                <option key={pos._id} value={pos._id}>{pos.name}</option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange}
              className="border p-2 rounded w-full" />
          </div>

          {/* Address Section */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2 text-gray-700">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="country" value={formData.address.country}
                onChange={handleCountryChange} className="border p-2 rounded">
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              <select name="state" value={formData.address.state}
                onChange={handleStateChange} className="border p-2 rounded" disabled={!states.length}>
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>

              <select name="city" value={formData.address.city}
                onChange={handleCityChange} className="border p-2 rounded" disabled={!cities.length}>
                <option value="">Select City</option>
                {cities.map((c, index) => (
                  <option key={c._id || index} value={c._id || c.name}>
                    {c.name || c}
                  </option>
                ))}
              </select>

              <input type="text" name="street" placeholder="Street Address"
                className="border p-2 rounded" value={formData.address.street}
                onChange={handleAddressChange} />
              <input type="text" name="postalCode" placeholder="Postal Code"
                className="border p-2 rounded" value={formData.address.postalCode}
                onChange={handleAddressChange} />
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Level</label>
            <select name="level" value={formData.level} onChange={handleChange}
              className="border p-2 rounded w-full">
              <option value="">Select Level</option>
              <option value="level1">Level 1</option>
              <option value="level2">Level 2</option>
              <option value="level3">Level 3</option>
              <option value="level4">Level 4</option>
            </select>
          </div>

          {/* Submit */}
          <button type="submit"
          onClick={handleSubmit}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md transition">
            Create Employee
          </button>
        </form>
      </div>
    </div>
  );
}
