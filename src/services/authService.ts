import { AppDataSource } from "../config/dataSource";
import { User } from "../entities/User";
import { UserRole, OtpPurpose } from "../enums";
import { createAndSendOtp, verifyOtp, consumeOtp } from "./otpSerice";
import bcrypt from "bcrypt";
import { MESSAGES } from "../constants/messages";
import { IAuthResponse, IAuthUser } from "../interfaces/authInterface";

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
  throw new Error(MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED);
}

if (checkUser && !checkUser.isActive) {
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

  try {
    await createAndSendOtp(email, OtpPurpose.REGISTRATION);
  } catch (error) {
    await userRepo.delete({ id: user.id });
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
    throw new Error(MESSAGES.AUTH.REGISTRATION_SESSION_NOT_FOUND);
  }

  user.isActive = true;
  await userRepo.save(user);

  try {
    await consumeOtp(email, OtpPurpose.REGISTRATION, otp); 
  } catch (error) {
    user.isActive = false;
    await userRepo.save(user);
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
    throw new Error(MESSAGES.AUTH.NO_PENDING_REGISTRATION);
  }

  await createAndSendOtp(email, OtpPurpose.REGISTRATION);
  return { message: MESSAGES.AUTH.OTP_RESENT };
};