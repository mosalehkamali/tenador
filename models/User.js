import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // ------------------
    // Auth
    // ------------------
    provider: {
      type: String,
      enum: ["local", "google"],
      required: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    password: {
      type: String,
      required: function() { return this.provider === 'local'; },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
      required: function() { return this.provider === 'google'; },
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    phoneVerified: {
      type: Boolean,
      default: function() { return this.provider === 'google'; },
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
      enum: ["user", "coach", "admin", "seller", "national_player"],
      default: "user",
    },

    // ------------------
    // Level
    // ------------------
    level: {
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
    wishlist: [
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

// Addresses
UserSchema.virtual("addresses", {
  ref: "Address",
  localField: "_id",
  foreignField: "user",
});

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
