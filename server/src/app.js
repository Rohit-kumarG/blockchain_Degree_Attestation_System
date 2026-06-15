import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { healthRouter } from "./routes/health.routes.js";
import { analyticsRouter } from "./routes/analytics.routes.js";
import { auditRouter } from "./routes/audit.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { degreeRouter } from "./routes/degree.routes.js";
import { degreeRequestRouter } from "./routes/degreeRequest.routes.js";
import { universityRouter } from "./routes/university.routes.js";
import { verificationRouter } from "./routes/verification.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/universities", universityRouter);
app.use("/api/degrees", degreeRouter);
app.use("/api/degree-requests", degreeRequestRouter);
app.use("/api/verification", verificationRouter);
app.use("/api/audit-logs", auditRouter);
app.use("/api/analytics", analyticsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
