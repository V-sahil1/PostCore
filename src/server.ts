import express from "express"
import type { Application, Request, Response } from "express";
import session from "express-session";
import connectDB from "./config/mongo";
import db from "./database/models";
import passport from "./middleware/passport";
// import morganMiddleware from "./middleware/morganLogger";
// import { captureResponse } from "./middleware/responseCapture";
import router from "./route/index.route";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json"
import { mongoConnect, sqlConnect } from "./config/db.connect";
import { env } from "./config/env.config";
import { errorHandler } from "./middleware/error-log";
import morganMiddleware from "./middleware/morganLogger";
import { captureResponse } from "./middleware/responseCapture";
import "./config/redis";
import { redisRateLimiter } from "./middleware/ratelimiter";
import './workers/email.worker';
import { emailQueue } from "./config/queue";
import { serverAdapter } from "./config/bullboard";

const app: Application = express();

const PORT = Number(env.SERVER.PORT);

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
app.use(captureResponse)
app.use(morganMiddleware)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// console.log(errorHandler)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/admin/queues', serverAdapter.getRouter());

app.use(
  session({
    secret: String(env.SESSION.SESSION_SECRET),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", router)
app.get('/test-queue', async (req, res) => {
  try {
    const job = await emailQueue.add('test-email', {
      to: 'test@example.com',
      subject: 'Hello!',
      body: 'BullMQ is working!'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const waiting = await emailQueue.getWaitingCount();
    const active = await emailQueue.getActiveCount();
    const completed = await emailQueue.getCompletedCount();
    const failed = await emailQueue.getFailedCount();

    res.json({
      success: true,
      jobId: job.id,
      stats: { waiting, active, completed, failed }
    });

  } catch (err:any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.use(errorHandler);

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running");
});
