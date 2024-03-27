import { Models } from "appwrite";
import { Link } from "react-router-dom";
// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCard } from "@/components/shared";
import { useToast } from "@/components/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  decodeJWT,
  getAllPosts,
  isAuthenticated,
  logout,
  getOrganisationbyId,
  getSidebarData,
  getAllOrganizatios,
} from "@/jwt_back/work";
import Channels from "@/components/shared/Channels";
import OrganizationDescription from "@/components/shared/OrganizationDescription";
import { set } from "react-hook-form";

const Home = ({showChannels, setShowChannels}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  // const [showOrganization, setShowOrganization] = useState(false);
  const [organisations, setOrganisations] = useState(null);
  const [sidebar_organization, setSidebarOrganization] = useState(null);
  const [sidebar_categories, setSidebarcategories] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPosts();
        setPosts(data);
        const datacategories = await getSidebarData();
        const dataorganisations = await getAllOrganizatios();
        setSidebarcategories(datacategories.categories);
        setSidebarOrganization(dataorganisations);
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
          {/* {showOrganization ? <OrganizationDescription /> : null} */}
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
          {sidebar_organization.length === 0 ? 
            <p className="base-medium text-dark-1 text-center pt-[60px] w-full">
              На жаль, у вас ще немає організацій
            </p> 
          :          
          <ul className="grid 2xl:grid-cols-2 gap-3 pt-[60px]">
            {sidebar_organization?.map((organization) => (
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

        <div className="home-creators h-2/5 relative">
          <div className="fixed flex w-full bg-light-1 pb-2 pt-2">
            <h3 className="h3-bold text-dark-1">Категорії</h3>
          </div>
          <ul className="grid 2xl:grid-cols-2 gap-3 pt-[60px]">
            {sidebar_categories?.map((category) => (
              <li key={category.id}>
                <div className="flex-center flex-col gap-4 border border-light-4 rounded-[20px] px-5 py-2 cursor-pointer">
                  <div className="flex-center flex-col gap-1">
                    <p className="base-medium text-dark-1 text-center line-clamp-1">
                      {category.category_name}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showChannels ? 
      //  <Channels showOrganization={showOrganization} setShowOrganization={setShowOrganization} showChannels={showChannels} setShowChannels={setShowChannels} organisations={sidebar_organization} categories={sidebar_categories}/>
       <Channels showChannels={showChannels} setShowChannels={setShowChannels} organisations={sidebar_organization} categories={sidebar_categories}/>

      : null}
    </div>
  );
};

export default Home;
