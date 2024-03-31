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
import { Textarea, Input, Button, toast } from "@/components/ui";
import { ProfileUploader, Loader } from "@/components/shared";

import { useState } from "react";
import { createOrganisation } from "@/jwt_back/work";
import { OrganisationValidation } from "@/lib/validation";

const СreateOrganisation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof OrganisationValidation>>({
    resolver: zodResolver(OrganisationValidation),
    defaultValues: {
      photo: [],
      organization_name: "",
      organization_bio: "",
    },
  });

  const handleCreateOrganisation = async (
    value: z.infer<typeof OrganisationValidation>
  ) => {
    const organisationForm = new FormData();
    organisationForm.append("organization_name", value.organization_name);
    organisationForm.append("organization_bio", value.organization_bio);
    organisationForm.append("photo", value.photo);
    console.log(value);
    try {
      setIsLoading(true);
      const outcome = await createOrganisation(organisationForm);

      if (outcome === "error") {
        return;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      toast({
        title:
          "Запит відправлено! \n Очікуйте підтвердження організації адміном",
      });
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
            Створити організацію
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateOrganisation)}
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
              name="organization_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Ім'я організації
                  </FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organization_bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Опис</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar field-bg"
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

export default СreateOrganisation;
