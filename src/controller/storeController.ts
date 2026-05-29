import { Request, Response } from "express";
import {
  createStore,
  updateStore,
  deleteStoreById,
  getAllStores,
  getStoreById,
  getStoresByUser,
} from "../services/storeService";
import { createStoreSchema, updateStoreSchema } from "../validators/storeValidator";
import { MESSAGES } from "../constants/messages";



export const createStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error, value } = createStoreSchema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const {
      storeName,
      storeDescription,
      storeLocation,
      storeContact,
      storeEmail,
      userId,
    } = value;

    const store = await createStore(
      storeName,
      storeLocation,
      storeEmail,
      userId,
      storeDescription,
      storeContact
    );

    res.status(201).json({
      success: true,
      message: MESSAGES.STORE.CREATE_SUCCESS,
      store,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.STORE.CREATE_FAILED;

    res.status(400).json({
      success: false,
      message,
    });
  }
};



export const updateStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = Number(req.params.id);

    if (!Number.isInteger(storeId) || storeId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.STORE.ID_REQUIRED,
      });
      return;
    }

    const { error, value } = updateStoreSchema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const store = await updateStore(storeId, value);

    res.status(200).json({
      success: true,
      message: MESSAGES.STORE.UPDATE_SUCCESS,
      store,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.STORE.UPDATE_FAILED;

    const statusCode = message === MESSAGES.STORE.NOT_FOUND ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};



export const deleteStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = Number(req.params.id);

    if (!Number.isInteger(storeId) || storeId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.STORE.ID_REQUIRED,
      });
      return;
    }

    const store = await deleteStoreById(storeId);

    res.status(200).json({
      success: true,
      message: MESSAGES.STORE.DELETE_SUCCESS,
      store,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.STORE.DELETE_FAILED;

    const statusCode = message === MESSAGES.STORE.NOT_FOUND ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};



export const getAllStoresHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const stores = await getAllStores();

    res.status(200).json({
      success: true,
      message: MESSAGES.STORE.GET_SUCCESS,
      stores,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.STORE.GET_FAILED;

    res.status(500).json({
      success: false,
      message,
    });
  }
};



export const getStoreByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = Number(req.params.id);

    if (!Number.isInteger(storeId) || storeId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.STORE.ID_REQUIRED,
      });
      return;
    }

    const store = await getStoreById(storeId);

    res.status(200).json({
      success: true,
      message: MESSAGES.STORE.GET_SUCCESS,
      store,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.STORE.GET_FAILED;

    const statusCode = message === MESSAGES.STORE.NOT_FOUND ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};



export const getStoresByUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.USER.ID_REQUIRED,
      });
      return;
    }

    const stores = await getStoresByUser(userId);

    res.status(200).json({
      success: true,
      message: MESSAGES.STORE.GET_SUCCESS,
      stores,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.STORE.GET_FAILED;

    const statusCode = message === MESSAGES.USER.NOT_FOUND ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};
