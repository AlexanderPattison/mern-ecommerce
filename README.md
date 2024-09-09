# MERN-ecommerce

This is a full-stack e-commerce platform built with Next.js for the frontend and Node.js with Express for the backend. It features a complete shopping experience, from product browsing to checkout, as well as an admin dashboard for managing products, orders, and users.

## Features

- User authentication (register, login, profile management)
- Product catalog with search functionality
- Shopping cart management
- Checkout process
- Order history for users
- Admin dashboard with the following capabilities:
  - Product management (CRUD operations)
  - Order management
  - User management
  - Sales statistics

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:
  ``` bash
  git clone https://github.com/AlexanderPattison/mern-ecommerce.git
  cd mern-ecommerce
  ```
2. Install dependencies for both frontend and backend:
  ``` bash
  cd frontend
  npm install
  cd ../backend
  npm install
  ```
3. Set up environment variables:
- Create a `.env` file in the backend directory with the following variables:
  ``` plaintext
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  ```
4. Start the backend server:
  ``` bash
  cd backend
  npm run dev
  ```
5. In a new terminal, start the frontend development server:
  ``` bash
  cd frontend
  npm run dev
  ```
6. Open `http://localhost:3000` in your browser to view the application.

### Seeding the Database

To populate the database with initial data, follow these steps:

1. Ensure your MongoDB connection is set up correctly in the .env file.
2. Navigate to the backend directory:
  ``` bash
  cd backend
  ```
3. Run the seed script:
  ``` bash
  node seedDatabase.js
  ```

## API Configuration

The frontend is configured to communicate with the backend API. If you need to modify the API URL, you can update it in the `frontend/src/utils/api.js` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
