// src/Menu.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';

interface MenuItem {
    id: number;
    name: string;
    price: number;
}

function Menu() {
    const { restaurantId, restaurantName } = useParams<{ restaurantId: string; restaurantName: string }>();
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState<number | ''>('');

    useEffect(() => {
        // Fetch the menu items from your database if you have any
    }, []);

    const handleAddMenuItem = () => {
        if (itemName && itemPrice !== '') {
            const newItem: MenuItem = {
                id: menuItems.length + 1,
                name: itemName,
                price: Number(itemPrice),
            };
            setMenuItems([...menuItems, newItem]);
            setItemName('');
            setItemPrice('');
        }
    };

    return (
        <div className="Menu">
            <header className="App-header">
                <button onClick={() => navigate('/')}>Back to Home</button>
                <h2>Menu for {restaurantName}</h2>
                <input
                    type="text"
                    placeholder="Item Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Item Price"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                />
                <button onClick={handleAddMenuItem}>Add Menu Item</button>
                <div className="menu-list">
                    {menuItems.map((item) => (
                        <div key={item.id} className="menu-item">
                            <span>{item.name}</span>: <span>${item.price}</span>
                        </div>
                    ))}
                </div>
            </header>
        </div>
    );
}

export default Menu;
