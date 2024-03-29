import { Routes, Route } from "react-router-dom";

import {
  Home,
  Explore,
  Saved,
  CreatePost,
  Profile,
  EditPost,
  PostDetails,
  UpdateProfile,
  AllUsers,
} from "@/_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignupForm from "@/_auth/forms/SignupForm";
import SigninForm from "@/_auth/forms/SigninForm";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

import Addresser from "./_root/pages/Addresser";
import AnonymousPosts from "./_root/pages/AnonymousPosts";
import СreateOrganisation from "./_root/pages/СreateOrganisation";
import PostDetailsAnonymous from "./_root/pages/PostDetailsAnonymous";
import СreateEvent from "./_root/pages/СreateEvent";
import Organisation from "./_root/pages/Organisation";
import Category from "./_root/pages/Category";
import { useState } from "react";
const App = () => {
  const [showChannels, setShowChannels] = useState(false);
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route
          element={
            <RootLayout
              showChannels={showChannels}
              setShowChannels={setShowChannels}
            />
          }>
          <Route path="/" element={<Addresser />} />
          <Route
            path="/home"
            element={
              <Home
                showChannels={showChannels}
                setShowChannels={setShowChannels}
              />
            }
          />
          {/*           <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} /> */}
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/posts/a/:id" element={<PostDetailsAnonymous />} />
          <Route path="/profile/:username/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/anonymous-posts" element={<AnonymousPosts />} />
          <Route path="/create-organization" element={<СreateOrganisation />} />
          <Route
            path="/organisation/:id"
            element={
              <Organisation
                showChannels={showChannels}
                setShowChannels={setShowChannels}
              />
            }
          />
          <Route
            path="/category/:id"
            element={
              <Category
                showChannels={showChannels}
                setShowChannels={setShowChannels}
              />
            }
          />
          <Route path="/create-event" element={<СreateEvent />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
