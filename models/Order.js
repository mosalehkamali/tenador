import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    trackingCode: {
      type: String,
      unique: true,
      index: true,
    },

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
      enum: ["UNPAID", "PARTIALLY_PAID", "PAID"],
      default: "PENDING",
    },

    reviewedAt: {
      type: Date,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fulfillmentStatus: {
      type: String,
      enum: ["WAITING", "PROCESSING", "SENT", "DELIVERED", "CANCELED"],
      default: "WAITING",
    },

    address: {
      ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        default: null,
      },
      snapshot: {
        fullName: String,
        phone: String,
        province: String,
        city: String,
        postalCode: String,
        fullAddress: String,
      },
    },

    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],

    orderDate: {
      type: Date,
      default: Date.now,
    },

    description: String,
  },
  { timestamps: true }
);

// تعداد آیتم‌ها
OrderSchema.virtual("itemsCount").get(function () {
  return this.items.reduce((sum, i) => sum + i.quantity, 0);
});

OrderSchema.set("toJSON", { virtuals: true });
OrderSchema.set("toObject", { virtuals: true });

// تولید کد رهگیری
function generateTrackingCode(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const datePart = `${yyyy}${mm}${dd}`;

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letterPart =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  const numberPart = String(Math.floor(Math.random() * 1000)).padStart(3, "0");

  return `${datePart}${letterPart}${numberPart}`;
}

OrderSchema.pre("save", function () {
  if (!this.trackingCode) {
    this.trackingCode = generateTrackingCode(this.orderDate);
  }
});


export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
