import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { MdOutlineContentPaste } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { BsPostcardFill } from "react-icons/bs";
import { BsBuildingFillGear } from "react-icons/bs";
import { HiMiniUserGroup } from "react-icons/hi2";
import { LiaUsersSolid } from "react-icons/lia";
import { MdFileDownloadDone } from "react-icons/md";
import { TbMapPinSearch } from "react-icons/tb";
import { TbDeviceTabletSearch } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";

const PageLayout = () => {
    const location = useLocation();
    const isSelected = (path) => location.pathname.includes(path);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    return (
        <div className="flex w-full bg-[#EFEFEF]">
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                    <header className="fixed top-0 left-0 w-full bg-[#797979] text-[#c9c9c9] z-50 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                            <Link to={"/admin"}>
                                <img src="/assets/images/logo_negative_horizontal00 1.png" alt="logo" className='w-24 hover:scale-105 duration-300'/>
                            </Link>
                            </div>
                            <button className="lg:text-base text-sm font-bold flex items-center hover:text-[#fff] duration-300 hover:scale-105" onClick={handleLogout}><MdOutlineLogout className="w-5 h-5 mt-1"/>ログアウト</button>
                        </div>
                    </header>
                </div>
                <div className="flex justify-center gap-4 w-full rounded-lg pt-14 ">
                    <div className="flex flex-col h-full bg-[#343434] py-2 px-4 w-1/6">
                        <Link to={"/admin/top"} className={`flex justify-start items-center p-2 rounded-lg gap-2 duration-300 mt-4 ${isSelected("/admin/top") ? 'font-medium pl-2 duration-300 bg-[#17a2b8]' : 'text-gray-400 hover:bg-slate-300'}`}>
                            <p className={`flex justify-start items-center gap-2 text-[#EFEFEF] lg:text-lg md:text-base text-sm font-bold px-2
                                hover:text-white hover:font-medium hover:pl-2 duration-300`}>
                                <MdSpaceDashboard className="w-5 h-5 mt-0.5"/>
                                トップページ
                            </p>
                        </Link>
                        <Link to={"/admin/apply"} className={`flex justify-start items-center p-2 rounded-lg gap-2 duration-300 mt-4 ${isSelected("/admin/apply") ? 'font-medium pl-2 duration-300 bg-[#17a2b8]' : 'text-gray-400 hover:bg-slate-300'}`}>
                            <p className={`flex justify-start items-center gap-2 text-[#EFEFEF] lg:text-lg md:text-base text-sm font-bold px-2
                                hover:text-white hover:font-medium hover:pl-2 duration-300`}>
                                <MdFileDownloadDone className="w-5 h-5 mt-0.5"/>
                                応募管理
                            </p>
                        </Link>
                        <Link to={"/admin/customers"} className={`flex justify-start items-center p-2 rounded-lg gap-2 duration-300 mt-4 ${isSelected("/admin/customers") ? 'font-medium pl-2 duration-300 bg-[#17a2b8]' : 'text-gray-400 hover:bg-slate-300'}`}>
                            <p className={`flex justify-start items-center gap-2 text-[#EFEFEF] lg:text-lg md:text-base text-sm font-bold px-2
                                hover:text-white hover:font-medium hover:pl-2 duration-300`}>
                                <HiMiniUserGroup className="w-5 h-5 mt-0.5"/>
                                法人管理
                            </p>
                        </Link>
                        <Link to={"/admin/facilities"} className={`flex justify-start items-center p-2 rounded-lg gap-2 duration-300 mt-4 ${isSelected("/admin/facilities") ? 'font-medium pl-2 duration-300 bg-[#17a2b8]' : 'text-gray-400 hover:bg-slate-300'}`}>
                            <p className={`flex justify-start items-center gap-2 text-[#EFEFEF] lg:text-lg md:text-base text-sm font-bold px-2
                                hover:text-white hover:font-medium hover:pl-2 duration-300`}>
                                <BsBuildingFillGear className="w-5 h-5 mt-0.5"/>
                                施設管理
                            </p>
                        </Link>
                        <Link to={"/admin/jobposts"} className={`flex justify-start items-center p-2 rounded-lg gap-2 duration-300 mt-4 ${isSelected("/admin/jobposts") ? 'font-medium pl-2 duration-300 bg-[#17a2b8]' : 'text-gray-400 hover:bg-slate-300'}`}>
                            <p className={`flex justify-start items-center gap-2 text-[#EFEFEF] lg:text-lg md:text-base text-sm font-bold px-2
                                hover:text-white hover:font-medium hover:pl-2 duration-300`}>
                                <BsPostcardFill className="w-5 h-5 mt-0.5"/>
                                求人管理
                            </p>
                        </Link>
                        <Link to={"/admin/examination_facility/"} className={`flex justify-start items-center p-2 rounded-lg gap-2 duration-300 mt-4 ${isSelected("#") ? 'font-medium pl-2 duration-300 bg-[#17a2b8]' : 'text-gray-400 hover:bg-slate-300'}`}>
                            <p className={`flex justify-start items-center gap-2 text-[#EFEFEF] lg:text-lg md:text-base text-sm font-bold px-2
                                hover:text-white hover:font-medium hover:pl-2 duration-300`}>
                                <TbMapPinSearch className="w-5 h-5 mt-0.5"/>
                                施設審査
                            </p>
                        </Link>
                        <Link to={"#"} className={`flex justify-start items-center p-2 rounded-lg gap-2 duration-300 mt-4 ${isSelected("#") ? 'font-medium pl-2 duration-300 bg-[#17a2b8]' : 'text-gray-400 hover:bg-slate-300'}`}>
                            <p className={`flex justify-start items-center gap-2 text-[#EFEFEF] lg:text-lg md:text-base text-sm font-bold px-2
                                hover:text-white hover:font-medium hover:pl-2 duration-300`}>
                                <TbDeviceTabletSearch className="w-5 h-5 mt-0.5"/>
                                求人審査
                            </p>
                        </Link>
                        <Link to={"/admin/users"} className={`flex justify-start items-center p-2 rounded-lg gap-2 duration-300 mt-4 ${isSelected("/admin/users") ? 'font-medium pl-2 duration-300 bg-[#17a2b8]' : 'text-gray-400 hover:bg-slate-300'}`}>
                            <p className={`flex justify-start items-center gap-2 text-[#EFEFEF] lg:text-lg md:text-base text-sm font-bold px-2
                                hover:text-white hover:font-medium hover:pl-2 duration-300`}>
                                <LiaUsersSolid className="w-5 h-5 mt-0.5"/>
                                CS会員管理
                            </p>
                        </Link>
                        <Link to={"/admin/qa"} className={`flex justify-start items-center p-2 rounded-lg gap-2 duration-300 mt-4 ${isSelected("/admin/qa") ? 'font-medium pl-2 duration-300 bg-[#17a2b8]' : 'text-gray-400 hover:bg-slate-300'}`}>
                            <p className={`flex justify-start items-center gap-2 text-[#EFEFEF] lg:text-lg md:text-base text-sm font-bold px-2
                                hover:text-white hover:font-medium hover:pl-2 duration-300`}>
                                <BsFillQuestionCircleFill className="w-5 h-5 mt-0.5"/>
                                お問い合わせ管理
                            </p>
                        </Link>
                        <Link to={"/admin/settings"} className={`flex justify-start items-center p-2 rounded-lg gap-2 duration-300 mt-4 ${isSelected("/admin/settings") ? 'font-medium pl-2 duration-300 bg-[#17a2b8]' : 'text-gray-400 hover:bg-slate-300'}`}>
                            <p className={`flex justify-start items-center gap-2 text-[#EFEFEF] lg:text-lg md:text-base text-sm font-bold px-2
                                hover:text-white hover:font-medium hover:pl-2 duration-300`}>
                                <IoSettings className="w-5 h-5 mt-0.5"/>
                                設定
                            </p>
                        </Link>
                        <Link to={"/admin/contents"} className={`flex justify-start items-center p-2 rounded-lg gap-2 duration-300 mt-4 ${isSelected("/admin/contents") ? 'font-medium pl-2 duration-300 bg-[#17a2b8]' : 'text-gray-400 hover:bg-slate-300'}`}>
                            <p className={`flex justify-start items-center gap-2 text-[#EFEFEF] lg:text-lg md:text-base text-sm font-bold px-2
                                hover:text-white hover:font-medium hover:pl-2 duration-300`}>
                                <MdOutlineContentPaste className="w-5 h-5 mt-0.5"/>
                                コンテンツ管理
                            </p>
                        </Link>
                    </div>
                    <div className="flex h-full w-5/6">
                        <div className="h-full w-full">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageLayout;