import { GridPostList, Loader } from "@/components/shared";

const LikedPosts = () => {
  // const { data: currentUser } = useGetCurrentUser();

  // if (!currentUser)
  //   return (
  //     <div className="flex-center w-full h-full">
  //       <Loader />
  //     </div>
  //   );

  return (
    <>
      <p className="text-dark-4">Немає вподобаних постів</p>
      {/* {currentUser.liked.length === 0 && (
        
      )} */}

      {/* <GridPostList posts={currentUser.liked} showStats={false} /> */}
    </>
  );
};

export default LikedPosts;
