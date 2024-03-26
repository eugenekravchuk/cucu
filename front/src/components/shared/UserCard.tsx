import { Models } from "appwrite";
import { Link } from "react-router-dom";

// import { Button } from "../ui/button";

// type UserCardProps = {
//   user: Models.Document;
// };

const UserCard = ({ data }) => {
  return (
    <Link to={`/organisation/${data.id}`} className="user-card">
     {/* <Link to={`/profile/${user.$id}`} className="user-card"> */}
      <img
        src={data.organization_image || "/assets/icons/profile-placeholder.svg"}
        alt="organisation"
        className="rounded-full w-10 h-10"
      />
      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-dark-1 text-center line-clamp-1">
          {data.organization_name}
        </p>
      </div>
    </Link>
  );
};

export default UserCard;
