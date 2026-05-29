import { Request, Response } from "express";
import { getAllUsers, updateUser, deleteUser } from "../services/userService";
import { updateUserSchema } from "../validators/userValidator";
import { MESSAGES } from "../constants/messages";

export const getUsersHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ success: true, message: MESSAGES.USER.GET_SUCCESS, users });
  } catch (error: unknown) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({ success: false, message: MESSAGES.USER.ID_REQUIRED });
      return;
    }
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED });
      return;
    }
    const updated = await updateUser(userId, value);
    res.status(200).json({ success: true, message: MESSAGES.USER.UPDATE_SUCCESS, user: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : MESSAGES.USER.UPDATE_FAILED;
    res.status(400).json({ success: false, message: msg });
  }
};

export const deleteUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({ success: false, message: MESSAGES.USER.ID_REQUIRED });
      return;
    }
    const deleted = await deleteUser(userId);
    res.status(200).json({ success: true, message: MESSAGES.USER.DELETE_SUCCESS, user: deleted });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : MESSAGES.USER.DELETE_FAILED;
    res.status(400).json({ success: false, message: msg });
  }
};
