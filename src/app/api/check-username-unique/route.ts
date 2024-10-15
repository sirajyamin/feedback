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

      // Validate query parameters
      const result = UsernameQuerySchema.safeParse(queryParam);
      if (!result.success) {
         const usernameErrors = result.error.format().username?._errors || [];
         return new Response(
            JSON.stringify({
               success: false,
               message: "Invalid Query parameters",
               errors: usernameErrors,
            }),
            { status: 400 }
         );
      }

      const { username } = result.data;

      // Check if user exists and is verified
      const verifiedUser = await UserModel.findOne({
         username,
         isVerified: true,
      });

      if (verifiedUser) {
         return new Response(
            JSON.stringify({
               success: false,
               message: "Username is already taken",
            }),
            { status: 400 }
         );
      }

      // Username is available
      return new Response(
         JSON.stringify({
            success: true,
            message: "Username is available",
         }),
         { status: 200 }
      );
   } catch (error) {
      console.error("Error while checking username", error);
      return new Response(
         JSON.stringify({
            success: false,
            message: "Error while checking username",
         }),
         { status: 500 }
      );
   }
}
