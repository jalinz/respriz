// src/stories/Menu.stories.tsx
import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Menu from '../Components/Menu'; // Adjust the import path if necessary
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '../store/menuSlice';
import { BrowserRouter as Router } from 'react-router-dom';
import { action } from '@storybook/addon-actions';
import { userEvent, within } from '@storybook/test';

// Create a mock store
const store = configureStore({
  reducer: {
    menu: menuReducer,
  },
});

export default {
  title: 'Components/Menu',
  component: Menu,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Router>
          <Story />
        </Router>
      </Provider>
    ),
  ],
  argTypes: {
    itemName: { control: 'text' },
    itemPrice: { control: 'number' },
    itemImage: { control: 'text' }, // Consider using a URL input for image
  },
} as Meta<typeof Menu>;

const Template: StoryFn<typeof Menu> = (args) => <Menu  />;

export const Default = Template.bind({});
Default.args = {
  itemName: '',
  itemPrice: 0,
 
};

Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  
  // Simulate adding a menu item
  await userEvent.type(canvas.getByLabelText('Item Name'), 'Pizza');
  await userEvent.type(canvas.getByLabelText('Item Price'), '12.99');
  // await userEvent.upload(canvas.getByLabelText('Item Image'), '');
  await userEvent.click(canvas.getByText('Add Menu Item'));


};
