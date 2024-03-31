import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, Button } from "@/components/ui";
import { Loader } from "@/components/shared";
import { FileUploader } from "@/components/shared";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useEffect, useState } from "react";
import { createEvent, getSidebarData } from "@/jwt_back/work";
import { EventValidation } from "@/lib/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const СreateEvent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [datacategories, setCategories] = useState([]);
  const [dataorganisations, setOrganisations] = useState([]);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 as months are zero-indexed
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}/${month}/${day}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const datacategories = await getSidebarData();
        setCategories(datacategories.categories);
        setOrganisations(datacategories.organizations);
      } catch (error) {
        console.error("Error fetching post data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
    console.log(value.event_date);
    const eventForm = new FormData();
    eventForm.append("event_text", value.event_text);
    eventForm.append("event_date", formatDate(value.event_date));
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
      <div className="common-container mb-[100px]">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl ">
          <img
            src="/assets/icons/people.svg"
            width={36}
            height={36}
            alt="edit"
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
              name="event_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Опис Івенту</FormLabel>
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
                <FormItem className="flex flex-col">
                  <FormLabel>Виберіть дату:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal field-bg",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Виберіть дату</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < yesterday || date > new Date("2025-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                      {datacategories.map((category) => (
                        <SelectItem value={String(category.id)}>
                          {category.category_name}
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
                  <p className="shad-form_label text-xs">
                    Ви повинні бути творцем організації, щоб створити подію
                  </p>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="field-bg w-[250px]">
                        <SelectValue placeholder="Вибери організацію" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dataorganisations.map((organisation) => (
                        <SelectItem value={String(organisation.id)}>
                          {organisation.organization_name}
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
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Додати світлину
                  </FormLabel>
                  <FormControl>
                    <FileUploader fieldChange={field.onChange} mediaUrl={""} />
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
                Відмінити
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap py-6">
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
