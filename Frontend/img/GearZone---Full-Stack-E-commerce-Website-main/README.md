# GearZone - Full-Stack E-commerce Website

**GearZone** is a modern, full-stack e-commerce website built with HTML, Tailwind CSS, JavaScript, Node.js (Express), MongoDB (Mongoose), and EJS. This project demonstrates a robust shopping experience, allowing users to browse products, add items to their shopping cart, and complete orders.

## Features

- **Product Listings**: Browse and search through available products with dynamic rendering.
- **Product Details**: View detailed descriptions, pricing, and stock information for each product.
- **Shopping Cart**: Users can add products to their cart, update quantities, and proceed to checkout.
- **Session-Based Cart**: Utilizes sessions to manage cart items, ensuring users' selections persist during their visit.
- **User Authentication**: Secure signup and login system to manage user accounts.
- **Responsive Design**: Optimized for mobile and desktop using Tailwind CSS for a clean and modern user interface.
- **Backend Integration**: Powered by Node.js (Express) with MongoDB as the database for products, users, and orders.
- **Real-Time Updates**: Asynchronous updates to the cart without page refresh using JavaScript and fetch API.

## Technology Stack

- **Frontend**: HTML, Tailwind CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose for schema and model management)
- **Templating Engine**: EJS (Embedded JavaScript)

## Setup Instructions

To set up this project on your local machine, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/gearzone.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd gearzone
   ```
3. **Install dependencies:**
     ```bash
     npm install
     ```
4. **Set up MongoDB:**
- Install MongoDB locally or use MongoDB Atlas for a cloud-based solution.
- Create a .env file in the root of your project with the following variables:
  ```bash
  MONGODB_URI=your_mongodb_connection_string
  SESSION_SECRET=your_session_secret
  ```
5. **Run the application:**
  ```bash
npm start
```
6. **Visit the application: Open your browser and go to http://localhost:3000 to view the website.**

## Folder Structure
   
 ```bash
├── models            # MongoDB models for products, users, etc.
├── routes            # Express routes for products, cart, user auth, etc.
├── views             # EJS templates for frontend rendering
├── public            # Static files (CSS, images, etc.)
├── app.js            # Main application file
├── .env              # Environment variables (not committed to git)
└── README.md         # Project documentation
```
## Contributing
  If you'd like to contribute, please fork the repository, make changes, and submit a pull request. For any major changes, please open an issue first to discuss what you'd like to change.
## License
  This project is licensed under the  MIT License - see the [LICENSE](https://opensource.org/license/mit) file for details.
```bash

You can copy and save this as `README.md` for your GitHub repository.
```
