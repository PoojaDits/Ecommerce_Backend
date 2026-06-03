import { AppDataSource } from "../config/dataSource";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { User } from "../entities/User";
import Product from "../entities/Product";

const cartRepo = AppDataSource.getRepository(Cart);
const cartItemRepo = AppDataSource.getRepository(CartItem);
const userRepo = AppDataSource.getRepository(User);
const productRepo = AppDataSource.getRepository(Product);



export const findOrCreateCart = async (userId: number) => {
 
  let cart = await cartRepo.findOne({
    where: { user: { id: userId } },
    relations: ["items", "items.product"], 
  });
  if (!cart) {
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found.");
    }
    cart = new Cart();
    cart.user = user;
    cart.items = [];
    await cartRepo.save(cart);
  }
  return cart;
};

export const getCart = async (userId: number) => {
  const cart = await findOrCreateCart(userId);
  return cart;
};
export const addItemToCart = async (
  userId: number,
  productId: number,
  quantity: number
) => {

  const cart = await findOrCreateCart(userId);

  const product = await productRepo.findOne({ where: { id: productId } });
  if (!product) {
    throw new Error("Product not found.");
  }

  let existingItem = null;
  for (const item of cart.items) {
    if (item.product && item.product.id === productId) {
      existingItem = item;
    }
  }
  if (existingItem) {
    const newTotalQuantity = existingItem.quantity + quantity;
    if (newTotalQuantity > product.stock) {
      throw new Error("Not enough stock available.");
    }
    existingItem.quantity = newTotalQuantity;
    await cartItemRepo.save(existingItem);
  } else {
    if (quantity > product.stock) {
      throw new Error("Not enough stock available.");
    }

    const newItem = new CartItem();
    newItem.cart = cart;
    newItem.product = product;
    newItem.quantity = quantity;
    await cartItemRepo.save(newItem);
  }

 
  return await findOrCreateCart(userId);
};



export const updateCartItem = async (
  userId: number,
  itemId: number,
  quantity: number
) => {
  const cart = await findOrCreateCart(userId);
  const item = await cartItemRepo.findOne({
    where: { id: itemId, cart: { id: cart.id } },
    relations: ["product"],
  });

  if (!item) {
    throw new Error("Cart item not found.");
  }

  if (quantity > item.product.stock) {
    throw new Error("Not enough stock available.");
  }


  item.quantity = quantity;
  await cartItemRepo.save(item);

  return await findOrCreateCart(userId);
};



export const removeCartItem = async (userId: number, itemId: number) => {
  const cart = await findOrCreateCart(userId);


  const item = await cartItemRepo.findOne({
    where: { id: itemId, cart: { id: cart.id } },
  });

  if (!item) {
    throw new Error("Cart item not found.");
  }


  await cartItemRepo.remove(item);

  return await findOrCreateCart(userId);
};



export const clearCart = async (userId: number) => {
  const cart = await findOrCreateCart(userId);


  if (cart.items.length > 0) {
    await cartItemRepo.remove(cart.items);
  }

  return await findOrCreateCart(userId);
};
