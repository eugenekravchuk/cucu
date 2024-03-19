import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { Button } from "@/components/ui";
import { LikedPosts } from "@/_root/pages";
import { GridPostList, Loader } from "@/components/shared";
import { decodeJWT, getProfile } from "@/jwt_back/work";
import { useEffect, useState } from "react";

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

const Profile = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const userdataDecoded = decodeJWT();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
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

  // let userdata = decodeJWT();

  // const getUserData = async () => {
  //   const userdata2 = await getProfile(userdata.sub);
  //   if (userdata2 === "error") {
  //     return;
  //   }
  //   return userdata2.data;
  // };

  // const userdata_ready = getUserData();

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              userData.avatar ==
              "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/"
                ? "/assets/icons/profile-placeholder.svg"
                : userData.avatar
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {userData.first_name} {userData.last_name}
              </h1>
              <p className="small-regular md:body-medium text-dark-3 text-center xl:text-left">
                @{userData.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={userData.posts.length} label="Posts" />
              <StatBlock value={userData.followers} label="Followers" />
              <StatBlock value={userData.following} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {/* {currentUser.bio} */}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div
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
            </div>
            {/* <div className={`${user.id === id && "hidden"}`}>
              <Button type="button" className="shad-button_primary px-8">
                Follow
              </Button>
            </div> */}
          </div>
        </div>
      </div>

      {userdataDecoded.sub === userData.username && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${userdataDecoded.sub}`}
            className={`profile-tab rounded-l-lg `}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${userdataDecoded.sub}/liked-posts`}
            className={`profile-tab rounded-r-lg `}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={userData.posts} showUser={false} />}
        />
        {userdataDecoded.sub === userData.username && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
