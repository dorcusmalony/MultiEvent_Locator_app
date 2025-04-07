# MultiEvent_Locator_app

## Overview
The MultiEvent_Locator_app is a web application that allows users to:
- Register and log in securely with password hashing.
- Set their location and preferred event categories.
- Create, read, update, and delete events.
- Search for events based on location and filter by categories.
- Receive notifications about upcoming events matching their preferences.
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

5. **Multilingual Support (i18n)**:
   - Users can select their preferred language for the user interface.

6. **Notification System**:
   - Notifications are sent to users about upcoming events matching their preferences using Redis for Pub/Sub and scheduling.

7. **Unit Testing**:
   - Comprehensive tests for core functionalities.

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- Redis server
- PostgreSQL database

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/event-locator.git
   cd event-locator
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

### Running the Notification Consumer
To process notifications, run the following command in a separate terminal:
```bash
node consumers/notificationConsumer.js
```

## Usage Instructions
1. **User Registration and Login**:
   - Use the `/api/users/register` endpoint to register a user.
   - Use the `/api/users/login` endpoint to log in and obtain a JWT token.

2. **Event Management**:
   - Use the `/api/events` endpoints to create, read, update, and delete events.

3. **Search and Filter**:
   - Use `/api/events/search/location` to search for events by location.
   - Use `/api/events/search/category` to filter events by category.

4. **Notifications**:
   - Notifications are automatically sent to users based on their preferences.

## API Endpoints

### User Management
- **POST** `/api/users/register` - Register a new user.
- **POST** `/api/users/login` - Log in a user and return a JWT token.
- **PUT** `/api/users/:id` - Update user preferences or location.

### Event Management
- **POST** `/api/events` - Create a new event.
- **GET** `/api/events` - Retrieve all events.
- **GET** `/api/events/:id` - Retrieve a specific event by ID.
- **PUT** `/api/events/:id` - Update an event by ID.
- **DELETE** `/api/events/:id` - Delete an event by ID.

### Search and Filtering
- **GET** `/api/events/search/location` - Search for events within a specified radius.
  - Query Parameters: `latitude`, `longitude`, `radius`
- **GET** `/api/events/search/category` - Filter events by category.
  - Query Parameters: `category`

### Notifications
- **POST** `/api/notifications/schedule` - Schedule a notification for an event.

## API Examples

### User Registration
**Endpoint**: `POST /api/users/register`

**Example Request Payload**:
```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "password123",
  "location": { "type": "Point", "coordinates": [40.7128, -74.0060] },
  "preferences": ["Music", "Sports"]
}
```

**Example Response**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "testuser@example.com",
    "location": { "type": "Point", "coordinates": [40.7128, -74.0060] },
    "preferences": ["Music", "Sports"]
  }
}
```

### User Login
**Endpoint**: `POST /api/users/login`

**Example Request Payload**:
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Example Response**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Event Creation
**Endpoint**: `POST /api/events`

**Example Request Payload**:
```json
{
  "name": "Music Concert",
  "description": "A live music concert.",
  "latitude": 40.73061,
  "longitude": -73.935242,
  "event_date": "2025-04-15T19:00:00.000Z",
  "categories": ["Music"]
}
```

**Example Response**:
```json
{
  "message": "Event created successfully",
  "event": {
    "id": 1,
    "name": "Music Concert",
    "description": "A live music concert.",
    "location": { "latitude": 40.73061, "longitude": -73.935242 },
    "event_date": "2025-04-15T19:00:00.000Z",
    "categories": ["Music"]
  }
}
```

## Technical Choices
1. **Backend Framework**: Node.js with Express.js for building RESTful APIs.
2. **Database**: PostgreSQL with Sequelize ORM for data management.
3. **Redis**: Used for Pub/Sub notifications and scheduling.
4. **Authentication**: JWT for secure user authentication.
5. **Internationalization (i18n)**: Implemented using a library like `i18next`.
6. **Testing**: Unit tests written using Jest.

## Testing
Run the following command to execute unit tests:
```bash
npm test
```

## Folder Structure
```
project-root/
├── app.js          # Main application file
├── server.js       # Server entry point
├── config/         # Configuration files (e.g., Redis, database, i18n, passport)
│   ├── database.js
│   ├── redis.js
│   ├── i18n.js
│   ├── passport.js
│   └── sync.js
├── controllers/    # API controllers
│   ├── userController.js
│   └── eventController.js
├── routes/         # API routes
│   ├── userRoutes.js
│   └── eventRoutes.js
├── models/         # Database models
│   ├── user.js
│   └── event.js
├── migrations/     # SQL migration files
│   ├── add_events_table.sql
│   └── update_events_table.sql
├── utils/          # Utility scripts
│   ├── scheduler.js
│   ├── scheduleTestNotification.js
│   ├── publisher.js
│   └── publishTestMessage.js
├── consumers/      # Notification consumer scripts
│   └── notificationConsumer.js
├── tests/          # Unit tests
│   ├── user.test.js
│   ├── eventRoutes.test.js
│   ├── notificationSystem.test.js
│   ├── notificationConsumer.test.js
│   ├── multilingualSupport.test.js
│   ├── userLocationSearch.test.js
│   ├── eventController.test.js
│   └── categoryFiltering.test.js
├── locales/        # Translation files for i18n
│   ├── en/translation.json
│   └── es/translation.json
├── .env            # Environment variables
├── .gitignore      # Git ignore file
├── jest.config.js  # Jest configuration file
├── package.json    # Project metadata and dependencies
└── README.md       # Project documentation
```

## Additional Features (Future Enhancements)
- Implement event ratings and reviews.
- Integrate with a mapping service (e.g., Google Maps API) to display event locations on a map.
- Add a feature to allow users to save favorite events.
- Implement real-time updates for event changes.

   
    



   




