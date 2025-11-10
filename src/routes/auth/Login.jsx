import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { SyncLoader } from "react-spinners";
import { setToken } from "../../helper/tokenHelper";
import { AdminLoginService } from "../../services/api.service";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await AdminLoginService(formData);
      console.log(res);
      const user = res.data.user;
      const token = res.data.token;
      setToken(token);
      login(user);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "Server Error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full lg:w-[60%] mt-12">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Sign In</h2>
          <p className="text-gray-600 text-lg">
            Enter your email and password to Sign In.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow-md"
        >
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="name@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={hide ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                onClick={() => setHide(!hide)}
              >
                {hide ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
          )}

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <Link
              to="/auth/reset-password"
              className="text-sm text-gray-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition"
          >
            {isLoading ? <SyncLoader size={8} color="#fff" /> : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
