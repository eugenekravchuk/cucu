import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Textarea, Input, Button } from "@/components/ui";
import { ProfileUploader, Loader } from "@/components/shared";

import { ProfileValidation } from "@/lib/validation";
import { useContext, useEffect, useState } from "react";
import { decodeJWT, getProfile, uploadAvatar } from "@/jwt_back/work";
import { ImageContext } from "@/context/ImageContext";

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const userdataDecoded = decodeJWT();
  const { image, setImage } = useContext(ImageContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const username = decodeJWT().sub;
        const data = await getProfile(username);
        setUserData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      // first_name: "", // Initialize with empty values first
      // last_name: "",
      // username: "",
      // email: "",
    },
  });

  // const form = useForm<z.infer<typeof ProfileValidation>>({
  //   resolver: zodResolver(ProfileValidation),
  //   defaultValues: {
  //     file: [],
  //     first_name: userData.first_name,
  //     last_name: userData.last_name,
  //     username: userData.username,
  //     email: userData.email,
  //   },
  // });

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Handler
  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    const formData = new FormData();
    if (Array.isArray(value.file)) {
      // Check if it's an array
      value.file.forEach((file) => {
        formData.append("ava", file);
      });
    } else {
      formData.append("ava", value.file);
    }

    try {
      setIsLoading(true);
      const updateUser = await uploadAvatar(formData);
      const username = decodeJWT().sub;
      const data = await getProfile(username);
      setUserData(data.data);
      setImage(userData.avatar);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      return navigate(`/`);
    }
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            // className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={
                        userData.avatar ==
                        "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/"
                          ? "/assets/icons/profile-placeholder.svg"
                          : userData.avatar
                      }
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap py-6"
                // disabled={isLoadingUpdate}>
                // {isLoadingUpdate && <Loader />}
              >
                Update Profile
              </Button>
            </div>
          </form>
        </Form>

        {/*
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

             */}
      </div>
    </div>
  );
};

export default UpdateProfile;
