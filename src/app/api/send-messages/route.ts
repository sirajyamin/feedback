import { dbConnect } from "@/lib/dbConnect";
import UserModel, { User } from "@/models/User";

export async function POST(req: Request) {
   await dbConnect();

   const { username, content } = await req.json();

   try {
      const user: any = await UserModel.findOne({ username });

      if (!user) {
         return Response.json(
            {
               success: false,
               message: "user not found",
            },
            { status: 404 }
         );
      }
      if (!user?.isAccepting) {
         return Response.json(
            {
               success: false,
               message: "user is not accepting messages",
            },
            { status: 403 }
         );
      }
      const message = { content, createdAt: new Date() };
      await user.messages.push(message);
      await user.save();
   } catch (error) {
      console.log("Error while sending messages:", error);
      return Response.json(
         {
            success: false,
            message: "Error while sending messages:",
         },
         { status: 500 }
      );
   }
}
