import { Schema, model, Document } from "mongoose";

export interface Brand extends Document {
  name: string;
  image: string;
}

const BrandSchema = new Schema<Brand>(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<Brand>("Brand", BrandSchema);
