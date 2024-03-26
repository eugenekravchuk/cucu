import { useState } from "react";
const Channels = ({
  showOrganization,
  setShowOrganization,
  showChannels,
  setShowChannels,
}) => {
  return (
    <div className="flex-col absolute xl:hidden bg-light-1 top-[50px] right-0 border border-light-2 z-20 h-full bottom-[50px]">
      <div className="flex-col w-60 px-6 pb-5 gap-10  overflow-scroll custom-scrollbar h-2/5">
        <div className="fixed flex w-full bg-light-1 pb-2 pt-2">
          <p className="text-dark-1 text-s font-bold md:h3-bold">Організації</p>
        </div>
        <ul className="grid gap-2 md:pt-[60px] pt-[45px]">
          <li>
            <div
              className="user-card"
              onClick={() => {
                setShowOrganization((showOrganization) => !showOrganization);
                setShowChannels((showChannels) => !showChannels);
              }}>
              <img
                src="/assets/icons/profile-placeholder.svg"
                alt="creator"
                className="rounded-full md:w-10 md:h-10 w-7 h-7"
              />

              <div className="flex-center flex-col gap-1">
                <p className="base-medium text-dark-1 text-center line-clamp-1">
                  OCCA
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex-col w-60 2xl:w-465 px-6 pb-5 gap-10  overflow-scroll custom-scrollbar h-2/5 relative">
        <div className="fixed flex w-full bg-light-1 pb-2 pt-2">
          <p className="text-dark-1 text-s font-bold md:h3-bold">Категорії</p>
        </div>
        <ul className="grid gap-2 md:pt-[60px] pt-[45px]">
          <li>
            <div className="flex-center flex-col gap-4 border border-light-4 rounded-[20px] px-5 py-2 cursor-pointer">
              <div className="flex-center flex-col gap-1">
                <p className="md:base-medium font-medium text-[12px] text-dark-1 text-center line-clamp-1">
                  Спорт
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex-center flex-col gap-4 border border-light-4 rounded-[20px] px-5 py-2 cursor-pointer">
              <div className="flex-center flex-col gap-1">
                <p className="md:base-medium font-medium text-[12px] text-dark-1 text-center line-clamp-1">
                  Театр
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex-center flex-col gap-4 border border-light-4 rounded-[20px] px-5 py-2 cursor-pointer">
              <div className="flex-center flex-col gap-1">
                <p className="md:base-medium font-medium text-[12px] text-dark-1 text-center line-clamp-1">
                  Поезія
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex-center flex-col gap-4 border border-light-4 rounded-[20px] px-5 py-2 cursor-pointer">
              <div className="flex-center flex-col gap-1">
                <p className="md:base-medium font-medium text-[12px] text-dark-1 text-center line-clamp-1">
                  Музика
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Channels;
