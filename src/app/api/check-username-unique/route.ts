import { z } from "zod";
import UserModel from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
   username: usernameValidation,
});

export async function GET(request: Request) {
   await dbConnect();

   try {
      const { searchParams } = new URL(request.url);
      const queryParam = {
         username: searchParams.get("username"),
      };
      const result = UsernameQuerySchema.safeParse(queryParam);
      if (!result.success) {
         const usernameErrors = result.error.format().username?._errors || [];
         return Response.json(
            {
               success: false,
               message: "Invalid Query parameters",
            },
            { status: 400 }
         );
      }
      const { username } = result.data;
      const verifiedUser = await UserModel.findOne({
         username,
         isVerified: true,
      });
      if (verifiedUser) {
         return Response.json(
            {
               success: false,
               message: "username is already taken",
            },
            { status: 400 }
         );
      }
      return Response.json(
         {
            success: false,
            message: "username is already taken",
         },
         { status: 200 }
      );
   } catch (error) {
      console.log("Error while checking username", error);
      Response.json(
         { success: false, message: "Error while checking username" },
         { status: 500 }
      );
   }
}
