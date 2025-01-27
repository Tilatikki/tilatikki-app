import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import UserModel from "../models/User.js";
import { jwtSecret } from "./config.js";
import logger from "./logger.js";

function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  logger.info(`Method: ${req.method}`);
  logger.info(`Path: ${req.path}`);
  logger.info(`Body:  ${JSON.stringify(req.body)}`);
  logger.info("---");
  next();
}

function unknownEndpoint(_req: Request, res: Response): void {
  res.status(404).send({ error: "unknown endpoint" });
}

function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(`Error: ${error.message}, Name: ${error.name}`);

  if (error.name === "CastError") {
    res.status(400).send({ error: "malformatted ID" });
  } else if (error.name === "ValidationError") {
    res.status(401).send({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    res.status(500).send({ error: "invalid token" });
  } else {
    logger.error(error.stack);
    next(error);
  }
}

function getAuthToken(req: Request) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    return req.cookies.token;
  } else {
    return null;
  }
}

// Protect routes
const protect = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = getAuthToken(req);

    // If there's no token, return a 401 (Unauthorized) response
    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    try {
      // Verify the token and extract the user's ID
      const decoded = jwt.verify(token, jwtSecret) as { id: string };

      const user = await UserModel.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = user;
      logger.info(req.user);
      next();
    } catch (error) {
      logger.error(error);
      return res.status(401).json({ error: "Token verification failed" });
    }
  }
);

// Middleware function to authorize specific user roles for routes
export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new Error(
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }

    // Continue to the next middleware or route handler
    next();
  };
}

export { unknownEndpoint, errorHandler, requestLogger, protect };
