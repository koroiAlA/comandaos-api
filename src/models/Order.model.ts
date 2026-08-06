import { Schema, model, Document, Types } from 'mongoose';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';

interface IOrderItem {
  product: Types.ObjectId; // referencia por trazabilidad
  name: string;            // snapshot: nombre al momento del pedido
  price: number;           // snapshot: precio al momento del pedido
  quantity: number;
}

export interface IOrder extends Document {
  client: string;
  waiter: Types.ObjectId; // referencia al User que tomó el pedido
    waiterName: string; // 👈 snapshot, igual que en items
  items: IOrderItem[];
  status: OrderStatus;
  readyAt?: Date;
  deliveredAt?: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false } // no necesitamos un id extra por cada item
);

const orderSchema = new Schema<IOrder>(
  {
    client: { type: String, required: true },
   waiter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   waiterName: { type: String, required: true }, // 👈 nuevo campo
    items: { type: [orderItemSchema], required: true },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'delivered'],
      default: 'pending',
    },
    readyAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true } // createdAt nos sirve para "tiempo de preparación"
);

export default model<IOrder>('Order', orderSchema);