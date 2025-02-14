import { useState } from "react";
import { FaClipboardUser } from "react-icons/fa6";
import { GoLock } from "react-icons/go";
import { message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {
  const { setAdmin } = useAuth();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const data = {
      loginId: loginId,
      password: password,
    };

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/adminuser/login`,
      data
    );
    if (res.data.error) return message.error(res.data.message);
    message.success(res.data.message);
    localStorage.setItem("token", res.data.token);
    setAdmin(res.data.admin);
    navigate("/admin/top");
  };
  return (
    <>
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="flex flex-col bg-white py-4 px-6">
          <p className="lg:text-xl md:text-lg text-base text-center">
            管理サイト
          </p>
          <div class="relative w-80 mt-6">
            <input
              type="text"
              placeholder="ログインID"
              class="w-full pl-3 pr-10 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300"
              onChange={(e) => setLoginId(e.target.value)}
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <FaClipboardUser />
            </div>
          </div>
          <div class="relative w-80 mt-6">
            <input
              type="password"
              placeholder="パスワード"
              class="w-full pl-3 pr-10 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <GoLock />
            </div>
          </div>
          <div className="flex justify-center p-4 mt-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg duration-300"
              onClick={handleSubmit}
            >
              ログイン
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
