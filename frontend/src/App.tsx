import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { addCost, getCosts, deleteCost } from './db';

interface Cost {
    id?: number;
    restaurant: string;
    price: number;
    date: string;
}

function App() {
    const [costs, setCosts] = useState<Cost[]>([]);
    const [restaurant, setRestaurant] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [date, setDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        async function fetchData() {
            const data = await getCosts();
            setCosts(data);
        }
        fetchData();
    }, []);

    const handleAddCost = async () => {
        if (restaurant && price !== '' && date !== '') {
            const newCost: Cost = {
                restaurant,
                price: Number(price),
                date,
            };
            await addCost(newCost);
            setCosts([...costs, newCost]);

            // Clear input fields
            setRestaurant('');
            setPrice('');
            setDate('');
        } else {
            alert('Please fill in all fields.');
        }
    };

    const handleDeleteCost = async (id: number | undefined) => {
        if (id !== undefined) {
            await deleteCost(id);
            setCosts(costs.filter(cost => cost.id !== id));
        }
    };

    const handleSort = () => {
        const sortedCosts = [...costs].sort((a, b) => {
            if (sortBy === 'asc') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
        setCosts(sortedCosts);
        setSortBy(sortBy === 'asc' ? 'desc' : 'asc');
    };

    const filteredCosts = costs.filter(cost =>
        cost.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="App">
            <header className="App-header">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by restaurant name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Restaurant Cost Sharing App</h2>
                <input
                    type="text"
                    placeholder="Restaurant"
                    value={restaurant}
                    onChange={(e) => setRestaurant(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Cost (NZD)"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <input
                    type="date"
                    placeholder="Date of Visit"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button onClick={handleAddCost}>Add</button>
                <button onClick={handleSort}>Sort by Price {sortBy === 'asc' ? '↑' : '↓'}</button>
                <div className="cost-list">
                    {filteredCosts.map((cost) => (
                        <div key={cost.id} className="cost-item">
                            <div>
                                <span>{cost.restaurant}</span>: <span>${cost.price}</span>
                            </div>
                            <div className="date">{cost.date}</div>
                            <div className="action-buttons">
                                <button onClick={() => handleDeleteCost(cost.id)} className="delete-button">
                                    X
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="app-info">
                    <p>This app allows you to share and manage costs for restaurants you've visited.</p>
                    <p>Developed with React and TypeScript.</p>
                </div>
            </header>
        </div>
    );
}

export default App;
