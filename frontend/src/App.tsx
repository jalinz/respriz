// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Menu from './Menu';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu/:restaurantId/:restaurantName" element={<Menu />} />
            </Routes>
        </Router>
    );
}

export default App;
