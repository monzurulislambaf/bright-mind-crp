import mongoose from "mongoose";

declare global {
  var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  if (global._mongooseConnection) {
    return global._mongooseConnection;
  }

  const connection = mongoose
    .connect(MONGODB_URI, {
      bufferCommands: false,
    })
    .catch((err) => {
      global._mongooseConnection = undefined;
      throw err;
    });

  global._mongooseConnection = connection;
  return connection;
}
