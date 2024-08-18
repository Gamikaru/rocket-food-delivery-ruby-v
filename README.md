### Background Research

#### 1. Difference Between Native and Cross-Platform Mobile Applications

**Native Mobile Applications:**
- **Definition**: Native applications are developed specifically for a particular platform (iOS, Android) using platform-specific languages like Swift for iOS and Kotlin/Java for Android.
- **Advantages**:
  - **Performance**: Native apps are optimized for the specific platform, offering better performance, responsiveness, and smooth animations.
  - **Access to Device Features**: Native apps have full access to all device features (camera, GPS, sensors, etc.) without any restrictions.
  - **User Experience**: Native apps offer a better user experience as they adhere to platform-specific design guidelines.
- **Disadvantages**:
  - **Development Cost**: Separate codebases are needed for each platform, increasing development time and cost.
  - **Maintenance**: Maintaining and updating multiple codebases can be more challenging.

**Cross-Platform Mobile Applications:**
- **Definition**: Cross-platform applications are developed using a single codebase that runs on multiple platforms (iOS, Android). Frameworks like React Native, Flutter, and Xamarin are commonly used.
- **Advantages**:
  - **Cost Efficiency**: A single codebase reduces development time and cost, making it more cost-effective.
  - **Faster Development**: Development is faster since the code can be shared across platforms.
  - **Maintenance**: Easier maintenance as updates and changes only need to be made in one codebase.
- **Disadvantages**:
  - **Performance**: Cross-platform apps might not perform as well as native apps, especially for resource-intensive tasks.
  - **Access to Device Features**: While most device features are accessible, some may require platform-specific coding or third-party plugins.
  - **User Experience**: It may be challenging to achieve the same level of user experience as native apps due to differences in platform guidelines.

#### 2. Difference Between React Native and React

**React Native:**
- **Definition**: React Native is a framework for building mobile applications using React. It allows developers to use React along with native platform capabilities to build mobile apps for iOS and Android from a single codebase.
- **Key Features**:
  - **Native Components**: React Native uses native components instead of web components, providing a more native feel to the application.
  - **Performance**: While not as fast as fully native apps, React Native offers better performance than many other cross-platform frameworks.
  - **Hot Reloading**: Developers can see the results of the latest changes almost instantly, improving the development experience.
  - **Access to Native Modules**: React Native allows access to native modules and platform-specific APIs through bridging, making it easier to integrate native functionalities.
- **Usage**: Best suited for mobile app development where code reusability and efficiency are critical.

**React:**
- **Definition**: React (or React.js) is a JavaScript library for building user interfaces, primarily for web applications. It allows developers to create large web applications that can update and render efficiently in response to data changes.
- **Key Features**:
  - **Virtual DOM**: React uses a virtual DOM to optimize rendering and improve performance.
  - **Component-Based Architecture**: React encourages building encapsulated components that manage their own state and can be composed to build complex UIs.
  - **Declarative Syntax**: React makes it easy to create interactive UIs with its declarative approach, where the UI reflects the current state of the data.
  - **Ecosystem**: React has a rich ecosystem of tools, libraries, and frameworks (like Redux for state management) that enhance its capabilities.
- **Usage**: Primarily used for building dynamic and interactive user interfaces for web applications.

#### 3. Overview of the Functionalities of the Mobile App

**Rocket Food Delivery Mobile App Functionalities:**
- **Login and Authentication**:
  - Users can log in using their credentials. Successful login redirects to the restaurant page.
- **Restaurant Listing**:
  - Displays a list of restaurants with options to filter by rating and price.
  - Users can select a restaurant to view its menu and place orders.
- **Menu and Order Management**:
  - Users can view a restaurant's menu, adjust item quantities, and create orders.
  - Order confirmation and management through a modal interface.
- **Order History**:
  - Users can view their past orders and see details about each order.

**Additional Features**:
- **Header and Footer Navigation**: Present throughout the app (except the login screen) for easy access to various sections.
- **Responsive Design**: The app follows the provided wireframe for consistent styling across iOS and Android devices.
- **API Integration**: The app uses various API endpoints for authentication, restaurant data retrieval, and order processing.

#### 4. Plan for Which APIs Should Be Utilized

**APIs Utilized in the Rocket Food Delivery Mobile App:**
- **Authentication API**:
  - **Endpoint**: `/login`
  - **Usage**: To authenticate users and retrieve tokens needed for accessing other parts of the app.
- **Restaurant API**:
  - **Endpoint**: `/restaurants`
  - **Usage**: To fetch a list of restaurants, including details like name, rating, price, and images.
- **Menu API**:
  - **Endpoint**: `/restaurants/:id/menu`
  - **Usage**: To fetch the menu for a specific restaurant. The app displays this data and allows users to place orders.
- **Order API**:
  - **Endpoint**: `/orders`
  - **Usage**: To create and manage orders. This includes placing an order, viewing order history, and order status.
- **Order History API**:
  - **Endpoint**: `/orders/history`
  - **Usage**: To retrieve the user's order history, allowing them to view past orders and their details.

