import "dotenv/config";
import { appName } from "@grainmate/shared";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { healthRouter } from "./routes/health";

const app = express();

app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 100,
  }),
);
app.use(express.json());
app.use(healthRouter);

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`${appName()} server listening on port ${port}`);
});
