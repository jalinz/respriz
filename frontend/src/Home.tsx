// src/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { addCost, getCosts, deleteCost } from './db';

interface Cost {
    id?: number;
    restaurant: string;
    price: number;
    date: string;
    location: string;
}

function Home() {
    const [costs, setCosts] = useState<Cost[]>([]);
    const [restaurant, setRestaurant] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const data = await getCosts();
            setCosts(data);
        }
        fetchData();
    }, []);

    const handleAddCost = async () => {
        if (restaurant && price !== '' && date !== '' && location !== '') {
            const priceValue = Number(price);
            if (priceValue <= 0) {
                alert('Please enter a positive number for the cost.');
                return;
            }

            const today = new Date();
            const enteredDate = new Date(date);
            if (enteredDate >= today) {
                alert('Please enter a date before today.');
                return;
            }

            const newCost: Cost = {
                restaurant,
                price: priceValue,
                date,
                location,
            };
            const id = await addCost(newCost);
            newCost.id = id; // Set the id of the new cost
            setCosts([...costs, newCost]);

            // Clear input fields
            setRestaurant('');
            setPrice('');
            setDate('');
            setLocation('');
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
                <div className="header-content">
                    <img src={logo} className="App-logo" alt="logo" />
                    <div className="header-titles">
                        <h1>Respriz</h1>
                        <h4>Restaurant Cost Sharing App</h4>
                    </div>
                </div>
               
                <div className="input-section">
                    <input
                        type="text"
                        placeholder="Restaurant"
                        value={restaurant}
                        onChange={(e) => setRestaurant(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Cost per person (NZD)"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                    <input
                        type="date"
                        placeholder="Date of Visit"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <button onClick={handleAddCost}>Add</button>
                </div>
                <div className="sort-search-section">
                    <button className="sort-button" onClick={handleSort}>
                        Sort by Price {sortBy === 'asc' ? '↑' : '↓'}
                    </button>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by restaurant name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="cost-list">
                    {filteredCosts.map((cost) => (
                        <div key={cost.id} className="cost-item">
                            <div className="cost">${cost.price}</div>
                            <div className="details">
                                <div className="name">{cost.restaurant}</div>
                                <div className="location">{cost.location}</div>
                                <div className="date">{cost.date}</div>
                            </div>
                            <div className="action-buttons">
                                <button className="edit-button" onClick={() => navigate(`/menu/${cost.id}/${cost.restaurant}`)}>Menu</button>
                                <button className="delete-button" onClick={() => handleDeleteCost(cost.id)}>Delete</button>
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

export default Home;
