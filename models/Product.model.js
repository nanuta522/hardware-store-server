const { Schema, model } = require("mongoose")

const productSchema = new Schema(
    {
        name: {
            type: String
        },
        description: {
            type: String
        },
        price: {
            type: String
        },
        images: [{
            type: String,
            default: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
        }],
        category: {
            type: String,   
        }
    },
    {
        timestamps: true,
    }
)

const Product = model("Product", productSchema)
module.exports = Product