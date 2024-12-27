import mongoose, { CallbackError, Types, ValidatorProps } from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface UserDocument {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: Address;
  role: string;
  isBanned: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMethods {
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

const userSchema = new mongoose.Schema<UserDocument & UserMethods>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (val: string) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(val);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    phone: {
      type: String,
      validate: {
        validator: function (val: string) {
          return /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/.test(val);
        },
        message: (props: ValidatorProps) =>
          `${props.value} is not a valid Bangladeshi phone number!`,
      },
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
    },
    role: {
      type: String,
      default: "user",
      required: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// password hashing
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error as CallbackError);
  }
});

// generate tokens
userSchema.methods.generateAccessToken = function (): string {
  return Jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "4h" }
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return Jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "10d" }
  );
};

const User = mongoose.model<UserDocument & UserMethods>("User", userSchema);

export default User;
