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

  const handleEnterKeyPress = async (event) => {
    if (event.key === "Enter") {
      const searchQuery = event.target.value.trim();
      if (searchQuery) {
        navigate(`/searchresults/${searchQuery}`);
      } else {
        navigate("/home");
      }
    }
  };


  if (!userData) {
    return;
  }

  return (
    <section className="topbarContainer py-[30px] flex">
      <Link to="/" className="gap-3 items-center pl-3 hidden xs:flex">
        <img
          src="/assets/images/logo.png"
          alt="logo"
          width={130}
          height={325}
        />
      </Link>
      <Link  to="/" className="left-0 flex gap-3 items-center xs:hidden">
        <img
          src="/assets/images/logo-mini.png"
          alt="logo"
          width={30}
          height={30}
          className='left-0 mr-2'
        />
      </Link>
      <div className="explore-inner_container md:w-[500px] xl:w-[700px] md:px-10">
        <div className="flex gap-1 px-2 md:px-4 w-[100%] rounded-lg bg-light-2">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            className="md:w-[24px] w-[14px]"
            alt="search"
          />
          <Input
            type="text"
            placeholder="Пошук"
            className="explore-search max-w-[700px]"
            onKeyUp={handleEnterKeyPress}
            onChange={(event) => {
              if (!event.target.value) {
                navigate("/home");
              }
            }}
          />
        </div>
      </div>

      <div className="topbarRight xl:w-[368px]">
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
          className="shad-button_ghost px-0 py-0 mr-2 ml-2 h-[24px] w-[24px]"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            handleSignOut(e)
          }>
          <img src="/assets/icons/logout.svg" alt="logout" className="block "/>
        </Button>
        <Link
          to={`/profile/${userData.username}`}
          className="flex-center gap-3 mr-2 md:mr-10">
          <img
            src={
              userData.avatar ==
                "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/" ||
              userData.avatar === null
                ? "/assets/icons/profile-placeholder.svg"
                : userData.avatar
            }
            alt="profile"
            className="w-7 h-7 xs:h-8 xs:w-8 rounded-full"
          />
        </Link>
      </div>
    </section>
  );
};

export default Topbar;
