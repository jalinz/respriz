import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../Components/logo.svg';
import { addCost, getCosts, deleteCost, updateCost } from '../Services/db';
import { analyzeTrends } from '../Services/openaiService'; // Import the analyzeTrends function

// Setup WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

interface Cost {
    id?: string;
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
    const [isEditing, setIsEditing] = useState(false);
    const [currentCostId, setCurrentCostId] = useState<string | null>(null);
    const [lowestCost, setLowestCost] = useState<Cost | null>(null);
    const [trendAnalysis, setTrendAnalysis] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const data = await getCosts();
            setCosts(data);
            const minCost = data.reduce((min, cost) => (min.price < cost.price ? min : cost), data[0]);
            setLowestCost(minCost);
        }
        fetchData();
    }, []);

    useEffect(() => {
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'LOWEST_COST_UPDATE') {
                setLowestCost(message.data);
            }
        };
    }, []);

    const handleAddOrUpdateCost = async () => {
        if (restaurant && date !== '' && location !== '') {
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

            if (isEditing && currentCostId !== null) {
                newCost.id = currentCostId;
                await updateCost(currentCostId, newCost);
                setCosts(costs.map(cost => (cost.id === currentCostId ? newCost : cost)));
                setIsEditing(false);
                setCurrentCostId(null);
            } else {
                const id = await addCost(newCost);
                newCost.id = id;
                setCosts([...costs, newCost]);
            }

            if (!lowestCost || priceValue < lowestCost.price) {
                setLowestCost(newCost);
                ws.send(JSON.stringify({ type: 'LOWEST_COST_UPDATE', data: newCost }));
            }

            setRestaurant('');
            setPrice('');
            setDate('');
            setLocation('');
        } else {
            alert('Please fill in all fields.');
        }
    };

    const handleEditCost = (cost: Cost) => {
        setRestaurant(cost.restaurant);
        setPrice(cost.price);
        setDate(cost.date);
        setLocation(cost.location);
        setIsEditing(true);
        setCurrentCostId(cost.id ?? null);

        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteCost = async (id: string | undefined) => {
        if (id !== undefined) {
            if (window.confirm('Are you sure you want to delete this item?')) {
                await deleteCost(id);
                setCosts(costs.filter(cost => cost.id !== id));
            }
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

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value > 0) {
            setPrice(value);
        } else {
            setPrice('');
        }
    };

    // const handleAnalyzeTrends = async () => {
    //     const costsText = costs.map(cost => `Restaurant: ${cost.restaurant}, Price: ${cost.price}, Date: ${cost.date}`).join('\n');
    //     const analysis = await analyzeTrends(costsText);
    //     setTrendAnalysis(analysis);
    // };

    return (
        <Container sx={{ bgcolor: 'background.default', color: 'text.primary', p: 2 }}>
            <header>
                <Box display="flex" alignItems="center" mb={2}>
                    <img src={logo} alt="logo" style={{ height: '10vmin', cursor: 'pointer' }} onClick={() => window.location.reload()} />
                    <Typography variant="h1" sx={{ ml: 2 }}>Respriz</Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Restaurant"
                            value={restaurant}
                            onChange={(e) => setRestaurant(e.target.value)}
                            InputProps={{ sx: { bgcolor: 'background.paper' } }}
                            InputLabelProps={{ sx: { color: 'text.primary' } }}
                            sx={{ color: 'text.primary' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Cost per person (NZD)"
                            value={price}
                            onChange={handlePriceChange}
                            InputProps={{ sx: { bgcolor: 'background.paper' } }}
                            InputLabelProps={{ sx: { color: 'text.primary' } }}
                            sx={{ color: 'text.primary' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Date of Visit"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{ shrink: true, sx: { color: 'text.primary' } }}
                            InputProps={{ sx: { bgcolor: 'background.paper' } }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            InputProps={{ sx: { bgcolor: 'background.paper' } }}
                            InputLabelProps={{ sx: { color: 'text.primary' } }}
                            sx={{ color: 'text.primary' }}
                        />
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" onClick={handleAddOrUpdateCost}>
                            {isEditing ? 'Update' : 'Add'}
                        </Button>
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                    <Button onClick={handleSort}>Sort by Price {sortBy === 'asc' ? '↑' : '↓'}</Button>
                    <TextField
                        label="Search by restaurant name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{ sx: { bgcolor: 'background.paper' } }}
                        InputLabelProps={{ sx: { color: 'text.primary' } }}
                        sx={{ color: 'text.primary' }}
                    />
                </Box>
                <Box>
                    {filteredCosts.map((cost) => (
                        <Box key={cost.id} sx={{ p: 2, mb: 2, borderRadius: 1, border: 1, borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', mr: 2 }}>${cost.price}</Typography>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{cost.restaurant}</Typography>
                                <Typography>{cost.location}</Typography>
                                <Typography>{cost.date}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                            <Button variant="outlined" sx={{ mb: 1 }} onClick={() => navigate(`/menu/${cost.id}/${cost.restaurant}`)}>Menu</Button>
                                <Button variant="outlined" sx={{ mb: 1 }} onClick={() => handleEditCost(cost)}>Edit</Button>
                                <Button variant="outlined" color="error" onClick={() => handleDeleteCost(cost.id)}>Delete</Button>
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Box sx={{ mt: 2 }}>
                    {/* <Button variant="contained" color="secondary" onClick={handleAnalyzeTrends}>
                        Analyze Trends
                    </Button>
                    {trendAnalysis && (
                        <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                            <Typography variant="h6">Trend Analysis:</Typography>
                            <Typography>{trendAnalysis}</Typography>
                        </Box>
                    )} */}
                    <Typography>This app allows you to share and manage costs for restaurants you've visited.</Typography>
                    <Typography>Developed with React and TypeScript.</Typography>
                </Box>
            </header>
        </Container>
    );
}

export default Home;
