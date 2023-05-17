import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import userRoutes from "./routes/user.route";
config();

const PORT = process.env.PORT || 5000;

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

server.use("/api", userRoutes);

// server.use(notFound);
// server.use(errorHandler);
server.listen(PORT, async () => {
  console.log(`Server is running on Port:- ${PORT}`);
});
