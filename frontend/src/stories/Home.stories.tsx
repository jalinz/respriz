
import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Home from '../Components/Home'; 
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter as Router } from 'react-router-dom';

import { setupServer } from 'msw/node';
import { userEvent, within } from '@storybook/test';

// Create a mock store
const store = configureStore({
  reducer: {
    // Define reducers if needed
  },
});

export default {
  title: 'Components/Home',
  component: Home,
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
    restaurant: { control: 'text' },
    price: { control: 'number' },
    date: { control: 'date' },
    location: { control: 'text' },
    searchTerm: { control: 'text' },
    sortBy: {
      control: {
        type: 'radio',
        options: ['asc', 'desc'],
      },
    },
  },
} as Meta<typeof Home>;
const Template: StoryFn<typeof Home> = (args) => <Home  />;

export const Default = Template.bind({});
Default.args = {};

// Play function to simulate interactions
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Simulate user interactions, like adding a cost
  await userEvent.type(canvas.getByLabelText('Restaurant'), 'Pizza Place');
  await userEvent.type(canvas.getByLabelText('Cost per person (NZD)'), '25');
  await userEvent.type(canvas.getByLabelText('Date of Visit'), '2024-08-01');
  await userEvent.type(canvas.getByLabelText('Location'), 'City Center');
  await userEvent.click(canvas.getByText('Add'));

};
