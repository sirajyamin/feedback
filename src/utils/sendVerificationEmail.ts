import VerificationEmailTemplate from "@/components/email-template";
import { ApiResponse } from "@/types/ApiResponse";
import { Resend } from "resend";

export const sendVerificationEmail = async (
   username: string,
   email: string,
   otp: string
): Promise<ApiResponse> => {
   const resend = new Resend(process.env.RESEND_API_KEY);
   try {
      await resend.emails.send({
         from: "onboarding@resend.dev",
         to: email,
         subject: "Hello World",
         react: VerificationEmailTemplate({ username, otp }),
      });
      console.log("Email", email);
      return {
         success: true,
         message: "Verification email sent successfully!",
      };
   } catch (error) {
      console.log("Error while sending email");
      return { success: false, message: "Failed to send email!" };
   }
};
