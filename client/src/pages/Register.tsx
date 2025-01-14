import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button, buttonVariants } from "~/@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/@/components/ui/form";
import { Input } from "~/@/components/ui/input";
import { Link } from "react-router-dom";
import { cn } from "~/@/lib/utils";
import { useUserAction } from "~/hooks/useUser";

const formSchema = z.object({
  firstname: z.string().min(2, {
    message: "Firstname must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "Lastname must be at least 2 characters.",
  }),
  email: z
    .string()
    .regex(
      /^[a-zA-Z]+\.+[a-zA-Z]+@(edu\.)?hel\.fi$/,
      "Invalid email format first.last@hel.fi or @edu.hel.fi",
    )
    .min(2, {
      message: "email must be at least 2 characters.",
    })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });
  const { registerUser } = useUserAction();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    registerUser({
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className="container relative hidden h-full grow flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        to="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Kirjaudu Sisään
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-neutral-900" />
        <h1 className='z-20 font-["Archivo"] text-4xl font-black'>TilaTikki</h1>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">&ldquo;Varaa Opetustila Helposti.&rdquo;</p>
            <footer className="text-sm">Helsingin kaupunki</footer>
          </blockquote>
        </div>
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Luo uusi käyttäjä
            </h1>
            <p className="text-sm text-muted-foreground">
              Muista käyttää etunimi.sukunimi@hel.fi sähköpostia
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
              <div className="flex flex-col gap-2 md:flex-row">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etunimi</FormLabel>
                      <FormControl>
                        <Input placeholder="Arto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sukunimi</FormLabel>
                      <FormControl>
                        <Input placeholder="Aitta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sähköposti</FormLabel>
                    <FormControl>
                      <Input placeholder="etunimi.sukunimi@hel.fi" {...field} />
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
                    <FormLabel>Salasana</FormLabel>
                    <FormControl>
                      <Input placeholder="virittamo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button>Rekisteröidy</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
