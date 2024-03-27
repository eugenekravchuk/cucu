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
import { createPost, updatePost } from "@/jwt_back/work";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "../ui/checkbox";

type PostFormProps = {
  post?: Models.Document;
  action: "Create";
};

const CommentForm = ({ post, action }: PostFormProps) => {
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

    try {
      setIsLoading(true);
      const outcome = await createPost(formData);
      if (outcome === "error") {
        return;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }

    navigate("/posts/:id");
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
              <FormLabel className="shad-form_label">Comment</FormLabel>
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

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4 text-white"
            onClick={() => navigate(-1)}>
            Delete
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap py-6">
            {action} Коментувати
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
