import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { decodeJWT, getProfile, logout } from "@/jwt_back/work";
import { Loader } from ".";

import "../../styles/topbar.css";
import { Input } from "../ui";
import { ImageContext } from "@/context/ImageContext";

const Topbar = () => {
  const navigate = useNavigate();
  if (!localStorage.getItem("jwtToken")) {
    return;
  }
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const userdataDecoded = decodeJWT();
  const { image, setImage } = useContext(ImageContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const username = decodeJWT().sub;
        const data = await getProfile(username);
        setUserData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [image]);

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
    return;
  }

  return (
    <section className="topbarContainer py-[30px]">
      <Link to="/" className="flex gap-3 items-center">
        <img
          src="/assets/images/logo.png"
          alt="logo"
          width={130}
          height={325}
        />
      </Link>
      <div className="explore-inner_container ">
        <div className="flex gap-1 px-4 w-full rounded-lg bg-light-2">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Пошук"
            className="explore-search max-w-[400px]"
          />
        </div>
      </div>

      <div className="topbarRight">
        <Link to={"/create-post"} className="topbarIconItem hidden xl:flex">
          <img src="/assets/icons/new_post.png" alt="add-post" />
        </Link>
        <Link to={"/anonymous-posts"} className="topbarIconItem hidden xl:flex">
          <img src="/assets/icons/anonym.png" alt="anonym-posts" />
        </Link>
        <Link
          to={"/create-organization"}
          className="topbarIconItem hidden xl:flex">
          <img src="/assets/icons/people.svg" alt="create-organisation" />
        </Link>
        <Link to={"/calendar"} className="topbarIconItem hidden xl:flex">
          <img src="/assets/icons/calendar.png" alt="calendar" />
        </Link>
        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            handleSignOut(e)
          }>
          <img src="/assets/icons/logout.svg" alt="logout" />
        </Button>
        <Link
          to={`/profile/${userData.username}`}
          className="flex-center gap-3 mr-10">
          <img
            src={
              userData.avatar ==
                "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/" ||
              userData.avatar === null
                ? "/assets/icons/profile-placeholder.svg"
                : userData.avatar
            }
            alt="profile"
            className="h-8 w-8 rounded-full"
          />
        </Link>
      </div>
    </section>
  );
};

export default Topbar;
