import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/{...nextauth]/options";
import UserModel from "@/models/User";

export async function POST(req: Request) {
   dbConnect();
   const session = await getServerSession(authOptions);
   const user = session?.user;

   if (!session || !user) {
      return Response.json(
         {
            success: false,
            message: "Not authenticated",
         },
         { status: 401 }
      );
   }
   const userId = user._id;
   const { status } = await req.json();

   try {
      await UserModel.findByIdAndUpdate(
         userId,
         { isAccepting: status },
         { new: true }
      );
   } catch (error) {
      console.log("Error while updating status of messages", error);
      return Response.json(
         {
            success: false,
            message: "Error while updating status of messages",
         },
         { status: 401 }
      );
   }

   return Response.json(
      {
         success: true,
         message: "Accepting messages status chagned!",
      },
      { status: 200 }
   );
}

export async function GET() {
   dbConnect();
   const session = await getServerSession(authOptions);
   const user = session?.user;

   if (!session || !user) {
      return Response.json( 
         {
            success: false,
            message: "Not authenticated",
         },
         { status: 401 }
      );
   }
   const userId = user._id;
   try {
      const user = await UserModel.findById(userId);
      return Response.json(
         {
            success: true,
            isAccepting: user?.isAccepting,
         },
         { status: 200 }
      );
   } catch (error) {
      console.log("error while updating messages acceptance status!", error);
      return Response.json(
         {
            success: false,
            message: "error while updating messages acceptance status!",
         },
         { status: 404 }
      );
   }
}
