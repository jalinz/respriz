import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    image?: string; // Optional field for image URL
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

function Menu() {
    const { restaurantId, restaurantName } = useParams<{ restaurantId: string; restaurantName: string }>();
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState<number | ''>('');
    const [itemImage, setItemImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Fetch the menu items from your database if you have any
    }, []);

    const handleAddMenuItem = () => {
        if (itemName && itemPrice !== '') {
            const newItem: MenuItem = {
                id: menuItems.length + 1,
                name: itemName,
                price: Number(itemPrice),
                image: itemImage ? URL.createObjectURL(itemImage) : undefined, // Set image URL if available
            };
            setMenuItems([...menuItems, newItem]);
            setItemName('');
            setItemPrice('');
            setItemImage(null); // Clear the image file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Clear the input field
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setItemImage(file);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container className="App">
                <header className="App-header">
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Button variant="contained" color="primary" onClick={() => navigate('/')}>Back to Home</Button>
                        <Typography variant="h4">Menu for {restaurantName}</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Item Name"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Item Price"
                                value={itemPrice}
                                onChange={(e) => setItemPrice(Number(e.target.value))}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="file"
                                label="Item Image"
                                inputRef={fileInputRef}
                                onChange={handleFileChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="primary" onClick={handleAddMenuItem}>Add Menu Item</Button>
                        </Grid>
                    </Grid>
                    <Box className="menu-list" mt={2}>
                        {menuItems.map((item) => (
                            <Box key={item.id} className="menu-item">
                                <Box className="item-info">
                                    <Typography className="price">${item.price}</Typography>
                                    <Typography className="name">{item.name}</Typography>
                                </Box>
                                {item.image && <img src={item.image} alt={item.name} />}
                            </Box>
                        ))}
                    </Box>
                </header>
            </Container>
        </ThemeProvider>
    );
}

export default Menu;
