import { Link, useLocation } from "react-router-dom";

import { bottombarLinks } from "@/constants";

const Bottombar = () => {
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
            } flex-center flex-col gap-1 p-2 transition text-[#060606]`}>
            <img
              src={link.imgURL}
              alt={link.label}
              width={18}
              height={18}
              className={`${isActive && "invert-white"}`}
            />

            <p className="text-xs font-bold text-dark-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
