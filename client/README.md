
# Restaurant Delivery App – Frontend (Client)

This repository contains the frontend (client) code for the Restaurant Delivery App. It is built with **React Native**, **Expo**, and **React Navigation**, delivering a mobile-first experience that allows users to view nearby restaurants, filter them by rating and price, browse menus, place orders, and track delivery statuses. Additionally, users can log in, select their account type (customer or courier), and manage account details. The frontend communicates with a backend API to fetch data, submit orders, and update delivery statuses.

## Table of Contents

- [Restaurant Delivery App – Frontend (Client)](#restaurant-delivery-app--frontend-client)
  - [Table of Contents](#table-of-contents)
  - [Key Features](#key-features)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Core Functionality](#core-functionality)
  - [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
  - [Building for Production](#building-for-production)
  - [Available Screens and Components](#available-screens-and-components)
  - [Navigation Structure](#navigation-structure)
  - [Styling and Theming](#styling-and-theming)

## Key Features

- **User Authentication**: Users can log in and the app differentiates between **customer** and **courier** account types.
- **Account Selection**: If a user has multiple account types, they can select which context (customer or courier) they want to use.
- **Nearby Restaurants**: Customers can view restaurants, filter them by rating or price, and view their addresses on a map.
- **Restaurant Menu & Ordering**: Customers can browse a restaurant’s menu, adjust item quantities, and submit orders.
- **Order History & Rating**: Customers can view past orders, see order details, and rate restaurants.
- **Courier Deliveries**: Couriers can view assigned deliveries, change order statuses (e.g., pending → in progress → delivered), and see order details.
- **Account Details Management**: Users can update their account email and phone number.
- **Dynamic Address & Maps**: View a restaurant’s exact location on a custom-styled map.

## Technology Stack

- **React Native**: Core framework for building the mobile interface.
- **Expo**: Streamlines React Native development, testing, and building.
- **React Navigation**: Implements a stack and bottom-tab navigation structure.
- **FontAwesome / MaterialIcons**: Provides vector icons for UI elements.
- **AsyncStorage**: Stores user tokens and preferences locally on the device.
- **ContentLoader**: Displays skeleton loading states for improved UX during data fetching.

## Project Structure

Below is the structure of the `client` directory:

```
.
├── App.js
├── app.json
├── assets
│   ├── fonts
│   │   ├── Oswald-Bold.ttf
│   │   ├── Oswald-ExtraLight.ttf
│   │   ├── Oswald-Light.ttf
│   │   ├── Oswald-Medium.ttf
│   │   ├── Oswald-Regular.ttf
│   │   ├── Oswald-SemiBold.ttf
│   │   ├── Oswald-VariableFont_wght.ttf
│   │   ├── SpaceMono-Bold.ttf
│   │   ├── SpaceMono-BoldItalic.ttf
│   │   ├── SpaceMono-Italic.ttf
│   │   └── SpaceMono-Regular.ttf
│   └── images
│       ├── AppIcon.ico
│       ├── AppIcon.png
│       ├── AppLogoV1.png
│       ├── AppLogoV2.png
│       ├── InspectMode.png
│       ├── RestaurantMenu.jpg
│       ├── adaptive-icon.png
│       ├── favicon.png
│       ├── icon.png
│       ├── map-marker.png
│       ├── restaurants
│       │   ├── cuisineGreek.jpg
│       │   ├── cuisineJapanese.jpg
│       │   ├── cuisinePasta.jpg
│       │   ├── cuisinePizza.jpg
│       │   ├── cuisineSoutheast.jpg
│       │   └── cuisineViet.jpg
│       └── splash.png
├── babel.config.js
├── components
│   ├── Header.js
│   ├── modals
│   │   ├── DeliveryDetailModal.js
│   │   ├── OrderHistoryDetailModal.js
│   │   ├── OrderModal.js
│   │   └── RestaurantAddressModal.js
│   ├── navigation
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   ├── RestaurantsStackNavigator.js
│   │   ├── RootNavigator.js
│   │   └── TabNavigator.js
│   └── screens
│       ├── AccountDetailsScreen.js
│       ├── AccountSelectionScreen.js
│       ├── DeliveriesScreen.js
│       ├── LoginScreen.js
│       ├── MenuScreen.js
│       ├── OrderHistoryScreen.js
│       └── RestaurantsScreen.js
├── eas.json
├── package-lock.json
├── package.json
├── styles
│   └── mapStyle.json
└── utils
    └── addressUtils.js
```

**Key directories:**
- `components/`: Shared UI components, modals, and navigators.
- `components/navigation`: All React Navigation configurations (root, app, auth, tabs).
- `components/screens`: Individual screens for various parts of the app (login, restaurants, menus, deliveries, order history, etc.).
- `styles/`: Contains map styling JSON files.
- `utils/`: Utility functions, such as address formatting and retrieval.

## Core Functionality

1. **User Auth Flow**:
   Users must log in via the `LoginScreen`. On successful authentication, tokens and user data are stored with AsyncStorage. Then, based on user account types, the `AccountSelectionScreen` may appear to select context.

2. **Customer View**:
   Once logged in as a customer, the bottom tab navigation includes:
   - **Restaurants**: Browse nearby restaurants, filter by rating and price.
   - **OrderHistory**: View and interact with previous orders.
   - **Account**: Update account details such as email and phone.

   From Restaurants, tapping a restaurant leads to a `MenuScreen`, where items can be added to an order and confirmed.

3. **Courier View**:
   If logged in as a courier, the bottom tab shows:
   - **Deliveries**: View assigned delivery orders, update their status (pending → in progress → delivered).
   - **Account**: Manage account details.

4. **Modals**:
   Various modals display details and allow interactions:
   - **OrderModal**: Confirm and submit an order.
   - **DeliveryDetailModal**: Show courier delivery specifics.
   - **OrderHistoryDetailModal**: Provide in-depth info on a past order and submit ratings.
   - **RestaurantAddressModal**: Show a map with the restaurant’s location.

## Getting Started

**Prerequisites:**
- Node.js and npm installed.
- Expo CLI installed globally: `npm install -g expo-cli`.
- A backend server running and accessible. The frontend expects environment variables for API URLs.

**Installation:**
1. Clone this repository.
2. Navigate to the `client` directory:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

The frontend expects a base API URL to be provided as an environment variable. In Expo, you can configure this by using `.env` files or setting `process.env.EXPO_PUBLIC_URL` appropriately.

For development, create a `.env` file in the project root and set:

```
EXPO_PUBLIC_URL=https://your-api-domain.com
```

You may also configure this in `app.json` or `eas.json` depending on your build/deployment strategy.

## Running the App

1. Ensure your backend server is running and accessible at the URL set in `EXPO_PUBLIC_URL`.
2. Run the Expo development server:
   ```bash
   npx expo start
   ```
3. Scan the QR code with your smartphone (with the Expo Go app installed) or run on an emulator/simulator via the Metro bundler UI.

## Building for Production

Use Expo’s build service or EAS (Expo Application Services) to create a production-ready build:

```bash
npx expo build:android
npx expo build:ios
```

Or use `eas build` if EAS is set up:
```bash
eas build --platform android
eas build --platform ios
```

## Available Screens and Components

- **LoginScreen**: User authentication.
- **AccountSelectionScreen**: Select customer or courier mode if multiple available.
- **RestaurantsScreen**: Browse/filter restaurants.
- **MenuScreen**: View menu items, adjust quantities, and prepare orders.
- **OrderHistoryScreen**: View past orders, see details, and rate restaurants.
- **DeliveriesScreen**: View and update courier deliveries.
- **AccountDetailsScreen**: View and update user account information.
- **Modals**: `OrderModal`, `DeliveryDetailModal`, `OrderHistoryDetailModal`, `RestaurantAddressModal`.

## Navigation Structure

- **RootNavigator**: Decides whether to show `AuthNavigator` (for login) or `AppNavigator` (for main app).
- **AuthNavigator**: Contains `LoginScreen`.
- **AppNavigator**: Contains `TabNavigator`.
- **TabNavigator**: Switches between `RestaurantsStackNavigator`, `OrderHistoryScreen`, `AccountDetailsScreen` for customers, or `DeliveriesScreen` and `AccountDetailsScreen` for couriers.
- **RestaurantsStackNavigator**: Navigates from `RestaurantsScreen` to `MenuScreen`.

## Styling and Theming

- Custom fonts (Oswald, Space Mono) are loaded at the app start.
- Inline styling and StyleSheet are used for layout and theme.
- A custom map style (`styles/mapStyle.json`) is applied to the map components for a unique look.

