import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { firestore } from '../Services/firebase-config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { addMenuItem } from '../store/menuSlice';
import { RootState } from '../store/store';

interface MenuItem {
    id?: string;
    name: string;
    price: number;
    image?: string;
    restaurantId?: string;
}

function Menu() {
    const { restaurantId, restaurantName } = useParams<{ restaurantId: string; restaurantName: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState<number | ''>('');
    const [itemImage, setItemImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
    const theme = useTheme();
    
    const reduxMenuItems = useSelector((state: RootState) => state.menu.items);

    useEffect(() => {
        async function fetchMenuItems() {
            if (restaurantId) {
                const q = query(collection(firestore, 'menuItems'), where('restaurantId', '==', restaurantId));
                const querySnapshot = await getDocs(q);
                const items: MenuItem[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as Omit<MenuItem, 'id'>
                }));
                setMenuItems(items);
            }
        }
        fetchMenuItems();
    }, [restaurantId]);

    const handleAddMenuItem = async () => {
        if (itemName && itemPrice !== '') {
            const newItem: Omit<MenuItem, 'id'> = {
                name: itemName,
                price: Number(itemPrice),
                image: itemImage ? URL.createObjectURL(itemImage) : undefined,
                restaurantId: restaurantId || ''
            };

            const docRef = await addDoc(collection(firestore, 'menuItems'), newItem);
            dispatch(addMenuItem({ id: docRef.id, ...newItem }));

            setMenuItems([...menuItems, { id: docRef.id, ...newItem }]);
            setItemName('');
            setItemPrice('');
            setItemImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setItemImage(file);
    };

    const toggleTheme = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };

    return (
        <Container>
            <header style={{ position: 'relative' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Button variant="contained" color="primary" onClick={() => navigate('/')}>Back to Home</Button>
                    <Typography variant="h4" sx={{ color: theme.palette.text.primary, marginLeft: 'auto' }}>
                        Menu for {restaurantName}
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Item Name"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ style: { color: theme.palette.text.primary } }}
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
                            InputProps={{ style: { color: theme.palette.text.primary } }}
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
                <Box mt={2}>
                    {menuItems.map((item) => (
                        <Box key={item.id} sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 1,
                            border: 1,
                            borderColor: theme.palette.divider,
                            bgcolor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            maxWidth: '500px',
                            maxHeight: '400px',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                mb: 1
                            }}>
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${item.price}</Typography>
                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>{item.name}</Typography>
                            </Box>
                            {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />}
                        </Box>
                    ))}
                </Box>
            </header>
        </Container>
    );
}

export default Menu;
