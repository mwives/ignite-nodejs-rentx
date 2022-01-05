import { NextFunction, Request, Response } from "express";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "@shared/errors/AppError";

async function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  const { id: userId } = req.user;

  const usersRepository = new UsersRepository();

  const user = await usersRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (!user.is_admin) {
    throw new AppError("Permission denied.", 401);
  }

  return next();
}

export { ensureAdmin };
