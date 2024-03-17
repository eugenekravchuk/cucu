import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/profile/${user.$id}`} className="sidebarChannal">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="sidebarChannalImg"
      />
        <p className="base-medium text-dark-1 text-center line-clamp-1">
          {user.name}
        </p>

      {/* <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button> */}
    </Link>
  );
};

export default UserCard;
