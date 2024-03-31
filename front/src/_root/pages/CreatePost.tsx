import PostForm from "@/components/forms/PostForm";
import { Link } from "react-router-dom";

const CreatePost = () => {
  return (
    <div className="flex flex-1 mb-[100px]">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <button className="h3-bold md:h2-bold text-left w-full">
            Створити пост
          </button>
          <img
            src="/assets/icons/event2.png"
            width={36}
            height={36}
            alt="add"
          />

          <Link
            to={"/create-event"}
            className="h3-bold md:h2-bold text-left w-full">
            <button>Створити подію</button>
          </Link>
        </div>

        <PostForm action="Create" />
      </div>
    </div>
  );
};

export default CreatePost;
