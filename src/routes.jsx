import {
  HomeIcon,
  NewspaperIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  BanknotesIcon,
  ArrowLeftOnRectangleIcon,
  VideoCameraIcon,
  WrenchScrewdriverIcon
} from "@heroicons/react/24/solid";
import { Mytryout, Profile, Pembelian, Liveclass, Learning } from "@/pages/dashboard";
import { SignIn, SignUp, Google, ForgotPass,ChangePass } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
    
      {
        icon: <HomeIcon {...icon} />,
        name: "my tryout",
        path: "/mytryout",
        element: <Mytryout />
      },
      {
        icon: <NewspaperIcon {...icon} />,
        name: "my learning",
        path: "/learning",
        element: <Learning />,
      },
      {
        icon: <VideoCameraIcon {...icon} />,
        name: "live class",
        path: "/liveclass",
        element: <Liveclass />,
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "Pembelian",
        path: "/pembelian",
        element: <Pembelian />,
      },
      {
        icon: <WrenchScrewdriverIcon {...icon} />,
        name: "setting",
        path: "/profile",
        element:<Profile />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "forgot pass",
        path: "/forgot-pass",
        element: <ForgotPass />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "change pass",
        path: "/change-pass",
        element: <ChangePass/>,
      }
    ],
  },
];

export default routes;
