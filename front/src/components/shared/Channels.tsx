import { useState } from "react";
const Channels = () => {
    const [showOrganization, setShowOrganization] = useState(false);
    return (
        <div className="flex-col">
            <div className="home-creators h-1/2 relative">
            <div className="fixed flex w-full bg-light-1 pb-2 pt-2">
                <h3 className="h3-bold text-dark-1">Організації</h3>
            </div>          
            <ul className="grid 2xl:grid-cols-2 gap-3 pt-[60px]">
                <li>
                <div className="user-card" onClick={() => {
                        setShowOrganization(showOrganization => !showOrganization);
                    }}>
                    <img
                    src="/assets/icons/profile-placeholder.svg"
                    alt="creator"
                    className="rounded-full w-10 h-10"
                    />

                    <div className="flex-center flex-col gap-1">
                    <p className="base-medium text-dark-1 text-center line-clamp-1">
                        OCCA
                    </p>
                    </div>
                </div>
                </li>
                {/* {creators?.documents.map((creator) => (
                    <li key={creator?.$id}>
                    <UserCard user={creator} />
                    </li>
                ))} */}
            </ul>
            </div>

            <div className="home-creators h-2/5 relative">
            <div className="fixed flex w-full bg-light-1 pb-2 pt-2">
                <h3 className="h3-bold text-dark-1">Категорії</h3>
            </div>
            <ul className="grid 2xl:grid-cols-2 gap-3 pt-[60px]">
                <li>
                <div className="flex-center flex-col gap-4 border border-light-4 rounded-[20px] px-5 py-2 cursor-pointer">
                    <div className="flex-center flex-col gap-1">
                    <p className="base-medium text-dark-1 text-center line-clamp-1">
                        Спорт
                    </p>
                    </div>
                </div>
                </li>
                <li>
                <div className="flex-center flex-col gap-4 border border-light-4 rounded-[20px] px-5 py-2 cursor-pointer">
                    <div className="flex-center flex-col gap-1">
                    <p className="base-medium text-dark-1 text-center line-clamp-1">
                        Театр
                    </p>
                    </div>
                </div>
                </li>
                <li>
                <div className="flex-center flex-col gap-4 border border-light-4 rounded-[20px] px-5 py-2 cursor-pointer">
                    <div className="flex-center flex-col gap-1">
                    <p className="base-medium text-dark-1 text-center line-clamp-1">
                        Поезія
                    </p>
                    </div>
                </div>
                </li>
                <li>
                <div className="flex-center flex-col gap-4 border border-light-4 rounded-[20px] px-5 py-2 cursor-pointer">
                    <div className="flex-center flex-col gap-1">
                    <p className="base-medium text-dark-1 text-center line-clamp-1">
                        Музика
                    </p>
                    </div>
                </div>
                </li>
            </ul>
            </div>
        </div>
    ) 
}
export default Channels;