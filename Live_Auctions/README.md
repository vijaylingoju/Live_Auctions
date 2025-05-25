# Live Auctions Platform

This project is a full-stack web application that allows users to participate in live auctions. Users can register, log in, post items for auction, browse available items, place bids, and view their auction activities. The platform aims to provide a seamless and real-time auction experience.

**Key Features:**
* User authentication (signup and login)
* Secure account management with profile updates
* Ability for users to post new items for auction, including images and descriptions
* Real-time bidding on auction items
* Categorization of auction items
* Users can view items they have put up for auction
* Users can view items they have bid on
* Email notifications for user registration

## Project Structure

The project is organized into two main directories:

*   **`Live_Auctions/back/`**: This directory contains the backend of the application, built with Node.js and Express.js. It handles the API logic, database interactions (MongoDB via Mongoose), user authentication, and file uploads.
*   **`Live_Auctions/front/`**: This directory houses the frontend of the application, likely built with a JavaScript framework like React (based on the file structure observed). It manages the user interface and interacts with the backend API to display data and facilitate user actions.

## API Endpoints

The backend provides the following API endpoints:

### Authentication

*   **`POST /signup`**
    *   **Description:** Registers a new user.
    *   **Request Body:** `{ "name": "string", "mail": "string (email)", "password": "string", "confirmpassword": "string", "avatar": "string (filename or path)" }`
    *   **Response (Success 200):** `{ "msg": "User added successfully", "result": { ...userObject } }`
    *   **Response (Error 202):** `{ "msg": "Username already exists" }`
    *   **Response (Error 204):** `{ "msg": "password doesn't match" }`
    *   **Response (Error 500):** `{ "msg": "Internal server error" }`
    *   *Note: Sends a registration confirmation email.*

*   **`POST /login`**
    *   **Description:** Logs in an existing user.
    *   **Request Body:** `{ "mail": "string (email)", "password": "string" }`
    *   **Response (Success 200):** `{ "token": "string (JWT)" }`
    *   **Response (Error 201):** `{ "msg": "Invalid email or password" }`
    *   **Response (Error 500):** `{ "msg": "Internal server error" }`

### User Account & Profile

*   **`GET /account`**
    *   **Description:** Retrieves account details of the logged-in user.
    *   **Authentication:** Required (JWT via `x-token` header).
    *   **Response (Success 200):** `{ ...userObject }`
    *   **Response (Error 400):** `'User not found'`
    *   **Response (Error 500):** `'Server Error'`

*   **`GET /profile`**
    *   **Description:** Retrieves profile details of the logged-in user. (Functionally similar to `/account`)
    *   **Authentication:** Required (JWT via `x-token` header).
    *   **Response (Success 200):** `{ ...userObject }`
    *   **Response (Error 400):** `'User not found'`
    *   **Response (Error 500):** `'Server Error'`

*   **`POST /updateprofile`**
    *   **Description:** Updates the profile avatar of the logged-in user.
    *   **Authentication:** Required (JWT via `x-token` header).
    *   **Request Body:** FormData with `avatar` (file upload).
    *   **Response (Success 201):** `{ "msg": "Profile avatar updated successfully", "result": "string (new_avatar_filename)" }`
    *   **Response (Error 500):** `{ "msg": "Internal server error" }`

### Auction Items

*   **`POST /postauctionitem`**
    *   **Description:** Creates a new auction item.
    *   **Authentication:** Required (JWT via `x-token` header).
    *   **Request Body:** FormData with `name`, `description`, `price`, `endDateAndTime` (e.g., "YYYY-MM-DDTHH:mm"), `cat` (category), and `image` (file upload).
    *   **Response (Success 201):** `{ "msg": "Auction item posted successfully", "result": { ...auctionItemObject } }`
    *   **Response (Error 500):** `{ "msg": "Internal server error" }`

*   **`GET /auctionitems`**
    *   **Description:** Retrieves all auction items.
    *   **Authentication:** None.
    *   **Response (Success 200):** `[ { ...auctionItemObject1 }, { ...auctionItemObject2 } ]`
    *   **Response (Error 500):** `{ "msg": "Internal server error" }`

*   **`GET /userauctionitems`**
    *   **Description:** Retrieves auction items posted by the logged-in user. (Note: The code uses `req.user.mail` which seems to be an error, it should likely be `req.user.id` or find user by id then use mail. The current implementation might not work as expected if `req.user.mail` is not populated directly by the middleware.)
    *   **Authentication:** Required (JWT via `x-token` header).
    *   **Response (Success 200):** `[ { ...auctionItemObject1 }, { ...auctionItemObject2 } ]`
    *   **Response (Error 500):** `{ "msg": "Internal server error" }`
    *   *Correction: The route actually finds items by `email` obtained from the user object populated by the `Middle` middleware.*

*   **`GET /myauctions`**
    *   **Description:** Retrieves auction items created by the logged-in user.
    *   **Authentication:** Required (JWT via `x-token` header).
    *   **Response (Success 200):** `[ { ...auctionItemObject1 }, { ...auctionItemObject2 } ]`
    *   **Response (Error 500):** `{ "msg": "Internal server error" }`

### Bidding

*   **`POST /biddata`**
    *   **Description:** Submits a new bid for an auction item. Updates the item's current price.
    *   **Authentication:** Required (JWT via `x-token` header).
    *   **Request Body:** `{ "bidprice": "number", "itemId": "string (ObjectId of the auction item)" }`
    *   **Response (Success 201):** `{ "message": "Bid submitted successfully", "bid": { ...bidDataObject }, "updatedItem": { ...auctionItemObject } }`
    *   **Response (Error 500):** `{ "error": "Internal server error" }`

