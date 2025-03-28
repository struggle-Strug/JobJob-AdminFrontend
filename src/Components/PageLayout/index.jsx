import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { MdOutlineLogout, MdMenu, MdClose } from "react-icons/md";
import {
  MdOutlineContentPaste,
  MdSpaceDashboard,
  MdFileDownloadDone,
} from "react-icons/md";
import {
  BsFillQuestionCircleFill,
  BsPostcardFill,
  BsBuildingFillGear,
} from "react-icons/bs";
import { HiMiniUserGroup } from "react-icons/hi2";
import { LiaUsersSolid } from "react-icons/lia";
import { TbMapPinSearch, TbDeviceTabletSearch } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";

const PageLayout = () => {
  const location = useLocation();
  const isSelected = (path) => location.pathname.includes(path);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigationLinks = (
    <div className="flex flex-col bg-[#343434] py-2 w-full min-h-screen">
      <Link
        to={"/admin/top"}
        className={`flex justify-start items-center p-2 rounded-lg gap-2 mt-4 ${
          isSelected("/admin/top")
            ? "bg-[#17a2b8] font-medium pl-2 text-white"
            : "text-gray-400 hover:bg-slate-300"
        }`}
      >
        <MdSpaceDashboard className="w-5 h-5" />
        <span>トップページ</span>
      </Link>
      <Link
        to={"/admin/apply"}
        className={`flex justify-start items-center p-2 rounded-lg gap-2 mt-4 ${
          isSelected("/admin/apply")
            ? "bg-[#17a2b8] font-medium pl-2 text-white"
            : "text-gray-400 hover:bg-slate-300"
        }`}
      >
        <MdFileDownloadDone className="w-5 h-5" />
        <span>応募管理</span>
      </Link>
      <Link
        to={"/admin/corporation"}
        className={`flex justify-start items-center p-2 rounded-lg gap-2 mt-4 ${
          isSelected("/admin/corporation")
            ? "bg-[#17a2b8] font-medium pl-2 text-white"
            : "text-gray-400 hover:bg-slate-300"
        }`}
      >
        <HiMiniUserGroup className="w-5 h-5" />
        <span>法人管理</span>
      </Link>
      <Link
        to={"/admin/facility"}
        className={`flex justify-start items-center p-2 rounded-lg gap-2 mt-4 ${
          isSelected("/admin/facility")
            ? "bg-[#17a2b8] font-medium pl-2 text-white"
            : "text-gray-400 hover:bg-slate-300"
        }`}
      >
        <BsBuildingFillGear className="w-5 h-5" />
        <span>施設管理</span>
      </Link>
      <Link
        to={"/admin/recruit"}
        className={`flex justify-start items-center p-2 rounded-lg gap-2 mt-4 ${
          isSelected("/admin/recruit")
            ? "bg-[#17a2b8] font-medium pl-2 text-white"
            : "text-gray-400 hover:bg-slate-300"
        }`}
      >
        <BsPostcardFill className="w-5 h-5" />
        <span>求人管理</span>
      </Link>
      <Link
        to={"/admin/examination_facility"}
        className={`flex justify-start items-center p-2 rounded-lg gap-2 mt-4 ${
          isSelected("/admin/examination_facility")
            ? "bg-[#17a2b8] font-medium pl-2 text-white"
            : "text-gray-400 hover:bg-slate-300"
        }`}
      >
        <TbMapPinSearch className="w-5 h-5" />
        <span>施設審査</span>
      </Link>
      <Link
        to={"/admin/examination_recruit"}
        className={`flex justify-start items-center p-2 rounded-lg gap-2 mt-4 ${
          isSelected("/admin/examination_recruit")
            ? "bg-[#17a2b8] font-medium pl-2 text-white"
            : "text-gray-400 hover:bg-slate-300"
        }`}
      >
        <TbDeviceTabletSearch className="w-5 h-5" />
        <span>求人審査</span>
      </Link>
      <Link
        to={"/admin/member"}
        className={`flex justify-start items-center p-2 rounded-lg gap-2 mt-4 ${
          isSelected("/admin/member")
            ? "bg-[#17a2b8] font-medium pl-2 text-white"
            : "text-gray-400 hover:bg-slate-300"
        }`}
      >
        <LiaUsersSolid className="w-5 h-5" />
        <span>CS会員管理</span>
      </Link>
      <Link
        to={"/admin/contact"}
        className={`flex justify-start items-center p-2 rounded-lg gap-2 mt-4 ${
          isSelected("/admin/contact")
            ? "bg-[#17a2b8] font-medium pl-2 text-white"
            : "text-gray-400 hover:bg-slate-300"
        }`}
      >
        <BsFillQuestionCircleFill className="w-5 h-5" />
        <span>お問い合わせ管理</span>
      </Link>
      <Link
        to={"/admin/settings"}
        className={`flex justify-start items-center p-2 rounded-lg gap-2 mt-4 ${
          isSelected("/admin/settings")
            ? "bg-[#17a2b8] font-medium pl-2 text-white"
            : "text-gray-400 hover:bg-slate-300"
        }`}
      >
        <IoSettings className="w-5 h-5" />
        <span>設定</span>
      </Link>
      <Link
        to={"/cms"}
        className={`flex justify-start items-center p-2 rounded-lg gap-2 mt-4 ${
          isSelected("/cms")
            ? "bg-[#17a2b8] font-medium pl-2 text-white"
            : "text-gray-400 hover:bg-slate-300"
        }`}
      >
        <MdOutlineContentPaste className="w-5 h-5" />
        <span>コンテンツ管理</span>
      </Link>
    </div>
  );

  return (
    <div className="flex w-full bg-[#EFEFEF] min-h-screen">
      <div className="flex flex-col w-full">
        <header className="fixed top-0 left-0 w-full bg-[#797979] text-[#c9c9c9] z-50 px-3 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-white" onClick={toggleMenu}>
                {isMenuOpen ? (
                  <MdClose className="w-6 h-6" />
                ) : (
                  <MdMenu className="w-6 h-6" />
                )}
              </button>
              <Link to={"/admin"}>
                <img
                  src="/assets/images/logo_negative_horizontal00_1.png"
                  alt="logo"
                  className="w-24 hover:scale-105 duration-300"
                />
              </Link>
            </div>
            <button
              className="hidden lg:flex items-center font-bold hover:text-[#fff] duration-300 hover:scale-105"
              onClick={handleLogout}
            >
              <MdOutlineLogout className="w-5 h-5" />
              ログアウト
            </button>
          </div>
        </header>

        <div className="flex w-full pt-14">
          {/* Sidebar */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } lg:block fixed lg:static h-full bg-[#343434] py-2 px-4 w-64 z-40`}
          >
            {navigationLinks}
          </div>

          {/* Main Content */}
          <div className="flex-grow bg-[#EFEFEF]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
