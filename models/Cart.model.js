const { Schema, model } = require('mongoose')

const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        items: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }]
    },
    {
        timestamps: true
    }
)

module.exports = model("Cart", cartSchema)