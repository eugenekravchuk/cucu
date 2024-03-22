import { Button } from "@/components/ui";

interface StabBlockProps {
    value: string | number;
    label: string;
  }
  
  const StatBlock = ({ value, label }: StabBlockProps) => (
    <div className="flex-center gap-2">
      <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
      <p className="small-medium lg:base-medium text-dark-2">{label}</p>
    </div>
  );

const OrganizationDescription = () => {
    return (
        <div className="profile-inner_container">
            <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
            <img
                src= "/assets/icons/profile-placeholder.svg"
                alt="profile"
                className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
            />
            <div className="flex flex-col flex-1 justify-between md:mt-2">
                <div className="flex flex-col w-full">
                    <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                        ОССА
                        {/* {userData.first_name} {userData.last_name} */}
                    </h1>
                    {/* <p className="small-regular md:body-medium text-dark-3 text-center xl:text-left">
                        @{userData.username}
                    </p> */}
                </div>

                <div className="flex gap-8 mt-6 items-center justify-center xl:justify-start flex-wrap z-20">
                <StatBlock value={0} label="Posts" />
                <StatBlock value={20} label="Followers" />
                <StatBlock value={20} label="Following" />
                {/* <StatBlock value={userData.posts.length} label="Posts" />
                <StatBlock value={userData.followers} label="Followers" />
                <StatBlock value={userData.following} label="Following" /> */}
                </div>

                <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                    Опис організації
                {/* {currentUser.bio} */}
                </p>
            </div>

            <div className="flex-col justify-center gap-4">
                {/* <div
                className={`${
                    userdataDecoded.sub !== userData.username && "hidden"
                }`}>
                <Link
                    to={`/update-profile/${userdataDecoded.sub}`}
                    className={`h-12 bg-light-2 px-5 text-dark-4 flex-center gap-2 rounded-lg ${
                    userdataDecoded.sub !== userData.username && "hidden"
                    }`}>
                    <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={20}
                    height={20}
                    />
                    <p className="flex whitespace-nowrap small-medium text-dark-1">
                    Edit Profile
                    </p>
                </Link>
                </div> */}
                {/* <div className={`${username === userdataDecoded.sub && "hidden"}`}>
                {isButtonLoading ? (
                    <div className="flex items-center justify-center">
                    <Loader />
                    </div>
                ) : (
                    <Button
                    onClick={followUserFunc}
                    type="button"
                    className={`shad-button_primary px-8 hover:bg-[#8E8E8E]`}>
                    {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                )} */}
                <Button
                    // onClick={followUserFunc}
                    type="button"
                    className={`shad-button_primary px-8 hover:bg-[#8E8E8E]`}>
                    {"Follow"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default OrganizationDescription;
