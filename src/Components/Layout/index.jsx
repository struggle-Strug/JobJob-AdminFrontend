import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <div className="bg-[#EFEFEF]">
                <Outlet />
            </div>
        </>
    )
}

export default Layout;