*   **`GET /item/:itemId`**
    *   **Description:** Retrieves all bids for a specific auction item, sorted by time descending.
    *   **Authentication:** None.
    *   **URL Parameters:** `itemId` (ObjectId of the auction item).
    *   **Response (Success 200):** `[ { ...bidDataObject1 }, { ...bidDataObject2 } ]`
    *   **Response (Error 500):** `{ "error": "Internal Server Error" }`

*   **`GET /mybids`**
    *   **Description:** Retrieves all bids made by the logged-in user.
    *   **Authentication:** Required (JWT via `x-token` header).
    *   **Response (Success 200):** `[ { ...bidDataObject1 }, { ...bidDataObject2 } ]`
    *   **Response (Error 500):** `{ "msg": "Internal server error" }`

## Data Models

The application uses MongoDB as its database, with Mongoose to define schemas. The primary data models are:

### 1. User (`auction_users`)

*   **Schema File:** `Live_Auctions/Back/models/user.js`
*   **Description:** Represents users of the application.
*   **Fields:**
    *   `name`: (String, Required) - User's full name.
    *   `mail`: (String, Required, Unique) - User's email address.
    *   `password`: (String, Required) - Hashed password for the user.
    *   `confirmpassword`: (String, Required) - Used during signup for password confirmation (not stored as a separate hashed field, but validated against `password`).
    *   `avatar`: (String, Required) - Filename or path to the user's avatar image.

### 2. Auction Item (`AuctionItems`)

*   **Schema File:** `Live_Auctions/back/models/AuctionItem.js`
*   **Description:** Represents items put up for auction.
*   **Fields:**
    *   `name`: (String, Required) - Name of the auction item.
    *   `description`: (String, Required) - Detailed description of the item.
    *   `price`: (Number, Required) - Starting price of the item.
    *   `presentprice`: (Number, Required) - The current highest bid price for the item. Initialized with `price`.
    *   `posttime`: (Date, Default: `Date.now`) - Timestamp when the item was posted.
    *   `time`: (Date, Required) - Timestamp for when the auction ends.
    *   `cat`: (String, Required) - Category of the item.
    *   `mail`: (String) - Email of the user who posted the item.
    *   `image`: (String) - Filename or path to the item's image.

### 3. Bid Data (`BidData`)

*   **Schema File:** `Live_Auctions/Back/models/biddata.js`
*   **Description:** Represents a bid placed by a user on an auction item.
*   **Fields:**
    *   `itemId`: (String, Required) - The ID of the `AuctionItem` this bid belongs to.
    *   `bidprice`: (Number, Required) - The price offered in this bid.
    *   `time`: (Date, Default: `Date.now`) - Timestamp when the bid was placed.
    *   `mail`: (String, Required) - Email of the user who placed the bid.

## Setup and Running the Project

To get the Live Auctions platform running locally, follow these steps:

### Prerequisites

*   Node.js and npm (or yarn) installed.
*   MongoDB instance (local or cloud-based like MongoDB Atlas).
*   Git (for cloning the repository).

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd Live_Auctions/back
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    *   The backend connects to MongoDB using a connection string. This is currently hardcoded in `app.js`:
        `mongoose.connect('mongodb+srv://vijaylingoju111:n8LB4ClA3crySD6A@cluster0.5dnee4a.mongodb.net/test')`
        For a production environment, or even for better local setup, it's recommended to use environment variables for this. You might need to update the `app.js` file to read from `process.env.MONGODB_URI`.
    *   The JWT secret (`jwtSecret = 'Prudhvijay57'`) is also hardcoded. This should ideally be in an environment variable.
    *   Nodemailer configuration (for registration emails) is hardcoded with Gmail credentials. This needs to be replaced with your actual email service credentials, preferably via environment variables.
4.  **Start the backend server:**
    ```bash
    npm start 
    ```
    (Assuming there's a `start` script in `Live_Auctions/back/package.json`, typically `node app.js` or `nodemon app.js`)
    If not, you can run `node app.js`. The server should start on port 5000 by default.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd Live_Auctions/front 
    ```
    (This path might need adjustment if your frontend code is in a different subdirectory within `Live_Auctions/front/`.)
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    (This usually opens the application in your default web browser, typically at `http://localhost:3000` for React apps.)

### Important Notes:

*   **Directory Structure:** The initial `Readme.me` mentioned: "Back and Front are old versions of code; back and front are modified versions of code". This documentation assumes you are using the `Live_Auctions/back/` and `Live_Auctions/front/` directories as the current and active codebase. If `Live_Auctions/Back/` and `Live_Auctions/Front/` are the correct ones, please adjust the paths accordingly in the setup instructions.
*   **API URL in Frontend:** Ensure your frontend application is configured to make API calls to the correct backend URL (e.g., `http://localhost:5000/api` or `http://localhost:5000`, depending on your backend routes). This is usually set in a configuration file or environment variable within the frontend project.

## Technologies Used

*   **Backend:**
    *   Node.js
    *   Express.js
    *   MongoDB (with Mongoose ODM)
    *   JSON Web Tokens (JWT) for authentication
    *   Multer for file uploads
    *   Nodemailer for sending emails
*   **Frontend:**
    *   React (inferred from project structure and common practices)
    *   (Likely uses standard web technologies: HTML, CSS, JavaScript)
*   **Database:**
    *   MongoDB
*   **General:**
    *   Git for version control
    *   npm for package management
