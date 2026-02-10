import express from "express";
import type { Application, Request, Response } from "express";
import session from "express-session";
import passport from "./middleware/passport";
import morganMiddleware from "./middleware/morganLogger";
import { captureResponse } from "./middleware/responseCapture";
import router from "./route/index.route";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json"
import {  startserver } from "./config/db.connect";
import { env } from "./config/env.config";

const app: Application = express();

startserver();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use(captureResponse);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  session({
    secret: String(env.SESSION.SESSION_SECRET),
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
