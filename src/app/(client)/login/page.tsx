import { LoginComponent } from "@/_components/public/login-component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Content Management System",
  description: "Secure login portal for authorized administrators to access the content management system.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Login() {
  return <LoginComponent />;
}
