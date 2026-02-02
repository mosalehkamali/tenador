import mongoose from "mongoose";

const CheckSchema = new mongoose.Schema(
  {
    checkNumber: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    paidAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["PENDING", "CLEARED", "BOUNCED"],
      default: "PENDING",
    },

    receiptImageUrl: {
      type: String,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },

    bounceReason: {
      type: String,
    },
  },
  { _id: true }
);

const InstallmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    downPayment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    numberOfChecks: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "COMPLETED", "DEFAULTED"],
      default: "ACTIVE",
    },

    checks: [CheckSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Installment ||
  mongoose.model("Installment", InstallmentSchema);
