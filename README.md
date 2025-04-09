# MultiEvent Locator App

## Overview
The MultiEvent Locator App is a web application that allows users to:
- Register and log in securely.
- Set their location and preferred event categories.
- Create, read, update, and delete events.
- Search for events based on location and filter by categories.
- Save favorite events.
- Add and view reviews for events.
- Receive real-time updates and notifications about events.
- Use the application in multiple languages (i18n support).

## Features
1. **User Management**:
   - Secure user registration and login with password hashing.
   - Users can set their location and preferred event categories.

2. **Event Management**:
   - CRUD operations for events, including details like location, date/time, and categories.

3. **Location-Based Search**:
   - Search for events within a specified radius of the user's location.

4. **Category Filtering**:
   - Filter events based on categories.

5. **Favorites**:
   - Save and manage favorite events.

6. **Event Reviews**:
   - Add, update, and view reviews for events.

7. **Real-Time Updates**:
   - WebSocket-based real-time updates for event changes.

8. **Notifications**:
   - Notifications are sent to users about upcoming events matching their preferences using Redis for Pub/Sub and scheduling.

9. **Multilingual Support (i18n)**:
   - Users can select their preferred language for the user interface.

10. **Google Maps Integration**:
    - Each event includes a `googleMapsUrl` field that provides a link to the event's location on Google Maps.

## Prerequisites
- Node.js (v14 or higher)
- Redis server
- PostgreSQL database

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/dorcusmalony/MultiEvent_Locator_app.git
   cd MultiEvent_Locator_app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   - Create a `.env` file in the root directory and add the following:
     ```env
     DB_NAME=event_locator
     DB_USER=postgres
     DB_PASSWORD=your_password
     DB_HOST=localhost
     DB_DIALECT=postgres
     JWT_SECRET=your_jwt_secret
     PORT=3000
     REDIS_HOST=127.0.0.1
     REDIS_PORT=6379
     ```

4. Run database migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

5. Start the Redis server:
   ```bash
   redis-server
   ```

6. Start the application:
   ```bash
   npm start
   ```

## Running the Notification Consumer
To process notifications, run the following command in a separate terminal:
```bash
node consumers/notificationConsumer.js
```

## API Endpoints

### User Management
- **POST** `/api/users/register` - Register a new user.
  ```json
  // Request Body
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword",
    "location": {
      "type": "Point",
      "coordinates": [40.7128, -74.0060]
    },
    "preferences": ["Music", "Sports"]
  }

  // Response
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "location": {
        "type": "Point",
        "coordinates": [40.7128, -74.0060]
      },
      "preferences": ["Music", "Sports"]
    }
  }
  ```

- **POST** `/api/users/login` - Log in a user and return a JWT token.
  ```json
  // Request Body
  {
    "email": "john@example.com",
    "password": "securepassword"
  }

  // Response
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- **PUT** `/api/users/:id` - Update user preferences or location.

### Event Management
- **POST** `/api/events` - Create a new event.
  ```json
  // Request Body
  {
    "name": "Art Exhibition",
    "description": "An exhibition showcasing modern art.",
    "latitude": 40.73061,
    "longitude": -73.935242,
    "event_date": "2023-12-20T18:00:00Z",
    "categories": "Art"
  }

  // Response
  {
    "message": "Event created successfully",
    "event": {
      "id": 101,
      "name": "Art Exhibition",
      "description": "An exhibition showcasing modern art.",
      "latitude": 40.73061,
      "longitude": -73.935242,
      "event_date": "2023-12-20T18:00:00Z",
      "categories": "Art",
      "googleMapsUrl": "https://www.google.com/maps?q=40.73061,-73.935242"
    }
  }
  ```

- **GET** `/api/events` - Retrieve all events.

- **GET** `/api/events/:id` - Retrieve a specific event by ID.
  ```json
  // Response
  {
    "id": 101,
    "title": "Music Concert",
    "description": "A live music concert featuring popular bands.",
    "location": "Central Park, NY",
    "event_date": "2023-12-15T19:00:00Z",
    "categories": ["Music", "Live"],
    "googleMapsUrl": "https://maps.google.com/?q=Central+Park"
  }
  ```

- **PUT** `/api/events/:id` - Update an event by ID.
- **DELETE** `/api/events/:id` - Delete an event by ID.

### Search and Filtering
- **GET** `/api/events/search/location` - Search for events within a specified radius.
  - Query Parameters: `latitude`, `longitude`, `radius`
- **GET** `/api/events/search/category` - Filter events by category.
  - Query Parameters: `category`

### Favorites
- **POST** `/api/favorites` - Add an event to favorites.
- **GET** `/api/favorites/:user_id` - Get favorite events for a user.
- **DELETE** `/api/favorites/:id` - Remove an event from favorites.

### Reviews
- **POST** `/api/reviews` - Add a review for an event.
- **GET** `/api/reviews/:event_id` - Get reviews for an event.
- **PUT** `/api/reviews/:id` - Update a review.

## WebSocket Usage
- Connect to the WebSocket server at `ws://localhost:8080`.
- Receive real-time updates for event changes in JSON format.

## Testing
Comprehensive unit tests cover all core functionalities, ensuring code quality and reliability. Run the following command to execute unit tests:
```bash
npm test
```

## Presentation
A video presentation has been recorded and submitted, showcasing the project and demonstrating a strong understanding of the concepts.

## Folder Structure
```
project-root/
├── app.js          # Main application file
├── server.js       # Server entry point
├── config/         # Configuration files (e.g., Redis, database, i18n, passport)
├── controllers/    # API controllers
├── routes/         # API routes
├── models/         # Database models
├── migrations/     # SQL migration files
├── utils/          # Utility scripts
├── consumers/      # Notification consumer scripts
├── tests/          # Unit tests
├── locales/        # Translation files for i18n
├── .env            # Environment variables
├── .gitignore      # Git ignore file
├── jest.config.js  # Jest configuration file
├── package.json    # Project metadata and dependencies
└── README.md       # Project documentation
```

## Additional Features
- **Event Ratings and Reviews**: Users can add, update, and view reviews for events.
- **Google Maps Integration**: Each event includes a `googleMapsUrl` field that provides a link to the event's location on Google Maps.
- **Favorites**: Users can save and manage favorite events.
- **Real-Time Updates**: WebSocket-based real-time updates for event changes.

    
    
