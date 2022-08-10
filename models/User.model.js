const { Schema, model } = require("mongoose")

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "El nombre de usuario es obligatorio"]
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      trim: true,
      lowercase: true,
      unique: true
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    paymentDetails: {
      card: {
        type: Number,
        minlength: [16, "Número de tarjeta no válido"],
        maxlength: [16, "Número de tarjeta no válido"]
      }
    }
  },
  {
    timestamps: true,
  }
)

const User = model("User", userSchema)

module.exports = User