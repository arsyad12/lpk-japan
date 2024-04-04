import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { Paket, ShowLearning, DetailTryout, Exam, HasilTryout, Review, Quiz,DetailQuiz, ReviewQuiz, Checkout, PaymentHistory } from "@/pages/dashboard/";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  const { slug } = useParams(); //request parameter

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        {/* <Configurator /> */}
        {/* <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton> */}
        <Routes>
          {routes.map(({ layout, pages }) => {
            if (layout === "dashboard") {
              return pages.map(({ path, element }) => (
                <Route key={path} exact path={path} element={element} />
              ));
            }
            return null; // Ignore non-auth layouts
          })}
          {/* <Route path="*" element={<Navigate to="/dashboard/mytryout" />} /> */}
          <Route path="/mytryout" element={<Paket/>} />
          <Route path="/learning/:id" element={<ShowLearning />} />
          <Route path="/detailTryout/:id" element={<DetailTryout/>}/>
          <Route path="/exam/:id" element={<Exam />}/>
          <Route path="/hasilTryout/:id" element={<HasilTryout />}/>
          <Route path="/review/:id" element={<Review />}/>
          <Route path="/reviewQuiz/:id" element={<ReviewQuiz />}/>
          <Route path="/quiz/:id" element={<Quiz />}/>
          <Route path="/detailQuiz/:id" element={<DetailQuiz />}/>
          <Route path="/checkout/:id" element={<Checkout />}/>
          <Route path="/paymentHistory" element={<PaymentHistory />}/>
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
