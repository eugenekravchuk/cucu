import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { FileUploader, Loader } from "@/components/shared";
import axios from "axios";
import { useState } from "react";
import { createAnonymousPost, createPost, updatePost } from "@/jwt_back/work";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "../ui/checkbox";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [captionValue, setCaptionValue] = useState(
    action === "Create" ? "" : post.text
  );

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
    },
  });
  const [jwtToken, setJwtToken] = useState(
    localStorage.getItem("jwtToken") || ""
  );

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    // ACTION = UPDATE
    if (post && action === "Update") {
      try {
        setIsLoading(true);
        const updatedPost = await updatePost(post.id, value.caption);

        if (updatedPost === "error") {
          return;
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
        return navigate(`/posts/${post.id}`);
      }
    }

    console.log(value.isAnonymous);

    // ACTION = CREATE

    const formData = new FormData();
    formData.append("data", JSON.stringify({ text: value.caption }));
    if (Array.isArray(value.file)) {
      value.file.forEach((file) => {
        formData.append("photo", file);
      });
    } else {
      formData.append("photo", value.file);
    }

    const formDataAnonymous = new FormData();
    formDataAnonymous.append("text", value.caption);
    if (Array.isArray(value.file)) {
      value.file.forEach((file) => {
        formDataAnonymous.append("photo", file);
      });
    } else {
      formDataAnonymous.append("photo", value.file);
    }

    try {
      setIsLoading(true);
      let outcome;
      if (value.isAnonymous) {
        outcome = await createAnonymousPost(formDataAnonymous);
      } else {
        outcome = await createPost(formData);
      }
      if (outcome === "error") {
        return;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }

    navigate("/home");
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center mb-[200px]">
        <Loader />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl mb-[100px]">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Заголовок</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar bg-light-2"
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                    setCaptionValue(event.target.value);
                  }}
                  value={captionValue}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {action === "Create" ? (
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Додати світлину</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={post?.photo}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
        ) : (
          <div className="bg-[#fff] py-10 px-10 rounded-xl">
            <img
              className="object-cover rounded-xl max-h-[500px] w-[100%] object-contain"
              src={post.photo}
              alt="post photo"
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="isAnonymous"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center ">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-[30px] w-[55px] pl-[5px]"
                  />
                  <p className="text-xl ml-[10px] text-[#4C4C4C]">
                    Створити анонімний пост
                  </p>
                </div>
              </FormControl>
            </FormItem>
          )}
          defaultValue={false}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4 text-white"
            onClick={() => navigate(-1)}>
            Скасувати
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap py-6">
            {/* {action} Опублікувати */}
            Опублікувати
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
