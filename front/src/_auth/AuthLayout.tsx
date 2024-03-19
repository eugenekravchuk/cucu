import { isAuthenticated } from "@/jwt_back/work";
import { Outlet, Navigate } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      {isAuthenticated() ? (
        <Navigate to="/home" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src="/assets/images/ucu_image_2.jpg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
}
