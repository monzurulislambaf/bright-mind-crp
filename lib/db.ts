import mongoose from "mongoose";

declare global {
  var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

export async function connectToDatabase() {
  // Read via an alias so the value is not inlined into the build output.
  const env = process.env;
  const MONGODB_URI = env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env"
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
