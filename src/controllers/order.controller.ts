import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import type { FilterQuery } from 'mongoose';
import Order, { IOrder } from '../models/Order.model';
import Product from '../models/Product.model';

// Crear un pedido (mesero)
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { client, items } = req.body;
    // items esperado: [{ productId: "...", quantity: 2 }, ...]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'El pedido debe tener al menos un producto' });
    }

    // Construimos el snapshot buscando cada producto real en la BD
    const orderItems = await Promise.all(
      items.map(async (item: { productId: string; quantity: number }) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Producto no encontrado: ${item.productId}`);
        }
        return {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );

    const newOrder = await Order.create({
      client,
      waiter: req.user!.id,
      waiterName: req.user!.name,
      items: orderItems,
      status: 'pending',
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

// Ver todos los pedidos (para admin, o filtrado por estado)
export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const filter: FilterQuery<IOrder> = status ? { status: status as IOrder['status'] } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Cambiar el estado de un pedido (cocina)
export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'preparing' | 'ready' | 'delivered'

    const validStatuses = ['pending', 'preparing', 'ready', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const updateData: any = { status };
    if (status === 'ready') updateData.readyAt = new Date();
    if (status === 'delivered') updateData.deliveredAt = new Date();

    const updated = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};