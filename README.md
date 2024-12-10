# Rocket Food Delivery: A React Native Restaurant Delivery App – Full-Stack Overview

This repository contains both the **frontend (React Native/Expo)** and **backend (Ruby on Rails)** components of the Restaurant Delivery App. The application enables customers and couriers to interact with a restaurant delivery ecosystem, including browsing restaurants and menus, placing orders, updating orders and delivery statuses, managing account details, and more.

[![Watch the demo](https://img.youtube.com/vi/Ufwg7X6MCzo/hqdefault.jpg)](https://youtu.be/Ufwg7X6MCzo)

## Table of Contents

- [Rocket Food Delivery: A React Native Restaurant Delivery App – Full-Stack Overview](#rocket-food-delivery-a-react-native-restaurant-delivery-app--full-stack-overview)
  - [Table of Contents](#table-of-contents)
  - [Key Features](#key-features)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Core Functionality](#core-functionality)
  - [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
  - [Building for Production](#building-for-production)
  - [Backend: Additional Details](#backend-additional-details)
  - [Frontend: Additional Details](#frontend-additional-details)
  - [Testing](#testing)

## Key Features

- **User Authentication & Account Types**:
  - Users log in and can be customers or couriers.
  - Multi-account support allows users to switch roles (if applicable).

- **Restaurant & Menu Management**:
  - View nearby restaurants, filter by rating/price.
  - Browse restaurant menus and select items for orders.

- **Order Processing & Tracking**:
  - Customers: Place orders, view order history, and rate restaurants.
  - Couriers: View assigned deliveries and update order status (pending → in progress → delivered).

- **Account Management**:
  - Update account details such as email and phone number.

- **Maps & Addresses**:
  - Display restaurant locations on a map with custom styling.
  - Integrate dynamic addresses and map markers.

## Technology Stack

**Frontend:**
- **React Native / Expo**: For building the mobile application.
- **React Navigation**: For stack and tab navigation.
- **AsyncStorage**: For storing user tokens and preferences.
- **ContentLoader**: For skeleton loading states.
- **FontAwesome / MaterialIcons**: For icons.

**Backend:**
- **Ruby on Rails (7.x)**: For building RESTful APIs and handling database operations.
- **Ruby (3.1.x)**: Language runtime.
- **SQLite3**: Default database in development/testing (easily swapped for PostgreSQL/MySQL in production).
- **Devise**: Authentication and user management.
- **Faker**, **Rack CORS**, **Twilio**, **HTTParty**: For seeding data, handling CORS, and external integrations.

## Project Structure

```
project-root/
├─ client/              # Frontend (React Native, Expo)
│  ├─ App.js
│  ├─ components/
│  ├─ screens/
│  ├─ navigation/
│  ├─ utils/
│  ├─ styles/
│  └─ ... other frontend files
│
└─ server/              # Backend (Ruby on Rails)
   ├─ app/
   ├─ config/
   ├─ db/
   ├─ test/
   ├─ Gemfile
   └─ ... other backend files
```

**Frontend Key Directories:**
- `components/navigation`: Navigation stack/tabs.
- `components/screens`: UI screens for login, restaurants, menu, order history, etc.
- `utils/`: Helpers for address handling.
- `styles/`: Map styling and general styles.

**Backend Key Directories:**
- `app/controllers/api`: Controllers returning JSON responses.
- `app/models`: Database models and relationships.
- `db/migrate`: Database migrations.
- `test/`: Automated tests for controllers and models.

## Core Functionality

**Frontend Flow:**
1. **LoginScreen**: Authenticate users.
2. **AccountSelectionScreen**: If multiple account types, choose Customer or Courier mode.
3. **Customer Mode**:
   - **Restaurants**: Browse/filter restaurants, view addresses.
   - **Menu**: Select items and create orders.
   - **OrderHistory**: View and rate past orders.
   - **AccountDetails**: Update contact info.

4. **Courier Mode**:
   - **Deliveries**: View assigned deliveries and update their status.
   - **AccountDetails**: Update courier contact info.

**Backend Flow:**
1. **Authentication (`POST /api/auth`)**: Validates user credentials.
2. **Account Management (`GET`/`POST /api/account/:id`)**: Retrieve/update user account details.
3. **Data Endpoints (`GET /api/restaurants`, `GET /api/products`)**: Fetch restaurant and product data.
4. **Orders (`POST /api/orders`, `GET /api/orders`, `POST /api/order/:id/status`)**: Create and manage orders, update statuses, and submit ratings.

## Getting Started

**Prerequisites:**
- **Node.js & npm**: For the frontend.
- **Expo CLI**: `npm install -g expo-cli`.
- **Ruby & Rails**: Install Ruby (3.1.x) and Rails.
- **SQLite3**: Default DB for backend development.

**Installation Steps:**
1. Clone the repository.
2. **Backend**:
   - Navigate to `server/` directory.
   - Run `bundle install`.
   - Prepare the database: `rails db:drop db:create db:migrate db:seed`.
   - Start the Rails server: `rails server`.

3. **Frontend**:
   - Navigate to `client/` directory.
   - Run `npm install`.
   - Set up `.env` with `EXPO_PUBLIC_URL` pointing to your backend server.
   - Start the Expo dev server: `npx expo start`.

## Environment Variables

**Backend**:
- Adjust `config/environments/development.rb` to allow ngrok URLs if testing on a remote device.
- Use `.ruby-version` and `Gemfile` to ensure correct Ruby version.

**Frontend**:
- Create a `.env` file in `client/` directory.
- Set `EXPO_PUBLIC_URL=<your-backend-url>` (e.g., local `http://localhost:3000` or ngrok URL).

## Running the Application

1. **Backend**:
   ```bash
   cd server
   rails server
   ```
   Access at `http://localhost:3000`.

2. **Frontend**:
   ```bash
   cd client
   npx expo start
   ```
   Scan the QR code with Expo Go or run on a simulator.

## Building for Production

**Backend**:
- Consider using PostgreSQL or MySQL in production.
- Deploy to services like Heroku, Render, or AWS.

**Frontend**:
- Use EAS (Expo Application Services) or Expo build service:
  ```bash
  eas build --platform android
  eas build --platform ios
  ```

## Backend: Additional Details

**Core Endpoints:**
- `POST /api/auth`: Authenticate users.
- `GET /api/account/:id?type=customer/courier`: Retrieve account details.
- `POST /api/account/:id`: Update account info.
- `GET /api/restaurants`: List restaurants.
- `GET /api/products?restaurant=:id`: Filter products by restaurant.
- `POST /api/orders`: Create order.
- `GET /api/orders?id=:id&type=customer/courier`: Retrieve user-related orders.
- `POST /api/order/:id/status`: Update order status.
- `POST /api/order/:id/rating`: Submit order rating.

**Models Overview:**
- `User` (Devise)
- `Customer` & `Courier` linked to `User`
- `Restaurant`, `Product`, `Order`, `OrderStatus`, `ProductOrder`, `Address`

**Testing Backend:**
```bash
cd server
rails test
```

## Frontend: Additional Details

**Navigation Structure:**
- **RootNavigator**: Decides between Auth or App flow.
- **AuthNavigator**: Contains `LoginScreen`.
- **AppNavigator**: Contains tabs for customers or couriers.
- **TabNavigator**: Displays different tabs based on user type.
- **RestaurantsStackNavigator**: Navigates from Restaurants to Menu.

**Styling & Theming:**
- TailwindCSS.
- Custom and dynamic map styles for a unique look and interactive feel.

## Testing

**Backend Tests**: Located in `server/test/`. Run with `rails test`.
**Frontend**: Manual testing via Expo. Add Jest/React Native Testing Library for automated tests if needed.



