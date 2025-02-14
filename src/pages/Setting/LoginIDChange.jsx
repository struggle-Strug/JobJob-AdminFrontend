import { useEffect } from "react";
import { Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const LoginIDChange = () => {
  const { admin } = useAuth();
  console.log(admin);

  const [loginId, setLoginId] = useState("");
  const navigate = useNavigate();

  const handleLoginId = async () => {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/adminuser/${admin?._id}`,
      { loginId: loginId }
    );
    if (response.data.error) return message.error(response.data.message);
    localStorage.removeItem("token");
    message.success("ログインIDを変更しました。");
  };

  useEffect(() => {
    document.title = "ログインID変更";
  }, []);
  return (
    <>
      <div className="bg-white min-h-screen p-8 rounded-lg">
        <div
          className={`duration-300 w-1/2 overflow-hidden bg-[#f7f6f2] rounded-lg p-8`}
        >
          <p className="lg:text-sm text-xs text-[#343434] font-bold">
            現在のログインID
            <span className="text-[#343434] font-normal">
              (ログイン時に使用するログインID)
            </span>
          </p>
          <p className="lg:text-sm text-xs text-[#343434] pt-1">
            {admin?.loginId}
          </p>
          <p className="lg:text-sm text-xs text-[#343434] font-medium pt-4">
            新しいログインID
          </p>
          <Input
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="h-10 mt-2"
          />
          {loginId == admin?.loginId && (
            <p className="lg:text-sm text-xs text-[#FF2A3B] font-medium mt-1">
              登録済みのログインID
            </p>
          )}
          <div className="w-full flex justify-center items-center mt-8">
            <button
              onClick={handleLoginId}
              className="lg:text-base md:text-sm text-xs bg-[#e22434] text-white rounded-lg px-4 py-3 hover:bg-[#ffe4e4] hover:text-red-500 duration-300"
            >
              ログインIDを変更する
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginIDChange;
