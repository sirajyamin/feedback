import mongoose from "mongoose";

type Connection = {
   isConnected?: number;
};

const MONGODB_URI = `${process.env.MONGODB_URI}`;

const connection: Connection = {};

if (!MONGODB_URI) {
   throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
   );
}

export async function dbConnect() {
   if (connection.isConnected) {
      return;
   }

   if (mongoose.connections.length > 0) {
      connection.isConnected = mongoose.connections[0].readyState;
      if (connection.isConnected === 1) {
         return;
      }

      await mongoose.disconnect();
   }

   const db = await mongoose.connect(MONGODB_URI);

   connection.isConnected = db.connections[0].readyState;
}
