const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
    {
        name: "Laptop",
        description: "High-performance laptop with the latest specs",
        price: 999.99,
        image: "/images/laptop.png",
        category: "Electronics",
        countInStock: 15
    },
    {
        name: "Smartphone",
        description: "Latest model with advanced camera features",
        price: 699.99,
        image: "/images/phone.png",
        category: "Electronics",
        countInStock: 20
    },
    {
        name: "Headphones",
        description: "Noise-cancelling wireless headphones",
        price: 199.99,
        image: "/images/headphones.png",
        category: "Audio",
        countInStock: 30
    },
    {
        name: "Smartwatch",
        description: "Fitness tracker with heart rate monitor",
        price: 249.99,
        image: "/images/smartwatch.png",
        category: "Wearables",
        countInStock: 25
    },
    {
        name: "Tablet",
        description: "Lightweight tablet with long battery life",
        price: 399.99,
        image: "/images/tablet.png",
        category: "Electronics",
        countInStock: 18
    },
    {
        name: "Camera",
        description: "Digital camera with 4K video capability",
        price: 549.99,
        image: "/images/camera.png",
        category: "Photography",
        countInStock: 12
    },
    {
        name: "Gaming Console",
        description: "Next-gen gaming console for immersive gameplay",
        price: 499.99,
        image: "/images/console.png",
        category: "Gaming",
        countInStock: 10
    },
    {
        name: "Bluetooth Speaker",
        description: "Portable speaker with rich, clear sound",
        price: 79.99,
        image: "/images/speaker.png",
        category: "Audio",
        countInStock: 40
    },
    {
        name: "E-reader",
        description: "Lightweight e-reader with backlight",
        price: 129.99,
        image: "/images/ereader.png",
        category: "Electronics",
        countInStock: 22
    },
    {
        name: "Wireless Earbuds",
        description: "True wireless earbuds with charging case",
        price: 159.99,
        image: "/images/earbuds.png",
        category: "Audio",
        countInStock: 35
    },
    {
        name: "Classic Retro Radio",
        description: "This Classic Retro Radio by VintageSound brings you back to the golden age of radio with its nostalgic design and modern technology. It features AM/FM bands, a built-in speaker, and Bluetooth connectivity for streaming your favorite tunes.",
        price: 49.99,
        image: "/images/radio.png",
        category: "Audio",
        countInStock: 15
    }
];

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected for seeding...'))
    .catch(err => console.log(err));

const seedDB = async () => {
    try {
        await Product.deleteMany({});
        console.log('Deleted all products');

        await Product.insertMany(sampleProducts);
        console.log('Sample products inserted');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
        console.log('MongoDB disconnected');
    }
};

seedDB();