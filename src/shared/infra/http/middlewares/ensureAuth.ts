import { NextFunction, Request, Response } from "express";
import { JwtPayload, Secret, verify } from "jsonwebtoken";

import auth from "@config/auth";
import { AppError } from "@shared/errors/AppError";

async function ensureAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token missing.", 401);
    }

    const [, token] = authHeader.split(" ");

    const { sub: userId } = verify(
      token,
      auth.tokenSecret as Secret
    ) as JwtPayload;

    if (!userId) {
      throw new AppError("Invalid token.", 401);
    }

    req.user = {
      id: userId,
    };

    next();
  } catch {
    throw new AppError("Invalid token.", 401);
  }
}

export { ensureAuth };
