import { useState } from "react";
import { Link } from "react-router-dom";
const Channels = ({  showChannels, setShowChannels, organisations, categories }) => {
    return (
        <div className="flex-col absolute xl:hidden bg-light-1 top-[50px] right-0 border border-light-2 z-20 h-full bottom-[50px]">
        <div className="flex-col w-60 px-6 pb-5 gap-10  overflow-scroll custom-scrollbar h-2/5">
          <div className="fixed flex w-full bg-light-1 pb-2 pt-2">
            <p className="text-dark-1 text-s font-bold md:h3-bold mt-1">Організації</p>
          </div>          
          {organisations.length === 0 ? 
            <p className="base-medium text-dark-1 text-center pt-[60px]">
              На жаль, у вас ще немає організацій
            </p> 
          :          
          <ul className="grid 2xl:grid-cols-2 gap-3 pt-[60px]">
            {organisations?.map((organization) => (
              <li key={organization.id}>
                <Link to={`/organisation/${organization.id}`} className="user-card" onClick={() => {
                    // setShowOrganization(showOrganization => !showOrganization);
                }}>
                  <img
                    src={organization.organization_image || "/assets/icons/profile-placeholder.svg"}
                    alt="creator"
                    className="rounded-full w-10 h-10"
                  />
                  <div className="flex-center flex-col gap-1">
                    <p className="base-medium text-dark-1 text-center line-clamp-1">
                      {organization.organization_name}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          }
        </div>

        <div className="flex-col w-60 2xl:w-465 px-6 pb-5 gap-10  overflow-scroll custom-scrollbar h-2/5 relative">
          <div className="fixed flex w-full bg-light-1 pb-2 pt-2">
            <p className="text-dark-1 text-s font-bold md:h3-bold">Категорії</p>
          </div>
          <ul className="grid gap-2 md:pt-[60px] pt-[45px]">
            {categories?.map((category) => (
              <li key={category.id}>
                <div className="flex-center flex-col gap-4 border border-light-4 rounded-[20px] px-5 py-2 cursor-pointer">
                  <div className="flex-center flex-col gap-1">
                    <p className="md:base-medium font-medium text-[12px] text-dark-1 text-center line-clamp-1">
                      {category.category_name}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ) 
}
export default Channels;