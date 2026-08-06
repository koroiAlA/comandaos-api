import { Schema, model, Document } from 'mongoose';

export type ProductType = 'breakfast' | 'all_day';

export interface IProduct extends Document {
  name: string;
  price: number;
  type: ProductType;
  image?: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    type: {
      type: String,
      enum: ['breakfast', 'all_day'],
      required: true,
    },
    image: { type: String },
  },
  { timestamps: true }
);

export default model<IProduct>('Product', productSchema);