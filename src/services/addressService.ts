import { AppDataSource } from "../config/dataSource";
import { Address } from "../entities/Address";
import { User } from "../entities/User";
import { MESSAGES } from "../constants/messages";

const addressRepo = AppDataSource.getRepository(Address);
const userRepo = AppDataSource.getRepository(User);

export const createAddress = async (
  street: string,
  city: string,
  state: string,
  postalCode: string,
  country: string,
  userId: number
): Promise<Address> => {
  const user = await userRepo.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  const address = new Address();
  address.street = street.trim();
  address.city = city.trim();
  address.state = state.trim();
  address.postalCode = postalCode.trim();
  address.country = country.trim();
  address.user = user;

  return await addressRepo.save(address);
};
export const updateAddress = async (
  id: number,
  data: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }
): Promise<Address> => {
  const address = await addressRepo.findOne({
    where: { id },
    relations: ["user"],
  });

  if (!address) {
    throw new Error(MESSAGES.ADDRESS.NOT_FOUND);
  }

  if (data.street !== undefined) {
    address.street = data.street.trim();
  }

  if (data.city !== undefined) {
    address.city = data.city.trim();
  }

  if (data.state !== undefined) {
    address.state = data.state.trim();
  }

  if (data.postalCode !== undefined) {
    address.postalCode = data.postalCode.trim();
  }

  if (data.country !== undefined) {
    address.country = data.country.trim();
  }

  return await addressRepo.save(address);
};

export const deleteAddressById = async (id: number): Promise<Address> => {
  const address = await addressRepo.findOne({
    where: { id },
    relations: ["user"],
  });

  if (!address) {
    throw new Error(MESSAGES.ADDRESS.NOT_FOUND);
  }

  await addressRepo.remove(address);
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