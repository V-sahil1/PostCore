import mongoose from "mongoose";
import { sequelize } from "./sql";
import { config } from "dotenv";
config();

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
