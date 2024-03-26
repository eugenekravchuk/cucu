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
import { OrganisationValidation } from "@/lib/validation";

const СreateEvent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof OrganisationValidation>>({
    resolver: zodResolver(OrganisationValidation),
    defaultValues: {
      photo: [],
      name: "",
      description: "",
    },
  });

  const handleCreateOrganisation = async () => {
    try {
      await createOrganisation("form");
    } catch (e) {
      console.log(e);
    }
  };

// type ValuePiece = Date | null;

// type Value = ValuePiece | [ValuePiece, ValuePiece];
// const [value, onChange] = useState<Value>(new Date());
const [selectedDate, setSelectedDate] = useState('');
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
              name="name"
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Дата і час
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
              name="cetegory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Категорія
                  </FormLabel>
                  {/* <label> */}
       
   {/* </label> */}
                  <FormControl>
                  <div>
                  <span className="shad-textarea custom-scrollbar field-bg"><select className="shad-input">
           <option className="shad-input" value="1">Спорт</option>
           <option className="shad-input" value="2">Театр</option>
           <option  className="shad-input"value="3">Поезія</option>
           <option  className="shad-input"value="3">Музика</option>
           {/* {...field} */}
       </select></span></div>
        {/* <Dropdown className="shad-textarea custom-scrollbar field-bg" label="Dropdown button" dismissOnClick={false}>
      <Dropdown.Item>Dashboard</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item>
      <Dropdown.Item>Earnings</Dropdown.Item>
      <Dropdown.Item>Sign out</Dropdown.Item>
    </Dropdown> */}
                    {/* <Input type="text" className="shad-input" {...field} /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
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
