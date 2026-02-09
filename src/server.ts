import express from "express";
import type { Application, Request, Response } from "express";
import session from "express-session";
import connectDB from "./config/mongo";
import db from "./database/models";
import passport from "./middleware/passport";
import morganMiddleware from "./middleware/morganLogger";
import { captureResponse } from "./middleware/responseCapture";
import router from "./route/index.route";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json"
import { mongoConnect, sqlConnect } from "./config/db.connect";
import { env } from "./config/env.config";

const app: Application = express();
const PORT = Number(env.DB.PORT);

const startserver = async () => {
  connectDB();
  const _db = db;
  void _db;
  await sqlConnect();
  await mongoConnect();
  app.listen(PORT, () => {
    console.log(`Server is  running on http://localhost:${PORT}`);
  });
}

startserver();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use(captureResponse);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  session({
    secret: String(env.DB.SESSION_SECRET),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running");
});

app.use("/", router)
