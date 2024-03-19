import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { decodeJWT, getProfile, logout } from "@/jwt_back/work";
import { useContext, useEffect, useState } from "react";
import ProfileContext from "@/context/ImageContext";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (!localStorage.getItem("jwtToken")) {
    return;
  }

  const user_credentials = decodeJWT();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const userdataDecoded = decodeJWT();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const username = decodeJWT().sub;
        console.log(username);
        const data = await getProfile(username);
        setUserData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      logout();
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  if (!userData) {
    return <Loader />;
  }

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src={"/assets/images/logo.png"}
            alt="logo"
            width={150}
            height={30}
          />
        </Link>
        <Link
          to={`/profile/${user_credentials.sub}`}
          className="flex gap-3 items-center">
          <img
            src={
              userData.avatar ==
              "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/"
                ? "/assets/icons/profile-placeholder.svg"
                : userData.avatar
            }
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{userData.first_name}</p>
            <p className="small-regular text-light-3">
              @{user_credentials.sub}
            </p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => handleSignOut(e)}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
