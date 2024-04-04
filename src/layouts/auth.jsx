import { Routes, Route, Navigate } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Navbar, Footer } from "@/widgets/layout";
import routes from "@/routes";
import {authService} from '@/data';

export function Auth() {

  // const navbarRoutes = [
  //   {
  //     name: "dashboard",
  //     path: "/dashboard/home",
  //     icon: ChartPieIcon,
  //   },
  //   {
  //     name: "profile",
  //     path: "/dashboard/home",
  //     icon: UserIcon,
  //   },
    // {
    //   name: "sign up",
    //   path: "/auth/sign-up",
    //   icon: UserPlusIcon,
    // },
    // {
    //   name: "sign in",
    //   path: "/auth/sign-in",
    //   icon: ArrowRightOnRectangleIcon, 
    // },
  // ];

  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        {routes.map(({ layout, pages }) => {
          if (layout === "auth") {
            return pages.map(({ path, element }) => (
              <Route key={path} exact path={path} element={element} />
            ));
          }
          return null; // Ignore non-auth layouts
        })}
        {/* Rute Pengalihan jika rute tidak ditemukan */}
        <Route path="*" element={<Navigate to="/auth/sign-in" />} />
      </Routes>
    </div>
  );

}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;