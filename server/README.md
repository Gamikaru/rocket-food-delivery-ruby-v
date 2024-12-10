```markdown
# Restaurant Delivery App – Backend (Server)

This repository contains the backend (server) component for the Restaurant Delivery App. It is built using **Ruby on Rails**, providing robust, RESTful APIs for user authentication, account management, restaurants, menu items (products), order creation and retrieval, and order status updates. This backend interacts with a frontend client application (built with React Native/Expo) to deliver a comprehensive, full-stack solution.

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Endpoints and Features](#core-endpoints-and-features)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [Using ngrok for Remote Access](#using-ngrok-for-remote-access)
- [Authentication & Security](#authentication--security)
- [Models Overview](#models-overview)
- [Testing](#testing)
- [Further Improvements](#further-improvements)
- [License](#license)

## Key Features

- **User Authentication & Devise Integration**: Secure login using Devise, with password hashing and token-based auth for the API endpoints.
- **Multi-Account Management**: Users can be either customers or couriers. Endpoints allow retrieving and updating account details accordingly.
- **Restaurant & Menu Management**: CRUD operations for restaurants and products.
- **Order Processing**: Create, view, and update orders, including their status transitions and associated product orders.
- **Order Status & Courier Management**: Track order statuses and assign couriers.
- **API Endpoints for Frontend**: Provides JSON endpoints consumed by the frontend, including filtering products by restaurant, retrieving orders by user, and updating account details.
- **Tested with Rails Tests**: Integration and controller tests ensure stable, reliable endpoints.

## Technology Stack

- **Ruby on Rails** (Rails 7.x)
- **Ruby 3.1.x** for language runtime
- **SQLite3** as the default database for development and testing (can be adapted for production)
- **Devise** for authentication
- **Faker** for seeding and test data generation
- **Rack CORS** for handling cross-origin requests from the frontend
- **Twilio**, **HTTParty**, and other gems for extended functionalities

## Project Structure

Below is the structure of the backend (`server`) directory:

```
.
├── Gemfile
├── Gemfile.lock
├── Rakefile
├── app
│   ├── assets
│   ├── channels
│   │   └── application_cable
│   ├── controllers
│   │   ├── api
│   │   │   ├── api_auth_controller.rb
│   │   │   ├── api_orders_controller.rb
│   │   │   ├── api_products_controller.rb
│   │   │   └── api_restaurants_controller.rb
│   │   ├── application_controller.rb
│   │   ├── addresses_controller.rb
│   │   ├── customers_controller.rb
│   │   ├── employees_controller.rb
│   │   ├── home_controller.rb
│   │   ├── order_statuses_controller.rb
│   │   ├── orders_controller.rb
│   │   ├── product_orders_controller.rb
│   │   ├── products_controller.rb
│   │   ├── restaurants_controller.rb
│   │   └── users_controller.rb
│   ├── helpers
│   ├── javascript
│   │   └── controllers
│   ├── jobs
│   ├── mailers
│   ├── models
│   │   ├── address.rb
│   │   ├── courier.rb
│   │   ├── courier_status.rb
│   │   ├── customer.rb
│   │   ├── employee.rb
│   │   ├── order.rb
│   │   ├── order_status.rb
│   │   ├── product.rb
│   │   ├── product_order.rb
│   │   ├── restaurant.rb
│   │   └── user.rb
│   └── views
│       ├── addresses
│       ├── customers
│       ├── employees
│       ├── home
│       ├── layouts
│       ├── order_statuses
│       ├── orders
│       ├── product_orders
│       ├── products
│       ├── restaurants
│       ├── shared
│       └── users
├── bin
├── config
│   ├── environments
│   ├── initializers
│   ├── locales
│   ├── application.rb
│   ├── boot.rb
│   ├── environment.rb
│   ├── routes.rb
│   ├── puma.rb
│   └── storage.yml
├── db
│   ├── migrate
│   ├── schema.rb
│   ├── seeds.rb
│   └── db_schema.md
├── lib
├── public
└── test
    ├── controllers
    │   └── api
    ├── models
    ├── fixtures
    ├── system
    └── test_helper.rb
