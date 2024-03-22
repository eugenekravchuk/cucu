import { Outlet, useNavigate } from "react-router-dom";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { useEffect } from "react";
import { isAuthenticated } from "@/jwt_back/work";
import { ImageProvider } from "@/context/ImageContext";

const RootLayout = ({ showChannels, setShowChannels }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/home");
    } else {
      navigate("/sign-in");
    }
  }, []);

  return (
    <ImageProvider>
      <div className="w-full">
        <Topbar />

        {/* <LeftSidebar /> */}

        <section className="flex flex-1 h-full bg-light-1">
          <Outlet />
        </section>

        <Bottombar showChannels={showChannels} setShowChannels={setShowChannels} />
      </div>
    </ImageProvider>
  );
};

export default RootLayout;
