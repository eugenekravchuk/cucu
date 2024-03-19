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
import { createPost } from "@/jwt_back/work";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
    },
  });
  const [jwtToken, setJwtToken] = useState(
    localStorage.getItem("jwtToken") || ""
  );

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    // ACTION = UPDATE
    // if (post && action === "Update") {
    //   const updatedPost = await updatePost({
    //     ...value,
    //     postId: post.$id,
    //     imageId: post.imageId,
    //     imageUrl: post.imageUrl,
    //   });

    //   if (!updatedPost) {
    //     toast({
    //       title: `${action} post failed. Please try again.`,
    //     });
    //   }
    //   return navigate(`/posts/${post.$id}`);
    // }

    // ACTION = CREATE

    const postdata = {
      data: {
        text: "some text",
      },
      photo: value.file,
    };

    console.log(value.file);

    const formData = new FormData();
    formData.append("data", JSON.stringify({ text: "some text" }));
    if (Array.isArray(value.file)) {
      // Check if it's an array
      value.file.forEach((file) => {
        formData.append("photo", file); // Append each file individually
      });
    } else {
      formData.append("photo", value.file); // Single file case
    }

    const outcome = await createPost(formData);

    if (outcome === "error") {
      return;
    }

    navigate("/home");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar bg-light-2"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                  
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4 text-white"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap py-6">
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
