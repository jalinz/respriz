// src/store/rootReducer.ts
import { combineReducers } from 'redux';
import menuReducer from './menuSlice'; // Adjust the path to your menuSlice reducer

const rootReducer = combineReducers({
  menu: menuReducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
