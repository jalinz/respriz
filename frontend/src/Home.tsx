import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, Button, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from './logo.svg';
import './App.css';
import { addCost, getCosts, deleteCost, updateCost } from './db';

interface Cost {
    id?: number;
    restaurant: string;
    price: number;
    date: string;
    location: string;
}

const theme = createTheme({
    palette: {
        text: {
            primary: '#fff', // Set text color to white
        }
    },
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#fff', // Set label color to white
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: '#fff', // Set input text color to white
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff', // Set border color to white
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff', // Set hover border color to white
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff', // Set focused border color to white
                    },
                }
            }
        }
    }
});

function Home() {
    const [costs, setCosts] = useState<Cost[]>([]);
    const [restaurant, setRestaurant] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');
    const [editCostId, setEditCostId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const data = await getCosts();
            setCosts(data);
        }
        fetchData();
    }, []);

    const handleAddCost = async () => {
        if (restaurant && price > 0 && date !== '' && location !== '') {
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
            const confirmed = window.confirm('Are you sure you want to delete this item?');
            if (confirmed) {
                await deleteCost(id);
                setCosts(costs.filter(cost => cost.id !== id));
            }
        }
    };

    const handleEditCost = (cost: Cost) => {
        setEditCostId(cost.id ?? null);
        setRestaurant(cost.restaurant);
        setPrice(cost.price);
        setDate(cost.date);
        setLocation(cost.location);
    };

    const handleUpdateCost = async () => {
        if (editCostId !== null && restaurant && price > 0 && date !== '' && location !== '') {
            const updatedCost: Cost = {
                id: editCostId,
                restaurant,
                price: Number(price),
                date,
                location,
            };
            await updateCost(updatedCost);
            setCosts(costs.map(cost => (cost.id === editCostId ? updatedCost : cost)));

            // Clear input fields and reset edit mode
            setEditCostId(null);
            setRestaurant('');
            setPrice('');
            setDate('');
            setLocation('');
        } else {
            alert('Please fill in all fields.');
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

    // Handle price input change
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value > 0) {
            setPrice(value);
        } else {
            setPrice('');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container className="App">
                <header className="App-header">
                    <Box className="header-content" display="flex" alignItems="center" mb={2}>
                        <img src={logo} className="App-logo" alt="logo" onClick={() => window.location.reload()} />
                        <Box className="header-titles" ml={2}>
                            <Typography variant="h1" onClick={() => window.location.reload()}>Respriz</Typography>
                        </Box>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Restaurant"
                                value={restaurant}
                                onChange={(e) => setRestaurant(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Cost per person (NZD)"
                                value={price}
                                onChange={handlePriceChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date of Visit"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{ shrink: true }} // Ensure label does not overlap
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            {editCostId !== null ? (
                                <Button variant="contained" color="primary" onClick={handleUpdateCost}>Update</Button>
                            ) : (
                                <Button variant="contained" color="primary" onClick={handleAddCost}>Add</Button>
                            )}
                        </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                        <Button onClick={handleSort}>Sort by Price {sortBy === 'asc' ? '↑' : '↓'}</Button>
                        <TextField
                            label="Search by restaurant name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Box>
                    <Box className="cost-list">
                        {filteredCosts.map((cost) => (
                            <Box key={cost.id} className="cost-item">
                                <Typography className="cost">${cost.price}</Typography>
                                <Box className="details">
                                    <Typography className="name">{cost.restaurant}</Typography>
                                    <Typography className="location">{cost.location}</Typography>
                                    <Typography className="date">{cost.date}</Typography>
                                </Box>
                                <Box className="action-buttons" display="flex" flexDirection="column">
                                    <Button variant="outlined" className="menu-button" onClick={() => navigate(`/menu/${cost.id}/${cost.restaurant}`)}>Menu</Button>
                                    <Button variant="outlined" className="edit-button" onClick={() => handleEditCost(cost)}>Edit</Button>
                                    <Button variant="outlined" className="delete-button" onClick={() => handleDeleteCost(cost.id)}>Delete</Button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <Box className="app-info" my={2}>
                        <Typography>This app allows you to share and manage costs for restaurants you've visited.</Typography>
                        <Typography>Developed with React and TypeScript.</Typography>
                    </Box>
                </header>
            </Container>
        </ThemeProvider>
    );
}

export default Home;
