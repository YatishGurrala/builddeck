import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  tagline: z
    .string()
    .min(10, "Tagline must be at least 10 characters")
    .max(200, "Tagline must be less than 200 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must be less than 2000 characters"),
  website_url: z.string().url("Please enter a valid URL"),
  category_id: z.string().min(1, "Please select a category"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
