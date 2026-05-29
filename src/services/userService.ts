import { AppDataSource } from "../config/dataSource";
import { User } from "../entities";
import { MESSAGES } from "../constants/messages";

const userRepo = AppDataSource.getRepository(User);

export const getAllUsers = async (): Promise<User[]> => {
  return await userRepo.find({ relations: [] });
};

export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  const user = await userRepo.findOne({ where: { id } });
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }
  Object.assign(user, data);
  return await userRepo.save(user);
};

export const deleteUser = async (id: number): Promise<User> => {
  const user = await userRepo.findOne({ where: { id } });
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }
  await userRepo.remove(user);
  return user;
};
