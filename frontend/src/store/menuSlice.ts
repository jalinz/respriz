// src/store/menuSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuItem {
    id?: string;
    name: string;
    price: number;
    image?: string;
    restaurantId?: string;
}

interface MenuState {
    items: MenuItem[];
}

const initialState: MenuState = {
    items: [],
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        addMenuItem(state, action: PayloadAction<MenuItem>) {
            state.items.push(action.payload);
        },
        // Additional reducers can be added here for other actions (e.g., removeItem, updateItem)
    },
});

export const { addMenuItem } = menuSlice.actions;
export default menuSlice.reducer;
