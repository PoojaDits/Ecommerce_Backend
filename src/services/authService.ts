import { AppDataSource } from "../config/dataSource";
import { User } from "../entities/User";
import { UserRole, OtpPurpose } from "../enums";
import { createAndSendOtp, verifyOtp, consumeOtp } from "./otpService";
import bcrypt from "bcrypt";
import { MESSAGES } from "../constants/messages";
import { IAuthResponse, IAuthUser } from "../interfaces/authInterface";
import jwt from "jsonwebtoken";
import logger from "../config/logger";

const userRepo = AppDataSource.getRepository(User);

export const initiateRegistration = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role:UserRole
): Promise<IAuthResponse> => {

const checkUser = await userRepo.findOne({
  where: { email }
});

if (checkUser?.isActive) {
   logger.warn(`Registration blocked because email already exists: ${email}`);
    throw new Error(MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED);
}

if (checkUser && !checkUser.isActive) {
  logger.info(`Deleting old inactive user before new registration: ${email}`);
    await userRepo.delete({ email });
}

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = userRepo.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role:role|| UserRole.CUSTOMER,
    isActive: false,
  });
  await userRepo.save(user);

  logger.info(`User created successfully: ${email}`);
   try {
    await createAndSendOtp(email, OtpPurpose.REGISTRATION);
    logger.info(`Registration OTP sent for ${email}`);
  } catch (error: unknown) {
    await userRepo.delete({ id: user.id });
    logger.error(`Registration failed while sending OTP for ${email}`);
    throw error;
  }
  
  const authUser: IAuthUser = {
    id:user.id,
    firstName:user.firstName,
    lastName:user.lastName,
    email:user.email,
    role:user.role,
    isActive:user.isActive,
    createdAt:user.createdAt,
  };

  return { message: MESSAGES.AUTH.OTP_SENT, user: authUser };
};

export const completeRegistration = async (
  email: string,
  otp: string        
): Promise<IAuthResponse> => {

  await verifyOtp(email, OtpPurpose.REGISTRATION, otp);

  const user = await userRepo.findOne({
    where: { email, isActive: false }
  });
  if (!user) {
    logger.warn(`Registration session not found for ${email}`);
    throw new Error(MESSAGES.AUTH.REGISTRATION_SESSION_NOT_FOUND);
  }

  user.isActive = true;
  await userRepo.save(user);
  logger.info(`User activated successfully: ${email}`);

  try {
    await consumeOtp(email, OtpPurpose.REGISTRATION, otp); 
  } catch (error: unknown) {
    user.isActive = false;
    await userRepo.save(user);
    logger.error(`Failed to consume OTP for ${email}`);
    throw error;
  }

  const authUser: IAuthUser = {
    id:user.id,
    firstName:user.firstName,
    lastName:user.lastName,
    email:user.email,
    role:user.role,
    isActive:user.isActive,
    createdAt:user.createdAt,
  };

  return { message: MESSAGES.AUTH.REGISTRATION_SUCCESS, user: authUser };
};

export const resendRegistrationOtp = async (
  email: string
): Promise<IAuthResponse> => {

  const user = await userRepo.findOne({
    where: { email, isActive: false }
  });
  if (!user) {
    logger.warn(`No pending registration found for ${email}`);
    throw new Error(MESSAGES.AUTH.NO_PENDING_REGISTRATION);
  }

  await createAndSendOtp(email, OtpPurpose.REGISTRATION);
  logger.info(`OTP resent for ${email}`);
  return { message: MESSAGES.AUTH.OTP_RESENT };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<IAuthResponse> => {

  const user = await userRepo.findOne({
    where: { email }
  });

  if (!user) {
    logger.warn(`Login failed for ${email}: user not found`);
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  if (!user.isActive) {
    logger.warn(`Login failed for ${email}: account not verified`);
    throw new Error(MESSAGES.AUTH.ACCOUNT_NOT_VERIFIED);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    logger.warn(`Login failed for ${email}: invalid password`);
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },

    process.env.JWT_SECRET!,

    {
      expiresIn: "7d",
    }
  );
  logger.info(`JWT token generated for ${email}`);

  const authUser: IAuthUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };

  return {
    message: MESSAGES.AUTH.LOGIN_SUCCESS,
    user: authUser,
    token,
  };
};