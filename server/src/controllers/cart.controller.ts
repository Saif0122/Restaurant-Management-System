import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { CartService } from '../services/cart.service';

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const cart = await CartService.getCart(userId);

  res.status(200).json(new ApiResponse(200, 'Cart retrieved successfully', cart));
});

export const addItemToCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { foodId, quantity, specialInstructions } = req.body;

  const cart = await CartService.addItem(userId, { foodId, quantity, specialInstructions });

  res.status(200).json(new ApiResponse(200, 'Item added to cart successfully', cart));
});

export const updateItemQuantity = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { foodId } = req.params;
  const { quantity } = req.body;

  const cart = await CartService.updateItemQuantity(userId, foodId, quantity);

  res.status(200).json(new ApiResponse(200, 'Cart item updated successfully', cart));
});

export const removeItemFromCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { foodId } = req.params;

  const cart = await CartService.removeItem(userId, foodId);

  res.status(200).json(new ApiResponse(200, 'Item removed from cart successfully', cart));
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();

  const cart = await CartService.clearCart(userId);

  res.status(200).json(new ApiResponse(200, 'Cart cleared successfully', cart));
});
