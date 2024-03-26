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

import { UpdateProfileValidation } from "@/lib/validation";
import { useContext, useEffect, useState } from "react";
import {
  decodeJWT,
  getProfile,
  updateProfile,
  uploadAvatar,
} from "@/jwt_back/work";
import { ImageContext } from "@/context/ImageContext";

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const { image, setImage } = useContext(ImageContext);

  const form = useForm<z.infer<typeof UpdateProfileValidation>>({
    resolver: zodResolver(UpdateProfileValidation),
    defaultValues: {}, // Updated - will fill this dynamically
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const username = decodeJWT().sub;
        const data = await getProfile(username);
        form.reset({
          file: data.data.avatar,
          first_name: data.data.first_name,
          last_name: data.data.last_name,
          username: data.data.username,
          email: data.data.email,
          bio: data.data.bio,
        });
        setUserData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setBio(userData.bio);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Handler
  const handleUpdate = async (
    value: z.infer<typeof UpdateProfileValidation>
  ) => {
    setIsLoading(true);
    const avatarForm = new FormData();
    avatarForm.append("ava", value.file);
    const profileData = {
      first_name: value.first_name,
      last_name: value.last_name,
      bio: value.bio,
    };

    try {
      const avaRequest = await uploadAvatar(avatarForm);
      const profileRequest = await updateProfile(profileData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      navigate(`/profile/${userData.username}`);
      setImage(value.file);
    }
  };

  return (
    <div className="flex flex-1">
      <div className="common-container ">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl ">
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
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl  mb-[60px]">
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

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">First name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Last name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                      }}
                    />
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
                      className="shad-textarea custom-scrollbar field-bg"
                      onChange={(event) => {
                        field.onChange(event);
                      }}
                      {...field}
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
      </div>
    </div>
  );
};

export default UpdateProfile;
