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
import {
  decodeJWT,
  getProfile,
  followUser,
  getFollowers,
  getFollowings,
} from "@/jwt_back/work";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowing] = useState([]);
  // const [followers, setFollowers] = useState([])
  const userdataDecoded = decodeJWT();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const data = await getProfile(username);
        const data2 = await getFollowers(username);
        const data3 = await getFollowings(username);
        setFollowers(data2);
        setFollowing(data3);
        setUserData(data.data);
        setIsFollowing(data.data.is_following);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isFollowing, username]);

  const followUserFunc = async () => {
    setIsButtonLoading(true);
    try {
      const outcome = await followUser(username);
    } catch (e) {
      console.log(e);
    } finally {
      setIsFollowing(!isFollowing);
      setIsButtonLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container mb-[50px]">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              userData.avatar ==
                "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/" ||
              userData.avatar == null
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
              <p className="xl:text-start mt-[10px] text-center">
                {userData.bio}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={userData.posts.length} label="Posts" />
              <Dialog>
                <DialogTrigger>
                  <span className="font-bold">{followers.length}</span>{" "}
                  Followers
                </DialogTrigger>
                <DialogContent>
                  {followers.length > 0 ? (
                    followers.map((follower) => (
                      <div
                        className={`flex items-center gap-3 border-b ${
                          follower.id === followers[followers.length - 1].id
                            ? "border-white"
                            : "border-[#A3A3A3] pb-5"
                        } `}>
                        <Link
                          key={follower.id}
                          to={`/profile/${follower.username}`}
                          className="flex items-center gap-3">
                          <img
                            src={
                              follower.avatar ==
                                "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/" ||
                              follower.avatar == null
                                ? "/assets/icons/profile-placeholder.svg"
                                : follower.avatar
                            }
                            alt="profile"
                            className="h-8 w-8 rounded-full"
                          />
                          <p>{follower.username}</p>
                        </Link>
                        {followers.length > 1 &&
                        follower.id !== followers[followers.length - 1].id ? (
                          <hr className="my-5 w-full" />
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p>No followers</p>
                  )}
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger>
                  <span className="font-bold">{followings.length}</span>{" "}
                  Followings
                </DialogTrigger>
                <DialogContent>
                  {followings.length > 0 ? (
                    followings.map((following) => (
                      <div
                        key={following.id}
                        className={`flex items-center gap-3 border-b ${
                          following.id === followings[followings.length - 1].id
                            ? "border-white"
                            : "border-[#A3A3A3] pb-5"
                        } `}>
                        <Link
                          key={following.id}
                          to={`/profile/${following.username}`}
                          className="flex items-center gap-3">
                          <img
                            src={
                              following.avatar ==
                                "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/" ||
                              following.avatar == null
                                ? "/assets/icons/profile-placeholder.svg"
                                : following.avatar
                            }
                            alt="profile"
                            className="h-8 w-8 rounded-full"
                          />
                          <p>{following.username}</p>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p>No followings</p>
                  )}
                </DialogContent>
              </Dialog>
              {/* <StatBlock value={userData.followers} label="Followers" />
              <StatBlock value={userData.following} label="Following" /> */}
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {/* {currentUser.bio} */}
            </p>
          </div>

          <div className="flex-col justify-center gap-4">
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
            <div className={`${username === userdataDecoded.sub && "hidden"}`}>
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
              )}
            </div>
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
            Публікації
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
            Вподобані пости
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={userData.posts} showUser={false} />}
        />
        {userdataDecoded.sub === userData.username && (
          <Route
            path="/liked-posts"
            element={<LikedPosts posts={userData.liked_posts} />}
          />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
