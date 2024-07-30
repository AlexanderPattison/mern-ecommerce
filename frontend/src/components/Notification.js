import React from 'react';

const Notification = ({ message, isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center">
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 text-white focus:outline-none">
                &times;
            </button>
        </div>
    );
};

export default Notification;