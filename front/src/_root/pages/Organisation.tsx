import { Models } from "appwrite";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
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
  getOrganisationbyId,
  getSidebarData,
} from "@/jwt_back/work";
import Channels from "@/components/shared/Channels";
import OrganizationDescription from "@/components/shared/OrganizationDescription";

const Organisation = ({showChannels, setShowChannels}) => {
    const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const [organisations, setOrganisations] = useState(null);
  const [sidebar_org, setSidebarOrg] = useState(null);
  const [sidebar_categories, setSidebarCategories] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {        
        const data = await getOrganisationbyId(id);
        setOrganisations(data.data);
        setPosts(data.data.events);
        const data2 = await getSidebarData();
        setSidebarCategories(data2.categories);
        setSidebarOrg(data2.organizations);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
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

            <OrganizationDescription organisation={organisations}/>
            <h2 className="h3-bold md:h2-bold text-left w-full">Події</h2>
            <ul className="flex flex-col flex-1 gap-9 w-full ">
                {/* {posts.map((post: Models.Document) => (
                    <li key={post.id} className="flex justify-center w-full">
                        <EventCard post={post} />
                    </li>
                ))} */}
            </ul>
        </div>
    </div>
      <div className="flex-col">
        <div className="home-creators h-1/2 relative">
          <div className="fixed flex w-full bg-light-1 pb-2 pt-2">
            <h3 className="h3-bold text-dark-1">Організації</h3>
          </div>          
          <ul className="grid 2xl:grid-cols-2 gap-3 pt-[60px]">
            {sidebar_org?.map((organization) => (
              <li key={organization.id}>
                <Link to={`/organisation/${organization.id}`} className="user-card" onClick={() => {
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
       <Channels showChannels={showChannels} setShowChannels={setShowChannels} organisations={sidebar_org} categories={sidebar_categories}/>
      : null}
    </div>
  );
};

export default Organisation;
