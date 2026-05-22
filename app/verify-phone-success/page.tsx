import { redirect } from "next/navigation";

export default function VerifyPhoneSuccessPage() {
  redirect("/dashboard/verify-email");
}
