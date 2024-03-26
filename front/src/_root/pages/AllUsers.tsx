import { useToast } from "@/components/ui/use-toast";
import { Loader } from "@/components/shared";

const AllUsers = () => {
  const { toast } = useToast();

  return (
    <div className="common-contaer">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        <ul className="user-grid">something</ul>
      </div>
    </div>
  );
};

export default AllUsers;
