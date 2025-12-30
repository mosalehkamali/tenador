import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["ONLINE", "BANK_RECEIPT", "INSTALLMENT"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "PAID", "REJECTED"],
      default: "PENDING",
    },

    fulfillmentStatus: {
      type: String,
      enum: ["WAITING", "PROCESSING", "SENT", "DELIVERED", "CANCELED"],
      default: "WAITING",
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    description: String,
  },
  { timestamps: true }
);

OrderSchema.virtual("itemsCount").get(function () {
  return this.items.reduce((sum, i) => sum + i.quantity, 0);
});

OrderSchema.set("toJSON", { virtuals: true });
OrderSchema.set("toObject", { virtuals: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
