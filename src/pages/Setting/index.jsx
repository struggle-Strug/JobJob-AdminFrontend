import { Link } from "react-router-dom";

const Setting = () => {
  return (
    <>
      <div className="w-full min-h-screen">
        <div className="flex flex-col w-full bg-white rounded-lg shadow-xl min-h-screen">
          <p className="text-left text-xl font-bold text-[#343434] p-4">設定</p>
          <div className="flex flex-col px-8 mt-8">
            <div className="flex flex-col justify-start px-8 gap-4">
              <Link
                to={"/admin/settings/loginId"}
                className="text-sm text-[#343434] hover:text-[#FF2A3B] hover:underline duration-300"
              >
                ログインIDを変更
              </Link>
              <Link
                to={"/admin/settings/pass"}
                className="text-sm text-[#343434] hover:text-[#FF2A3B] hover:underline duration-300"
              >
                パスワード変更
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
