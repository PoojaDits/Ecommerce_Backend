import { AppDataSource } from "../config/dataSource";
import { Address } from "../entities/Address";
import { User } from "../entities/User";
import { AddressType } from "../enums";
import { MESSAGES } from "../constants/messages";

const addressRepo = AppDataSource.getRepository(Address);
const userRepo = AppDataSource.getRepository(User);

/**
 * Ensures only ONE address per user has isDefault = true.
 * Clears the flag on every other address of that user.
 */
const clearOtherDefaults = async (
  userId: number,
  excludeId?: number
): Promise<void> => {
  const qb = addressRepo
    .createQueryBuilder()
    .update(Address)
    .set({ isDefault: false })
    .where("user_id = :userId", { userId })
    .andWhere("isDefault = :isDefault", { isDefault: true });

  if (excludeId !== undefined) {
    qb.andWhere("id != :excludeId", { excludeId });
  }
  await qb.execute();
};

export const createAddress = async (
  street: string,
  city: string,
  state: string,
  postalCode: string,
  country: string,
  userId: number,
  type: AddressType = AddressType.HOME,
  isDefault: boolean = false
): Promise<Address> => {
  const user = await userRepo.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  // If this is the user's FIRST address, force it to be default.
  const existingCount = await addressRepo.count({
    where: { user: { id: userId } },
  });
  const shouldBeDefault = existingCount === 0 ? true : isDefault;

  const address = new Address();
  address.street = street.trim();
  address.city = city.trim();
  address.state = state.trim();
  address.postalCode = postalCode.trim();
  address.country = country.trim();
  address.type = type;
  address.isDefault = shouldBeDefault;
  address.user = user;

  const saved = await addressRepo.save(address);

  // If this new one is default, demote any previous default of the same user.
  if (shouldBeDefault) {
    await clearOtherDefaults(userId, saved.id);
  }

  return saved;
};

export const updateAddress = async (
  id: number,
  data: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    type?: AddressType;
    isDefault?: boolean;
  }
): Promise<Address> => {
  const address = await addressRepo.findOne({
    where: { id },
    relations: ["user"],
  });

  if (!address) {
    throw new Error(MESSAGES.ADDRESS.NOT_FOUND);
  }

  if (data.street !== undefined) address.street = data.street.trim();
  if (data.city !== undefined) address.city = data.city.trim();
  if (data.state !== undefined) address.state = data.state.trim();
  if (data.postalCode !== undefined) address.postalCode = data.postalCode.trim();
  if (data.country !== undefined) address.country = data.country.trim();
  if (data.type !== undefined) address.type = data.type;

  if (data.isDefault !== undefined) {
    if (data.isDefault === false && address.isDefault === true) {

    } else {
      address.isDefault = data.isDefault;
    }
  }

  const saved = await addressRepo.save(address);

  if (saved.isDefault && address.user) {
    await clearOtherDefaults(address.user.id, saved.id);
  }

  return saved;
};


export const setDefaultAddress = async (id: number): Promise<Address> => {
  const address = await addressRepo.findOne({
    where: { id },
    relations: ["user"],
  });
  if (!address) {
    throw new Error(MESSAGES.ADDRESS.NOT_FOUND);
  }

  address.isDefault = true;
  const saved = await addressRepo.save(address);

  if (address.user) {
    await clearOtherDefaults(address.user.id, saved.id);
  }
  return saved;
};

export const deleteAddressById = async (id: number): Promise<Address> => {
  const address = await addressRepo.findOne({
    where: { id },
    relations: ["user"],
  });
  if (!address) {
    throw new Error(MESSAGES.ADDRESS.NOT_FOUND);
  }

  const wasDefault = address.isDefault;
  const userId = address.user?.id;

  await addressRepo.remove(address);
  
  if (wasDefault && userId !== undefined) {
    const next = await addressRepo.findOne({
      where: { user: { id: userId } },
      order: { id: "ASC" },
    });
    if (next) {
      next.isDefault = true;
      await addressRepo.save(next);
    }
  }

  return address;
};

export const getAllAddresses = async (): Promise<Address[]> => {
  return await addressRepo.find({ relations: ["user"] });
};

export const getAddressById = async (id: number): Promise<Address> => {
  const address = await addressRepo.findOne({
    where: { id },
    relations: ["user"],
  });
  if (!address) {
    throw new Error(MESSAGES.ADDRESS.NOT_FOUND);
  }
  return address;
};

export const getDefaultAddressForUser = async (
  userId: number
): Promise<Address | null> => {
  return await addressRepo.findOne({
    where: { user: { id: userId }, isDefault: true },
  });
};