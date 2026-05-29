import { AppDataSource } from "../config/dataSource";
import { Store } from "../entities/Store";
import { User } from "../entities/User";
import { MESSAGES } from "../constants/messages";
import { ILike } from "typeorm";

const storeRepo = AppDataSource.getRepository(Store);
const userRepo = AppDataSource.getRepository(User);


export const createStore = async (
  storeName: string,
  storeLocation: string,
  storeEmail: string,
  userId: number,
  storeDescription?: string,
  storeContact?: string
): Promise<Store> => {
  const normalizedName = storeName.trim();


  const user = await userRepo.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  
  const existingStore = await storeRepo.findOne({
    where: { storeName: ILike(normalizedName), user: { id: userId } },
    relations: ["user"],
  });

  if (existingStore) {
    throw new Error(MESSAGES.STORE.ALREADY_EXISTS);
  }

  
  const existingEmail = await storeRepo.findOne({
    where: { storeEmail: storeEmail.trim().toLowerCase() },
  });

  if (existingEmail) {
    throw new Error(MESSAGES.STORE.EMAIL_ALREADY_EXISTS);
  }

  const store = new Store();
  store.storeName = normalizedName;
  store.storeDescription = storeDescription?.trim() ?? "";
  store.storeLocation = storeLocation.trim();
  store.storeContact = storeContact?.trim() ?? "";
  store.storeEmail = storeEmail.trim().toLowerCase();
  store.user = user;

  return await storeRepo.save(store);
};


export const updateStore = async (
  id: number,
  data: {
    storeName?: string;
    storeDescription?: string;
    storeLocation?: string;
    storeContact?: string;
    storeEmail?: string;
  }
): Promise<Store> => {
  const store = await storeRepo.findOne({
    where: { id },
    relations: ["user"],
  });

  if (!store) {
    throw new Error(MESSAGES.STORE.NOT_FOUND);
  }

  if (data.storeName !== undefined) {
    const normalizedName = data.storeName.trim();
    const userId = store.user?.id;

    const existing = await storeRepo.findOne({
      where: { storeName: ILike(normalizedName), user: { id: userId } },
      relations: ["user"],
    });

    if (existing && existing.id !== id) {
      throw new Error(MESSAGES.STORE.ALREADY_EXISTS);
    }

    store.storeName = normalizedName;
  }

  if (data.storeDescription !== undefined) {
    store.storeDescription = data.storeDescription.trim();
  }

  if (data.storeLocation !== undefined) {
    store.storeLocation = data.storeLocation.trim();
  }

  if (data.storeContact !== undefined) {
    store.storeContact = data.storeContact.trim();
  }

  if (data.storeEmail !== undefined) {
    const normalizedEmail = data.storeEmail.trim().toLowerCase();

    const existingEmail = await storeRepo.findOne({
      where: { storeEmail: normalizedEmail },
    });

    if (existingEmail && existingEmail.id !== id) {
      throw new Error(MESSAGES.STORE.EMAIL_ALREADY_EXISTS);
    }

    store.storeEmail = normalizedEmail;
  }

  return await storeRepo.save(store);
};


export const deleteStoreById = async (id: number): Promise<Store> => {
  const store = await storeRepo.findOne({
    where: { id },
    relations: ["user"],
  });

  if (!store) {
    throw new Error(MESSAGES.STORE.NOT_FOUND);
  }

  await storeRepo.remove(store);
  return store;
};



export const getAllStores = async (): Promise<Store[]> => {
  return await storeRepo.find({ relations: ["user"] });
};

export const getStoreById = async (id: number): Promise<Store> => {
  const store = await storeRepo.findOne({
    where: { id },
    relations: ["user", "products"],
  });

  if (!store) {
    throw new Error(MESSAGES.STORE.NOT_FOUND);
  }

  return store;
};

export const getStoresByUser = async (userId: number): Promise<Store[]> => {
  const user = await userRepo.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  return await storeRepo.find({
    where: { user: { id: userId } },
    relations: ["user"],
  });
};
