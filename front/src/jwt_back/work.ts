import axios from "axios";
import * as qs from "qs";
import { toast } from "@/components/ui";
import { jwtDecode } from "jwt-decode";

let jwtToken = localStorage.getItem("jwtToken") || "";

// *************************************
// VALIDATION
// *************************************
export const isTokenValid = (token) => {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.exp * 1000 > Date.now();
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

export const isAuthenticated = () => {
  // Check if JWT token exists and is not expired
  return jwtToken !== "" && isTokenValid(jwtToken);
};

// *************************************
// DECODE
// *************************************
export const decodeJWT = () => {
  const token = localStorage.getItem("jwtToken");
  return jwtDecode(token);
};

// *************************************
// USER
// *************************************
export const logout = () => {
  localStorage.removeItem("jwtToken");
  jwtToken = "";
};

export const login = async (userdata) => {
  const userdata_new = qs.stringify(userdata);

  try {
    const response = await axios.post(
      "http://cucu-1257864284.eu-north-1.elb.amazonaws.com/auth/login/",
      userdata_new
    );

    const token = response.data.access_token;
    localStorage.setItem("jwtToken", token);
    jwtToken = token;
  } catch (e) {
    toast({ title: "Неправильний пароль або ім'я користувача" });
    return "error";
  }
};

export const register = async (userdata) => {
  try {
    const response = await axios.post(
      "http://cucu-1257864284.eu-north-1.elb.amazonaws.com/auth/registration",
      userdata
    );

    const token = response.data.access_token;

    localStorage.setItem("jwtToken", token);
    jwtToken = token;
  } catch (e) {
    toast({ title: e.response.data.detail });
    return "error";
  }
};

// *************************************
// POSTS
// *************************************
export const createPost = async (postdata) => {
  const response = await axios.post(
    "http://cucu-1257864284.eu-north-1.elb.amazonaws.com/post/create",
    postdata,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Post creation failed. Please try again." });
    return "error";
  }
};

export const likePost = async (postId: number) => {
  const formData = new FormData();
  formData.append("post_id", postId);

  const response = await axios.post(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/post/${postId}/like`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Post creation failed. Please try again." });
    return "error";
  }
};

export const getPostById = async (postId) => {
  const data = await axios.get(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/post/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (data.status !== 200) {
    toast({ title: "Post creation failed. Please try again." });
    return "error";
  }

  return data.data;
};

export const getAllPosts = async () => {
  try {
    const data = await axios.get(
      `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/posts/all`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (data.status !== 200) {
      toast({ title: "Failed to fetch posts. Please try again." });
      return "error";
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    toast({ title: "Failed to fetch posts. Please try again." });
    return "error";
  }
};

export const updatePost = async (postId, text) => {
  const response = await axios.put(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/post/${postId}/update`,
    {
      text: text,
    },
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Post creation failed. Please try again." });
    return "error";
  }
};

export const deletePost = async (post_id: number) => {
  const response = await axios.delete(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/post/${post_id}/delete`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Post creation failed. Please try again." });
    return "error";
  }
};

// *************************************
// PROFILE
// *************************************
export const getProfile = async (username: string) => {
  const data = await axios.get(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/profile/${username}/`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  if (data.status !== 200) {
    toast({ title: "Post get mehod failed. Please try again." });
    return "error";
  }

  return data;
};

export const uploadAvatar = async (avatarForm) => {
  const response = await axios.post(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/auth/upload_avatar`,
    avatarForm,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Profile image update failed. Please try again." });
    return "error";
  }
  try {
  } catch (error) {
    toast({ title: "Profile image update failed. Please try again." });
    return "error";
  }
};

export const followUser = async (username) => {
  const response = await axios.post(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/profile/${username}/follow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Post get mehod failed. Please try again." });
    return "error";
  }
};

export const getFollowers = async (username) => {
  const response = await axios.get(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/profile/${username}/followers`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Post get mehod failed. Please try again." });
    return "error";
  }

  return response.data;
};

export const getFollowings = async (username) => {
  const response = await axios.get(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/profile/${username}/followings`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Post get mehod failed. Please try again." });
    return "error";
  }

  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axios.put(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/profile/update_info/`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Profile update failed. Please try again." });
    return "error";
  }
};

// *************************************
// ORGANISATION
// *************************************
export const createOrganisation = async (organisationData) => {
  toast({ title: "Waiting for backend" });
};

export const getOrganisationbyId = async (organisationId) => {
  const response = await axios.get(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/organization/${organisationId}/`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  if (response.status !== 200) {
    toast({ title: "Не вдалося отримати організацію" });
    return "error";
  }
  return response;
};

export const getAllOrganizatios = async () => {
  const response = await axios.get(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/organization/all`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  if (response.status !== 200) {
    toast({ title: "Не вдалося отримати всі організації" });
    return "error";
  }
  return response.data;
};
// *************************************
// SIDEBAR
// *************************************

export const getSidebarData = async () => {
  const response = await axios.get(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/event/get_categories_and_orgs`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  if (response.status !== 200) {
    toast({ title: "Не вдалося отримати дані сайдбару" });
    return "error";
  }
  return response.data;
};

// *************************************
// EVENT
// *************************************

export const createEvent = async (eventData) => {
  const response = await axios.post(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/event/create_event`,
    eventData,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Не вдалося обновити профайл" });
    return "error";
  }
};

export const getEventbyCategoryId = async (categoryId) => {
  const response = await axios.get(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/event/${categoryId}/`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  if (response.status !== 200) {
    toast({ title: "Не вдалося знайти event" });
    return "error";
  }
  return response.data;
};
// *************************************
// COMMENTS
// *************************************
export const createComment = async (commentData, postId) => {
  const response = await axios.post(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/post/${postId}/comment`,
    commentData,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Не вдалося створити комент" });
    return "error";
  }

  return response.data;
};

export const likeComment = async (commentId) => {
  const response = await axios.post(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/${commentId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Не вдалося лайкнути комент" });
    return "error";
  }

  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await axios.delete(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/comment/${commentId}/delete`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Не вдалося видалити комент" });
    return "error";
  }
};

// *************************************
// ANONYMOUS POSTS
// *************************************

export const createAnonymousPost = async (post) => {
  const response = await axios.post(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/anonymous/create`,
    post,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Не вдалося створити пост" });
    return "error";
  }
};

export const getAllAnonymousPosts = async () => {
  const response = await axios.get(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/anonymous/all/`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Не вдалося дістати всі анонімні пости" });
    return "error";
  }

  return response.data;
};

export const getAnonymousPostById = async (postId) => {
  const response = await axios.get(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/anonymous/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Не вдалося знайти юзера" });
    return "error";
  }

  return response.data;
};

// *************************************
// SEARCH
// *************************************

export const searchUser = async (searchdata) => {
  const response = await axios.get(
    `http://cucu-1257864284.eu-north-1.elb.amazonaws.com/profile/search?username=${searchdata}`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    toast({ title: "Не вдалося здійснити пошук" });
    return "error";
  }

  return response.data;
};
