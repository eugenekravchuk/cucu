import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/components/ui/use-toast";

import { SigninValidation } from "@/lib/validation";
import axios from "axios";
import { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { isAuthenticated, login, logout } from "@/jwt_back/work";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/home");
    }
  }, []);

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });


  const handleSignup = async (user: z.infer<typeof SigninValidation>) => {
    try {
      const userdata = {
        username: user.username,
        password: user.password,
      };

      const outcome = await login(userdata);

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

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Вхід до облікового запису
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Введіть необхідну інформацію:
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4">
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
            Вхід
          </Button>

          <p className="text-small-regular text-dark-2 text-center">
            Не маєш облікового запису?
            <Link to="/sign-up" className="font-bold ml-1 underline">
              Зареєструватися
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
