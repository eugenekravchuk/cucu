import axios from "axios";
import { useState } from "react";
import * as qs from "qs";
import { toast } from "@/components/ui";
import { clear } from "console";
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
//
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
  } catch {
    toast({ title: "Sign in failed. Please try again." });
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
  } catch {
    toast({ title: "Sign up failed. Please try again." });
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

export const likePost = async (postId) => {
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

// *************************************
// PROFILE
// *************************************
export const getProfile = async (username) => {
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

// export const getPosts = async (token) {
//   ...
// };
