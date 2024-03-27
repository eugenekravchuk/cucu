import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { SignupValidation } from "@/lib/validation";
import { useEffect, useState } from "react";
import { isAuthenticated, register } from "@/jwt_back/work";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/home");
    }
  }, []);

  // Queries
  // const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } =
  //   useCreateUserAccount();
  // const { mutateAsync: signInAccount, isLoading: isSigningInUser } =
  //   useSignInAccount();

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const userdata = {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
      };

      const outcome = await register(userdata);

      if (outcome === "error") {
        return;
      }

      form.reset();
      navigate("/home");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.png" alt="logo" width={200} />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-8">
          Створити новий акаунт
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Введіть свої дані:
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Ім'я:</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
                <FormLabel className="shad-form_label">Прізвище:</FormLabel>
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
                <FormLabel className="shad-form_label">
                  Ім'я користувача
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Пошта</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Пароль</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            Реєстрація
          </Button>

          <p className="text-small-regular text-dark-2 text-center mt-2">
            Вже маєте акаунт?
            <Link to="/sign-in" className="font-bold ml-1 underline">
              Увійти
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
