import { searchUser } from "@/jwt_back/work";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const SearchResults = () => {
  const { username } = useParams();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const results = await searchUser(username);
        setUsers(results);
        console.log(results);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return (
    <div className="container mx-auto pt-10 flex flex-col items-center w-full max-w-[900px]">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className="w-[100%]">
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.id}>
                <div
                  className={`flex items-center gap-3 border p-4 w-[100%]${
                    user.id === users[users.length - 1].id
                      ? "border-white"
                      : "border-gray-300"
                  } `}>
                  <Link
                    key={user.id}
                    to={`/profile/${user.username}`}
                    className="flex items-center gap-3">
                    <img
                      src={
                        user.avatar ===
                          "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/" ||
                        user.avatar === null
                          ? "/assets/icons/profile-placeholder.svg"
                          : user.avatar
                      }
                      alt="profile"
                      className="h-8 w-8 rounded-full"
                    />
                    <p>{user.username}</p>
                  </Link>
                  {users.length > 1 &&
                  user.id !== users[users.length - 1].id ? (
                    <hr className="my-5 w-full opacity-20" />
                  ) : null}
                </div>
              </li>
            ))
          ) : (
            <p className="text-center font-bold">😭😭😭😭😭Таких юзерів немає😭😭😭😭😭</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
