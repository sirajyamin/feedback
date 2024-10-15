import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/{...nextauth]/options";
import UserModel from "@/models/User";
import mongoose from "mongoose";

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
   const userId = new mongoose.Types.ObjectId(user._id);
   try {
      const user = await UserModel.aggregate([
         {
            $match: {
               id: userId,//this may give error
            },
         },
         { $unwind: "$messages" },
         { $sort: { "messages.createdAt": -1 } },
         {
            $group: {
               _id: "$_id",
               messages: { $push: "$messages" },
            },
         },
      ]);
      if (!user) {
         return Response.json(
            {
               success: false, 
               message: "No messages found",
            },
            { status: 401 }
         );
      }
      return Response.json(
         {
            success: true,
            messages: user[0].messages,
         },
         { status: 200 }
      );
   } catch (error) {
      console.log("error while getting messages !", error);
      return Response.json(
         {
            success: false,
            message: "error while getting messages!",
         },
         { status: 404 }
      ); 
   }
}
