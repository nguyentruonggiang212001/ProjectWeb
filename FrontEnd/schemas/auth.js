import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(6, { message: "Tên người dùng phải có ít nhất 6 ký tự" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phone: z
      .string()
      .trim()
      .min(10, { message: "Số điện thoại phải có ít nhất 10 chữ số" })
      .max(11, { message: "Số điện thoại không được vượt quá 11 chữ số" })
      .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ chứa chữ số" }),
    password: z
      .string()
      .trim()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(255, { message: "Mật khẩu không được vượt quá 255 ký tự" }),
    confirmPass: z
      .string()
      .trim()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(255, { message: "Mật khẩu không được vượt quá 255 ký tự" }),
  })
  .refine((data) => data.password === data.confirmPass, {
    message: "Mật khẩu không khớp",
    path: ["confirmPass"],
  });

export const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }).trim(),
  password: z
    .string()
    .trim()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
    .max(255, { message: "Mật khẩu không được vượt quá 255 ký tự" }),
});
