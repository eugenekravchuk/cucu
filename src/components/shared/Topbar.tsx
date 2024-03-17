import {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./topbar.css";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import {Input} from "@/components/ui";

const Topbar = () => {
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className='topbarContainer'>
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.png"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        {/*<div className="searchbar">*/}
        {/*  <Search className='searchIcon'/>*/}
        {/*  <input placeholder="Search for friend, post or video" */}
        {/*         className="searchInput" color="#eff0f6"/>*/}
        {/*</div>*/}
        <div className="explore-inner_container">
          <div className="flex gap-1 px-4 w-full rounded-lg bg-light-2">
            <img
              src="/assets/icons/search.svg"
              width={24}
              height={24}
              alt="search"
            />
            <Input
              type="text"
              placeholder="Search"
              className="explore-search"
              value={searchValue}
              onChange={(e) => {
                const { value } = e.target;
                setSearchValue(value);
              }}
            />
          </div>
        </div>

        {/*<div className="topbarIcons">*/}
        {/*  <div className="topbarIconItem">*/}
        {/*      <AddBox onClick={() => setModalShow(true)}/>*/}
        {/*  </div>*/}
        {/*  <div className="topbarIconItem">*/}
        {/*      <Face2/>*/}
        {/*  </div>*/}
        {/*  <div className="topbarIconItem">*/}
        {/*      <CalendarMonth/>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="topbarRight">
          <Link to={'/create-post'} className="topbarIconItem">
            <img
              src="/assets/icons/new_post.png"
              alt="add-post"
            />
          </Link>
          <Link to={'/create-incognito-post'} className="topbarIconItem">
            <img
              src="/assets/icons/anonym.png"
              alt="add-post"
            />
          </Link>
          <Link to={'/calendar'} className="topbarIconItem">
            <img src="/assets/icons/calendar.png" alt="calendar" />
          </Link>
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>

        {/* <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div> */}
    </section>
  );
};

export default Topbar;
