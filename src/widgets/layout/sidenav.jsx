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
import { SettingUserData } from "@/data";


export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
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
      className={`${sidenavTypes[sidenavType]} ${openSidenav ? "translate-x-0" : "-translate-x-80"
        } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div
        className={`relative`}
      >
        <Link to="/" className="py-3 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          > <img
              src="/img/logo.png"
              alt="bruce-mars"
              size="xl"
              className="w-1/2 object-center mx-auto"
            />
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-teal-500" />
        </IconButton>
      </div>
      <div className="m-4">
        <div className="flex flex-col gap-x-4 items-center justify-center mb-5">
          <img
            src={profileData ? (profileData.user.image
            ) : (
              "/img/icon-go.png"
            )}
            className="w-20 h-20 mb-1 rounded-full cursor-pointer"
            alt="user"
          />
          <div>
            <h1 className="text-teal-500 items-center origin-left font-medium text-md">
              {profileData ? (profileData.user.name
              ) : (
                <p>Loading profile...</p>
              )}
            </h1>
            <p className={`text-xs text-center ${profileData ? (profileData.user.display_purchase_category === 'premium' ? 'text-green-400' : 'text-red-400') : ''}`}> {profileData ? (profileData.user.display_purchase_category
            ) : (
              <p>Loading profile...</p>
            )}</p>
          </div>
        </div>
        {routes.map(({ layout, title, pages }, key) => (
          layout === "dashboard" && (
            <ul key={key} className="mb-4 flex flex-col gap-1">
              {title && (
                <li className="mx-3.5 mt-4 mb-2">
                  <Typography
                    variant="small"
                    color={sidenavType === "dark" ? "white" : "blue-gray"}
                    className="font-black uppercase opacity-75"
                  >
                    {title}
                  </Typography>
                </li>
              )}
              {pages.map(({ icon, name, path }) => (
                <li key={name}>
                  <NavLink to={`/${layout}${path}`}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={
                          isActive
                            ? sidenavColor
                            : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                        }
                        className="flex items-center gap-4 px-4 capitalize"
                        fullWidth
                      >
                        {icon}
                        <Typography
                          color="inherit"
                          className="font-medium capitalize"
                        >
                          {name}
                        </Typography>
                      </Button>
                    )}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to={'/sign-out'} onClick={handleLogout}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                            ? "white"
                            : "blue-gray"
                      }
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <ArrowLeftOnRectangleIcon className="w-5 h-5 text-inherit" />
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        Log Out
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            </ul>
          )
        ))}
      </div>

    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo.png",
  brandName: "Go Prestasi",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
