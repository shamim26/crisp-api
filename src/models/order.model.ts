import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variant_sku: {
    type: String, // Storing the SKU is often more useful than the variant's _id
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  // The one piece of data we MUST save.
  priceAtPurchase: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],

    // A single status to manage the entire order flow
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Refunded",
      ],
      default: "Pending",
      index: true,
    },

    totals: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, required: true, default: 0 },
      discount: { type: Number, required: true, default: 0 },
      grandTotal: { type: Number, required: true },
    },

    shippingAddress: {
      type: String,
      required: [true, "Shipping address is required."],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required for delivery."],
      index: true,
    },

    // Simplified payment details
    paymentMethod: {
      type: String,
      required: true, // e.g., 'COD', 'Stripe', 'Bkash'
    },
    transactionId: {
      type: String,
      index: true, // For searching by bKash TrxID, etc.
    },

    // Simple way to track shipping
    trackingNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
