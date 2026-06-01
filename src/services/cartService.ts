import { AppDataSource } from "../config/dataSource";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { User } from "../entities/User";
import Product from "../entities/Product";
import { MESSAGES } from "../constants/messages";
import { ICart, IAddCartItem } from "../interfaces/ICart";

const cartRepo = AppDataSource.getRepository(Cart);
const cartItemRepo = AppDataSource.getRepository(CartItem);
const userRepo = AppDataSource.getRepository(User);
const productRepo = AppDataSource.getRepository(Product);

/**
 * Returns the user's cart, creating one if it does not exist yet.
 */
const getOrCreateCart = async (userId: number): Promise<Cart> => {
  let cart = await cartRepo.findOne({
    where: { user: { id: userId } },
    relations: ["items", "items.product"],
  });

  if (!cart) {
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(MESSAGES.USER.NOT_FOUND);
    }
    cart = new Cart();
    cart.user = user;
    cart.items = [];
    cart = await cartRepo.save(cart);
  }

  return cart;
};

/**
 * Maps a Cart entity into a normalized response with computed totals.
 */
const buildCartResponse = (cart: Cart): ICart => {
  const items = (cart.items || [])
    .filter((item) => item.product)
    .map((item) => {
      const price = Number(item.product.price);
      return {
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          price,
          stock: item.product.stock,
        },
        subtotal: Number((price * item.quantity).toFixed(2)),
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = Number(
    items.reduce((sum, item) => sum + (item.subtotal || 0), 0).toFixed(2)
  );

  return {
    id: cart.id,
    items,
    totalItems,
    totalAmount,
  };
};

const reloadCart = async (cartId: number): Promise<ICart> => {
  const cart = await cartRepo.findOne({
    where: { id: cartId },
    relations: ["items", "items.product"],
  });
  if (!cart) {
    throw new Error(MESSAGES.CART.GET_FAILED);
  }
  return buildCartResponse(cart);
};

export const getCart = async (userId: number): Promise<ICart> => {
  const cart = await getOrCreateCart(userId);
  return buildCartResponse(cart);
};

export const addItemToCart = async (
  userId: number,
  data: IAddCartItem
): Promise<ICart> => {
  const { productId, quantity } = data;

  const cart = await getOrCreateCart(userId);

  const product = await productRepo.findOne({ where: { id: productId } });
  if (!product) {
    throw new Error(MESSAGES.PRODUCT.NOT_FOUND);
  }
  if (!product.isActive) {
    throw new Error(MESSAGES.CART.PRODUCT_INACTIVE);
  }

  const existingItem = (cart.items || []).find(
    (item) => item.product && item.product.id === productId
  );

  const desiredQuantity = (existingItem?.quantity || 0) + quantity;
  if (desiredQuantity > product.stock) {
    throw new Error(MESSAGES.CART.INSUFFICIENT_STOCK);
  }

  if (existingItem) {
    existingItem.quantity = desiredQuantity;
    await cartItemRepo.save(existingItem);
  } else {
    const newItem = new CartItem();
    newItem.cart = cart;
    newItem.product = product;
    newItem.quantity = quantity;
    await cartItemRepo.save(newItem);
  }

  return reloadCart(cart.id);
};

export const updateCartItem = async (
  userId: number,
  itemId: number,
  quantity: number
): Promise<ICart> => {
  const cart = await getOrCreateCart(userId);

  const item = await cartItemRepo.findOne({
    where: { id: itemId, cart: { id: cart.id } },
    relations: ["product", "cart"],
  });
  if (!item) {
    throw new Error(MESSAGES.CART.ITEM_NOT_FOUND);
  }

  if (!item.product.isActive) {
    throw new Error(MESSAGES.CART.PRODUCT_INACTIVE);
  }
  if (quantity > item.product.stock) {
    throw new Error(MESSAGES.CART.INSUFFICIENT_STOCK);
  }

  item.quantity = quantity;
  await cartItemRepo.save(item);

  return reloadCart(cart.id);
};

export const removeCartItem = async (
  userId: number,
  itemId: number
): Promise<ICart> => {
  const cart = await getOrCreateCart(userId);

  const item = await cartItemRepo.findOne({
    where: { id: itemId, cart: { id: cart.id } },
  });
  if (!item) {
    throw new Error(MESSAGES.CART.ITEM_NOT_FOUND);
  }

  await cartItemRepo.remove(item);

  return reloadCart(cart.id);
};

export const clearCart = async (userId: number): Promise<ICart> => {
  const cart = await getOrCreateCart(userId);

  if (cart.items && cart.items.length > 0) {
    await cartItemRepo.remove(cart.items);
  }

  return reloadCart(cart.id);
};
