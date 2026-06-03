import { Request, Response } from "express";
import {createAddress,updateAddress} from "../services/addressService";
import {createAddressSchema,updateAddressSchema
} from "../validators/addressValidator";
import { MESSAGES } from "../constants/messages";

export const createAddressHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error, value } = createAddressSchema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { street, city, state, postalCode, country, userId } = value;

    const address = await createAddress(
      street,
      city,
      state,
      postalCode,
      country,
      userId
    );

    res.status(201).json({
      success: true,
      message: MESSAGES.ADDRESS.CREATE_SUCCESS,
      address,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.ADDRESS.CREATE_FAILED;

    const statusCode = message === MESSAGES.USER.NOT_FOUND ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const updateAddressHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const addressId = Number(req.params.id);

    if (!Number.isInteger(addressId) || addressId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.ADDRESS.ID_REQUIRED,
      });
      return;
    }

    const { error, value } = updateAddressSchema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const address = await updateAddress(addressId, value);

    res.status(200).json({
      success: true,
      message: MESSAGES.ADDRESS.UPDATE_SUCCESS,
      address,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.ADDRESS.UPDATE_FAILED;

    const statusCode = message === MESSAGES.ADDRESS.NOT_FOUND ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};