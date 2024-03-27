import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  FormControl,
  FormDescription,
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
  createEvent,
  createOrganisation,
  decodeJWT,
  getProfile,
  uploadAvatar,
} from "@/jwt_back/work";
import { EventValidation } from "@/lib/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const СreateEvent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const categories = [
    { label: "Спорт", value: 1 },
    { label: "Театр", value: 2 },
    { label: "Поезія", value: 3 },
    { label: "Музика", value: 4 },
  ];

  const organisations = [{ label: "ОССА", value: 1 }];

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
    const eventForm = new FormData();
    eventForm.append("event_text", value.event_text);
    eventForm.append("event_date", value.event_date);
    eventForm.append("category_id", Number(value.category_id));
    eventForm.append("organization", Number(value.organization));
    eventForm.append("photo", value.photo);
    try {
      setIsLoading(true);
      await createEvent(eventForm);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      navigate("/home");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center mb-[200px]">
        <Loader />
      </div>
    );
  }

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
                <FormItem className="flex flex-col ">
                  <FormLabel>Категорія</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="field-bg w-[250px]">
                        <SelectValue placeholder="Вибери категорію" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem value={String(category.value)}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Організація</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="field-bg w-[250px]">
                        <SelectValue placeholder="Вибери організацію" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organisations.map((organisation) => (
                        <SelectItem value={String(organisation.value)}>
                          {organisation.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
