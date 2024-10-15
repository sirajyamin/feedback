import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
   await dbConnect();

   try {
      const { username, code } = await request.json();

      const decodedUsername = decodeURIComponent(username); //at this route the username is coming on the uri so decodeURIComponent is decoding it.
      const user = await UserModel.findOne({ username: decodedUsername });

      if (!user) {
         return Response.json(
            {
               succes: false,
               message: "user not found",
            },
            { status: 400 }
         );
      }
      const isCodeValid = user.verifyCode === code;
      const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

      if (isCodeValid && isCodeNotExpired) {
         user.isVerified = true;
         user.save();
      }
      return Response.json({
         succes: true,
         message: "user verified successfully!",
      });
   } catch (error) {
      return Response.json(
         {
            succes: false,
            message: "error while verifying user",
         },
         { status: 400 }
      );
   }
}
