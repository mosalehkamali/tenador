import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // ------------------
    // Auth
    // ------------------
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      code: String,
      expiresAt: Date,
    },

    // ------------------
    // Profile
    // ------------------
    name: { type: String },
    avatar: { type: String },

    // ------------------
    // Roles
    // ------------------
    role: {
      type: String,
      enum: ["user", "coach", "admin"],
      default: "user",
    },

    // ------------------
    // VIP / Level
    // ------------------
    vipLevel: {
      type: Number,
      default: 0, // 0=normal, 1=silver, 2=gold, 3=platinum
    },

    vipExpiresAt: {
      type: Date,
      default: null,
    },

    // ------------------
    // Coach System
    // ------------------
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ------------------
    // Favorites
    // ------------------
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

// Orders
UserSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "user",
});

// Comments
UserSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "user",
});

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);