```

**Key directories:**
- `app/controllers/api/`: JSON endpoints for frontend consumption.
- `app/models/`: Database models defining relationships and validations.
- `db/migrate/`: Database migrations to create and update tables.
- `test/`: Automated tests for controllers and models.

## Core Endpoints and Features

1. **Authentication & Account Management**
   - `POST /api/auth` to authenticate a user and retrieve user IDs.
   - `GET /api/account/:id?type=customer` or `?type=courier` to retrieve account details.
   - `POST /api/account/:id` to update account info (email, phone) for customers or couriers.

2. **Restaurants & Products**
   - `GET /api/restaurants` to list available restaurants.
   - `GET /api/products` optionally filtered by `?restaurant=:id`.

3. **Orders**
   - `POST /api/orders` to create a new order.
   - `GET /api/orders?id=:id&type=customer` or `...&type=courier` to fetch orders related to a user.
   - `POST /api/order/:id/status` to update order status.
   - `POST /api/order/:id/rating` to submit a restaurant rating.

4. **Secure Controllers**
   - Some views and CRUD operations (like `/addresses`, `/orders`, etc.) may require authentication in a production environment.
   - Development mode often provides public access for testing.

## Getting Started

**Prerequisites:**
- **Ruby** (3.1.x recommended)
- **Ruby on Rails**
- **SQLite3** (or another supported DB, adjust `Gemfile` and config if needed)
- **Bundler** to manage Ruby gems

**Installation:**
1. Ensure Ruby and Rails are installed.
2. Run `bundle install` to install all dependencies from the `Gemfile`.

## Environment Configuration

Check `.ruby-version` and `Gemfile` to ensure the Ruby version matches your local environment. Update if needed.

You may need to configure CORS, host URLs, or API keys. Check `config/environments/development.rb` for `config.hosts << "your-ngrok-url"` when using ngrok.

## Database Setup

Initialize the database and seed data:

```bash
rails db:drop db:create db:migrate db:seed
```

This command will:
- Drop the database (if it exists),
- Create a new database,
- Run all migrations,
- Seed the database with sample data (if provided in `seeds.rb`).

## Running the Server

```bash
rails server
```

This starts the server on `http://localhost:3000` by default.

To inspect routes:
```bash
rails routes
```

## Using ngrok for Remote Access

To test the backend from a mobile device or from a remote frontend client:

1. Run ngrok:
   ```bash
   ngrok http 3000
   ```

2. Copy the provided HTTPS URL from ngrok and update `config/environments/development.rb`:
   ```ruby
   config.hosts << "YOUR_NGROK_URL"
   ```

3. Restart the Rails server if needed.
4. Use this ngrok URL in your frontend’s `.env` file (for example, `EXPO_PUBLIC_URL=<your-ngrok-url>`).

## Authentication & Security

- **Devise** manages user registration, login, password resets.
- The `ApiAuthController` handles API-level authentication for mobile clients.
- Ensure you handle tokens and session cookies securely if you extend authentication methods.

## Models Overview

- **User**: Base model for authentication.
- **Customer** and **Courier**: Associated with `User` for roles.
- **Restaurant**: Associated with `User` and `Address`.
- **Product**: Belongs to `Restaurant`.
- **Order**: Belongs to `Restaurant` and `Customer`; has many `ProductOrders`.
- **OrderStatus**: Defines statuses for orders.
- **CourierStatus**: Defines statuses for couriers.
- **ProductOrder**: Join model between `Order` and `Product`.
- **Address**: Shared address information.

## Testing

Run tests:
```bash
rails test
```

Controller and model tests are included in `test/` directory. Modify or add tests to maintain code quality.

## Further Improvements

- **OAuth Integration**: Enhance authentication with OAuth providers.
- **Full JWT-based Authentication**: For stateless mobile clients.
- **Production DB**: Switch to PostgreSQL or MySQL for production.
- **Advanced Caching**: Improve performance with caching strategies.
- **Enhanced Logging & Monitoring**: Tools like Lograge, New Relic, or Datadog.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
```