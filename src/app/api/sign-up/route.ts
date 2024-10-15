import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
   await dbConnect();
   try {
      const { username, email, password } = await request.json();
      const byUsername = await UserModel.findOne({
         username,
         isVerified: true,
      });
      if (byUsername) {
         return Response.json(
            { success: false, message: "username is already taken" },
            { status: 500 }
         );
      }
      const byEmail = await UserModel.findOne({
         email,
      });
      if (byEmail) {
         if (byEmail.isVerified) {
            return Response.json(
               { success: false, message: "try another email" },
               { status: 500 }
            );
         } else {
            const hashedPassword = (
               await bcryptjs.hash(password, 10)
            ).toString();
            byEmail.password = hashedPassword;
         }
      } else {
         const hashedPassword = (await bcryptjs.hash(password, 10)).toString();
         const verifyCode = Math.floor(
            100000 + Math.random() * 900000
         ).toString();

         const verifyCodeExpiry = new Date();
         verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);
         const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry,
            isVerified: false,
            messages: [],
            isAccepting: true,
         });
         const user = await newUser.save();
         const emailRes = await sendVerificationEmail(
            username,
            email,
            verifyCode
         );
         if (!emailRes.success) {
            return Response.json(
               {
                  success: false,
                  message: emailRes.message,
               },
               { status: 500 }
            );
         }
      }
      return Response.json(
         {
            success: true,
            message: "User Created Successfully!!",
         },
         { status: 200 }
      );
   } catch (error: any) {
      console.log("Error while registering user", { error: error.message });
      return Response.json(
         {
            success: false,
            message: "Error while registering user",
         },
         { status: 400 }
      );
   }
}
