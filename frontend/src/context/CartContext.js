// src/context/CartContext.js

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Notification from '../components/Notification';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [notification, setNotification] = useState({ visible: false, message: '' });

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item._id === product._id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        showNotification(`${product.name} added to cart`);
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
        showNotification('Item removed from cart');
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
        showNotification('Cart updated');
    };

    const clearCart = () => {
        setCart([]);
        showNotification('Cart cleared');
    };

    const showNotification = (message) => {
        setNotification({ visible: true, message });
        setTimeout(() => {
            setNotification({ visible: false, message: '' });
        }, 3000);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
            <Notification
                message={notification.message}
                isVisible={notification.visible}
                onClose={() => setNotification({ visible: false, message: '' })}
            />
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}