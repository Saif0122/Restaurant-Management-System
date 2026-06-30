import { Types } from 'mongoose';
import Cart, { ICart } from '../models/Cart.model';
import Food from '../models/Food.model';
import { ApiError } from '../utils/ApiError';

export class CartService {
  /**
   * Get user's cart or create a new one if it doesn't exist
   */
  static async getCart(userId: string): Promise<ICart> {
    let cart = await Cart.findOne({ customer: userId }).populate(
      'items.food',
      'name image price availability',
    );
    if (!cart) {
      cart = await Cart.create({ customer: userId, items: [] });
    }
    return cart;
  }

  /**
   * Add an item to the cart
   */
  static async addItem(
    userId: string,
    data: { foodId: string; quantity: number; specialInstructions?: string },
  ): Promise<ICart> {
    const { foodId, quantity, specialInstructions } = data;

    const food = await Food.findById(foodId);
    if (!food) {
      throw new ApiError(404, 'Food item not found');
    }
    if (!food.availability) {
      throw new ApiError(400, 'Food item is currently unavailable');
    }

    let cart = await Cart.findOne({ customer: userId });
    if (!cart) {
      cart = new Cart({ customer: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.food.toString() === foodId);
    const existingQuantity = itemIndex > -1 ? cart.items[itemIndex].quantity : 0;
    const targetQuantity = existingQuantity + quantity;

    if (food.stock < targetQuantity) {
      throw new ApiError(400, `Not enough stock. Only ${food.stock} item(s) available.`);
    }

    if (itemIndex > -1) {
      // Item already exists, update quantity and instructions
      cart.items[itemIndex].quantity += quantity;
      if (specialInstructions) {
        cart.items[itemIndex].specialInstructions = specialInstructions;
      }
      cart.items[itemIndex].price = food.price; // Update price in case it changed
    } else {
      // Add new item
      cart.items.push({
        food: new Types.ObjectId(foodId),
        quantity,
        price: food.price,
        specialInstructions,
      });
    }

    await cart.save();
    return cart.populate('items.food', 'name image price availability');
  }

  /**
   * Update cart item quantity
   */
  static async updateItemQuantity(
    userId: string,
    foodId: string,
    quantity: number,
  ): Promise<ICart> {
    const cart = await Cart.findOne({ customer: userId });
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) => item.food.toString() === foodId);
    if (itemIndex === -1) {
      throw new ApiError(404, 'Item not found in cart');
    }

    const food = await Food.findById(foodId);
    if (!food) {
      throw new ApiError(404, 'Food item not found');
    }
    if (!food.availability) {
      throw new ApiError(400, 'Food item is currently unavailable');
    }
    if (food.stock < quantity) {
      throw new ApiError(400, `Not enough stock. Only ${food.stock} item(s) available.`);
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = food.price;

    await cart.save();
    return cart.populate('items.food', 'name image price availability');
  }

  /**
   * Remove an item from the cart
   */
  static async removeItem(userId: string, foodId: string): Promise<ICart> {
    const cart = await Cart.findOne({ customer: userId });
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    cart.items = cart.items.filter((item) => item.food.toString() !== foodId);

    await cart.save();
    return cart.populate('items.food', 'name image price availability');
  }

  /**
   * Clear all items from the cart
   */
  static async clearCart(userId: string): Promise<ICart> {
    const cart = await Cart.findOne({ customer: userId });
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    cart.items = [];
    await cart.save();
    return cart;
  }
}
