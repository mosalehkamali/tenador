'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    FaTimes,
    FaPlus,
    FaMinus,
    FaTrash,
    FaShoppingCart,
} from 'react-icons/fa';

export default function CartDrawer({ isOpen, onClose }) {
    const [items, setItems] = useState([]);

    // Load cart from localStorage
    useEffect(() => {
        if (!isOpen) return;

        const stored = localStorage.getItem('cart');
        setItems(stored ? JSON.parse(stored) : []);
    }, [isOpen]);

    // Sync with localStorage
    const updateCart = (newItems) => {
        setItems(newItems);
        localStorage.setItem('cart', JSON.stringify(newItems));
    };

    const increaseQty = (id) => {
        updateCart(
            items.map((i) =>
                i.productId === id ? { ...i, quantity: i.quantity + 1 } : i
            )
        );
    };

    const decreaseQty = (id) => {
        updateCart(
            items
                .map((i) =>
                    i.productId === id ? { ...i, quantity: i.quantity - 1 } : i
                )
                .filter((i) => i.quantity > 0)
        );
    };

    const removeItem = (id) => {
        updateCart(items.filter((i) => i.productId !== id));
    };

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce(
        (sum, i) => sum + i.product.basePrice * i.quantity,
        0
    );

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />

            {/* Drawer */}
            <aside className="fixed left-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <button onClick={onClose}>
                        <FaTimes className="text-xl text-[#aa4725]" />
                    </button>
                    <div className="flex items-center gap-2 font-bold text-[#aa4725]">
                        <FaShoppingCart />
                        سبد خرید
                    </div>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 && (
                        <p className="text-center text-gray-500">
                            سبد خرید خالی است
                        </p>
                    )}

                    {items.map((item) => (
                        <div
                            key={item.productId}
                            className="flex gap-3 border-b border-[var(--color-primary)] p-2"
                        >
                            <img
                                src={item.product.mainImage}
                                alt={item.product.name}
                                className="w-20 h-20 object-cover rounded"
                            />

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <p className="font-medium">{item.product.name}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => decreaseQty(item.productId)}
                                            className="p-1 bg-gray-300 rounded-r-[50%] cursor-pointer"
                                        >
                                            <FaMinus />
                                        </button>

                                        <span className='px-1 bold bg-gray-300 '>{item.quantity}</span>

                                        <button
                                            onClick={() => increaseQty(item.productId)}
                                            className="p-1 bg-gray-300 rounded-l-[50%] cursor-pointer"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>

                                    <p className="text-sm bold text-[var(--color-primary)]">
                                        {(item.product.basePrice * item.quantity).toLocaleString()} تومان
                                    </p>
                                    <button
                                        onClick={() => removeItem(item.productId)}
                                        className="text-red-500 cursor-pointer"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span>تعداد آیتم‌ها</span>
                        <span>{totalItems}</span>
                    </div>

                    <div className="flex justify-between font-bold">
                        <span>مجموع</span>
                        <span>{totalPrice.toLocaleString()} تومان</span>
                    </div>
                    <button
                        onClick={() => redirect("/p-user/signOrder")}
                        disabled={items.length === 0}
                        className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg cursor-pointer hover:opacity-80 disabled:opacity-50"
                    >
                        پرداخت
                    </button>
                </div>
            </aside>
        </>
    );
}
