import React, { useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Switch, FormControlLabel } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Menu from './Components/Menu';
import './App.css';

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode: darkMode ? 'dark' : 'light',
                background: {
                    default: darkMode ? '#121212' : '#fafafa',
                    paper: darkMode ? '#1d1d1d' : '#ffffff',
                },
                text: {
                    primary: darkMode ? '#ffffff' : '#000000',
                },
            },
            components: {
                MuiContainer: {
                    styleOverrides: {
                        root: {
                            backgroundColor: darkMode ? '#121212' : '#fafafa',
                        }
                    }
                },
                MuiSwitch: {
                    styleOverrides: {
                        root: {
                            '& .MuiSwitch-switchBase': {
                                backgroundColor: 'transparent',
                            },
                            '& .MuiSwitch-track': {
                                backgroundColor: darkMode ? '#1d1d1d' : '#ffffff',
                            },
                            '& .MuiSwitch-thumb': {
                                backgroundColor: darkMode ? '#ffffff' : '#000000',
                            }
                        }
                    }
                }
            }
        }), [darkMode]);

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(darkMode));
    }, [darkMode]);

    const handleThemeChange = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                    <FormControlLabel
                        control={<Switch checked={darkMode} onChange={handleThemeChange} />}
                        label="Dark Mode"
                        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        className="theme-switch"
                    />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu/:restaurantId/:restaurantName" element={<Menu />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
