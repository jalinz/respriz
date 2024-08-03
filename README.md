# Respriz

**Respriz** is a restaurant cost-sharing app developed with React and TypeScript. It allows users to manage and share costs for various dining experiences, analyze cost trends, and more.

## Features

- **Add and Manage Costs**: Easily add and update dining costs, including restaurant name, price, date, and location.
- **Cost Sorting and Filtering**: Sort costs by price and filter by restaurant name.
- **Trend Analysis**: Analyze cost trends using integrated AI services.
- **Real-time Updates**: Receive real-time updates for the lowest cost using WebSocket.
- **Responsive Design**: The app is designed to be responsive and user-friendly across different devices.

## Tech Stack

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: .NET (for APIs), Firebase (for data storage and authentication)
- **Testing**: Jest, React Testing Library, Cypress
- **Storybook**: For component development and documentation
- **WebSocket**: For real-time updates

## What I’m Proud Of
One thing I'm particularly proud of is how this app solves my problem of tracking and sharing restaurant costs. The solution not only addresses my needs but also provides a user-friendly experience for managing dining expenses.
## Installation

To get started with the project, follow these steps:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/your-username/respriz.git
    cd respriz
    ```

2. **Install Dependencies**:

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:

    Create a `.env` file in the root directory and add the following environment variables:

    ```env
    REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
    REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
    REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
    ```

4. **Run the Development Server**:

    ```bash
    npm start
    ```

5. **Run Tests**:

    ```bash
    npm test
    ```

6. **Run Storybook**:

    ```bash
    npm run storybook
    ```

## Project Structure

- **`src/Components`**: Contains React components.
- **`src/Services`**: Contains service files for Firebase and other utilities.
- **`src/stories`**: Contains Storybook stories for component documentation.
- **`src/tests`**: Contains unit and integration tests.
- **`src/jest.setup.ts`**: Jest setup file for polyfills and test configuration.


## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material-UI](https://mui.com/)
- [Firebase](https://firebase.google.com/)
- [Storybook](https://storybook.js.org/)
- [Jest](https://jestjs.io/)
- [Cypress](https://www.cypress.io/)
