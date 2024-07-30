const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User is required'],
        ref: 'User',
    },
    orderItems: [
        {
            name: { type: String, required: [true, 'Product name is required'] },
            quantity: { type: Number, required: [true, 'Quantity is required'] },
            image: { type: String, required: [true, 'Image URL is required'] },
            price: { type: Number, required: [true, 'Price is required'] },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, 'Product ID is required'],
                ref: 'Product',
            },
        },
    ],
    shippingAddress: {
        address: { type: String, required: [true, 'Address is required'] },
        city: { type: String, required: [true, 'City is required'] },
        postalCode: { type: String, required: [true, 'Postal code is required'] },
        country: { type: String, required: [true, 'Country is required'] },
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        default: 0.0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', OrderSchema);