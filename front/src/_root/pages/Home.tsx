import { Models } from "appwrite";

// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useToast } from "@/components/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  decodeJWT,
  getAllPosts,
  isAuthenticated,
  logout,
} from "@/jwt_back/work";
import Channels from "@/components/shared/Channels";
import OrganizationDescription from "@/components/shared/OrganizationDescription";

const Home = ({showChannels}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const [showOrganization, setShowOrganization] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching post data:", error);
        // Handle error, e.g., setPost(null) and display error UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts mb-[100px]">
          {showOrganization ? <OrganizationDescription /> : null}
          <h2 className="h3-bold md:h2-bold text-left w-full">Стрічка</h2>
          <ul className="flex flex-col flex-1 gap-9 w-full ">
            {posts.map((post: Models.Document) => (
              <li key={post.id} className="flex justify-center w-full">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </div>
      </div>
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

      {/* <div className="home-creators">
        <h3 className="h3-bold text-dark-1">Channels</h3>
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
      </div> */}
      {showChannels ? 
       <Channels showOrganization={showOrganization} setShowOrganization={setShowOrganization}/>
      : null}
    </div>
  );
};

export default Home;
