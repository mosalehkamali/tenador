import mongoose from "mongoose";

const InstallmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    totalAmount: Number,
    numberOfChecks: Number,

    checks: [
      {
        amount: Number,
        dueDate: Date,
        status: {
          type: String,
          enum: ["PENDING", "CLEARED", "BOUNCED"],
          default: "PENDING",
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Installment ||
  mongoose.model("Installment", InstallmentSchema);
