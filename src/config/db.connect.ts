import mongoose from "mongoose";
import { sequelize } from "./sql";
import { config } from "dotenv";
// import connectDB from "./mongo";
// import db from "../database/models";
// import { Application } from "express";
// import express  from "express";
config();

// const app: Application = express();
// const PORT = Number(env.SERVER.PORT);
export const sqlConnect = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error: unknown) {
        console.error('Unable to connect to the database:', error);
    }
};

export const mongoConnect = async (): Promise<void> => {
    const MONGO_URI: string = process.env.MONGO_URI as string;
    try {
        const connect = await mongoose.connect(MONGO_URI);

        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);

    }

}
// export const startserver = async () => {
//   connectDB();
//   const _db = db;
//   void _db;
//   await sqlConnect();
//   await mongoConnect();
//   app.listen(PORT, () => {
//     console.log(`Server is  running on http://localhost:${PORT}`);
//   });
// }