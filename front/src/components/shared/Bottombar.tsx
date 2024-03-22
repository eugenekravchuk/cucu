import { Link, useLocation } from "react-router-dom";
import { bottombarLinks } from "@/constants";
import { Button } from "../ui";
import { useState } from "react";
import Channels from "./Channels";

const Bottombar = ({ showChannels, setShowChannels }) => {
  const { pathname } = useLocation();

  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.route}
            className={`${
              isActive && "rounded-[10px] bg-[#74747497] "
            } flex-center flex-col gap-1 p-1 transition text-[#060606]`}>
            <img
              src={link.imgURL}
              alt={link.label}
              width={18}
              height={18}
              className={`${isActive && "invert-white"}`}
            />
            <p className="md:text-xs text-[10px] font-bold text-dark-2">{link.label}</p>
          </Link>
        );
      })}
      {pathname === "/home" ?
          <Button className="flex-center flex-col bg-light-1 hover:bg-[#74747497] p-2 transition text-[#060606]"
            onClick={() => {
              setShowChannels(showChannels => !showChannels);
            }}>
            <img src="/assets/icons/menu.svg" alt="catalog" />
            <p className="md:text-xs text-[10px] font-bold text-dark-2">Catalog</p>
          </Button>
      :null }
    </section>
  );
};

export default Bottombar;
