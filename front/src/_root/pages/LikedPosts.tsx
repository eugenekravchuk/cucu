import { GridPostList } from "@/components/shared";

const LikedPosts = ({ posts }) => {
  return (
    <>
      {posts.length === 0 ? (
        <p className="text-dark-4">Немає вподобаних постів</p>
      ) : (
        <GridPostList posts={posts} showStats={false} />
      )}
    </>
  );
};

export default LikedPosts;
