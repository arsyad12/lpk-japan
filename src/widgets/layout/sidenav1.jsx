import PropTypes from "prop-types";
import { Link, NavLink, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { authService } from "@/data";
import { SettingUserData} from "@/data";


export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    gopres: "bg-white to-black border-gray-200",
    transparent: "bg-transparent",
  };

  const handleLogout = () => {
    authService.logout();
    // Redirect atau lakukan tindakan lain setelah logout jika diperlukan
    return <Navigate to="/auth/sign-in" />
  };

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await SettingUserData();
        setProfileData(data);
      } catch (error) {
        console.error('Error setting user data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <aside
      className={"-translate-x-80 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100"}
    >

      <div className="m-4">
    
     
          <ul className="mb-4 flex flex-col gap-1">
              <li>
                <NavLink to={"/dashboard/no"}>
                {({ isActive }) => (
                <Button
                      variant={isActive ? "filled" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "green"
                            ? "white"
                            : "blue-gray"
                      }
                      // style={{ backgroundColor: isActive ? "gopres" : "white", color: isActive ? "white" : "dark" }}
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    ><p>ic</p>
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                     <p>ic</p>
                    </Typography></Button>
                     )}
                
                </NavLink>
              </li>
              <li>
                <NavLink to={"/dashboard/profil"}>
                {({ isActive }) => (
                <Button
                      // variant={isActive ? "gradient" : "text"}
                      // color={
                      //   isActive
                      //     ? sidenavColor
                      //     : sidenavType === "gopres"
                      //       ? "white"
                      //       : "blue-gray"
                      // }
                      style={{ backgroundColor: isActive ? "#14B8A6" : "white", color: isActive ? "white" : "dark" }}
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    ><p>i</p>
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                     <p>kl</p>
                    </Typography></Button>
                 )}
                </NavLink>
              </li>
          </ul>

      </div>
     
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo.png",
  brandName: "Go Prestasi",
  colore: "#14B8A6"
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  color: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
