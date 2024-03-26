import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Dropdown } from "flowbite-react";

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

import { useContext, useEffect, useState } from "react";
import {
  createOrganisation,
  decodeJWT,
  getProfile,
  uploadAvatar,
} from "@/jwt_back/work";
import { ImageContext } from "@/context/ImageContext";
import { EventValidation, OrganisationValidation } from "@/lib/validation";

const СreateEvent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  const form = useForm<z.infer<typeof EventValidation>>({
    resolver: zodResolver(EventValidation),
    defaultValues: {
      event_text: "",
      event_date: "",
      category_id: 0,
      organization: 0,
      photo: [],
    },
  });

  const handleCreateEvent = async (value: z.infer<typeof EventValidation>) => {
    try {
      await createOrganisation("form");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-1">
      <div className="common-container mb-[50px]">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl ">
          <img
            src="/assets/icons/people.svg"
            width={36}
            height={36}
            alt="edit"
            // className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Створити подію
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateEvent)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl mb-[60px]">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={"/assets/icons/profile-placeholder.svg"}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Опис Івенту</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Дата і час</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Категорія</FormLabel>
                  <FormControl>
                    <div>
                      <span className="shad-textarea custom-scrollbar field-bg">
                        <select className="shad-input">
                          <option className="shad-input" value="1">
                            Спорт
                          </option>
                          <option className="shad-input" value="2">
                            Театр
                          </option>
                          <option className="shad-input" value="3">
                            Поезія
                          </option>
                          <option className="shad-input" value="3">
                            Музика
                          </option>
                          {/* {...field} */}
                        </select>
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}>
                Відмінити
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap py-6"
                // disabled={isLoadingUpdate}>
                // {isLoadingUpdate && <Loader />}
              >
                Створити
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default СreateEvent;
