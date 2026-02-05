  import express from "express";
  import type { Application, Request, Response } from "express";
  import session from "express-session";
  import connectDB from "./config/mongo";
  import db from "./models";
  import passport from "./middleware/passport";
  import morganMiddleware from "./middleware/morganLogger";
  import { captureResponse } from "./middleware/responseCapture";
  import router from "./modules/index";
  import swaggerUi from  "swagger-ui-express";
  import swaggerDocument from "./swagger-output.json"
  const app: Application = express();
  const PORT = Number(process.env.PORT);

  connectDB();
  const _db = db;
  void _db;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morganMiddleware);
  app.use(captureResponse);


  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(
    session({
      secret: String(process.env.SESSION_SECRET),
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/", (_req: Request, res: Response) => {
    res.send("Server is running");
  });

  app.use("/",router)

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
