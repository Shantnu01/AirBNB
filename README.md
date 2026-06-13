# Airbnb Clone Project

A lightweight Node.js & Express web application designed to simulate the core features of Airbnb. This project follows the Model-View-Controller (MVC) architecture, using EJS (Embedded JavaScript) templates for dynamic server-side rendering, and PostgreSQL for relational data persistence.

---

## 🚀 Project Overview & Current Status

This application allows users to act as **Hosts** (who can list, edit, and delete properties) and **Guests/Users** (who can browse homes, view details, and manage a list of favorite properties).

### 📍 Current Situation & Development Status:
* **Database Relational Persistence:** The project has successfully transitioned from local JSON file storage (`data/data.json` and `data/fav.json`, now legacy/deprecated) to a PostgreSQL relational database using the `pg` client pool driver.
* **Authentication & Session Management:**
  * Uses `express-session` configured in [app.js](file:///e:/AirBNB/app.js) to manage session cookies.
  * Login and Sign Up views ([login.ejs](file:///e:/AirBNB/views/store/login.ejs), [signup.ejs](file:///e:/AirBNB/views/store/signup.ejs)) and controllers ([usercon.js](file:///e:/AirBNB/controllers/usercon.js)) are implemented.
  * **Note/Limitation:** The GET routes for `/login` and `/signup` are registered in [userRouter.js](file:///e:/AirBNB/routes/userRouter.js), but the POST routes (`/login` and `/signup`) are not yet registered in the router, meaning form submissions for authentication will result in a 404 until mapped.
* **Bookings Feature:**
  * A "Bookings" page link exists in the navigation header ([nav.ejs](file:///e:/AirBNB/views/partials/nav.ejs)) pointing to `/store/bookings`.
  * **Note/Limitation:** The target EJS template [bookings.ejs](file:///e:/AirBNB/views/store/bookings.ejs) is currently blank/empty, and no backend router or controller logic has been implemented for bookings.
* **Cookie Parsing:** `cookie-parser` is included in the project's dependencies and a scratch testing file ([test.js](file:///e:/AirBNB/test.js)) is present in the root folder, but it is not currently active in [app.js](file:///e:/AirBNB/app.js).

---

## 🛠️ Requirements & Tech Stack

### Core Technologies
* **Runtime Environment:** [Node.js](https://nodejs.org/) (v16+)
* **Framework:** [Express.js](https://expressjs.com/) (v5+)
* **Database:** [PostgreSQL](https://www.postgresql.org/) (v8+)
* **Template Engine:** [EJS](https://ejs.co/) (Embedded JavaScript)

### Dependencies
Check your [package.json](file:///e:/AirBNB/package.json) for installed dependencies:
* `"express"`: Web server routing and middleware.
* `"pg"`: PostgreSQL client and connection pool.
* `"dotenv"`: Loads environment variables.
* `"ejs"`: Rendering dynamic HTML views.
* `"express-session"`: Manages session authentication.
* `"cookie-parser"`: Parser for HTTP cookies.
* `"nodemon"`: Auto-restart server on file changes.

---

## 📂 Project Architecture (MVC)

The project structure is organized cleanly to enforce separation of concerns:

```
AirBNB/
├── controllers/          # Business logic and request handlers
│   ├── hostcon.js        # Logic for hosting properties (add, edit, list, delete)
│   └── usercon.js        # Logic for browsing homes, favorites, and auth sessions
├── data/                 # Deprecated local storage directories
│   ├── data.json         # Old home data JSON (legacy)
│   └── fav.json          # Old favorites JSON (legacy)
├── model/                # Data structures and database query logic
│   ├── home.js           # Homes class (inserts, updates, deletes, and fetches from PostgreSQL)
│   └── favourites.js     # Favourites class (manages favorite listings via PostgreSQL)
├── routes/               # Express Router middleware definitions
│   ├── hostRouter.js     # Routes under /host/... (hosting features)
│   └── userRouter.js     # Public-facing routes (browsing, details, favorites, auth GETs)
├── views/                # EJS Templates for rendering UI pages
│   ├── host/             # Hosting views (add-home, edithome, host-home-list, cong)
│   ├── store/            # Public store views (home, details, favourite-list, login, signup, bookings, 404)
│   └── partials/         # Reusable layouts (nav.ejs)
├── .env                  # Database connection credentials (user, password, host, port, database)
├── app.js                # Core entry point of the server with session config
├── db.js                 # PostgreSQL connection pool initializer
├── nodemon.json          # Configuration for nodemon monitoring
├── package.json          # Project metadata, scripts, and dependencies
└── test.js               # Cookie-parser testing scratch script
```

---

## ⚡ Setup & Database Connection

Follow these steps to run the project locally:

### 1. Database Schema Initialization
Create a PostgreSQL database and execute the following SQL script to set up the relational tables:

```sql
-- Create Homes table
CREATE TABLE homes (
    id SERIAL PRIMARY KEY,
    house_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT,
    rooms INT NOT NULL,
    rating NUMERIC DEFAULT NULL
);

-- Create Favourites table
CREATE TABLE favourites (
    id SERIAL PRIMARY KEY,
    home_id INT REFERENCES homes(id) ON DELETE CASCADE,
    user_id INT DEFAULT 1,
    UNIQUE (home_id, user_id)
);
```

### 2. Environment Configuration
Create a `.env` file in the root directory and supply your PostgreSQL connection details:
```env
DB_USER=your_postgres_username
DB_HOST=localhost
DB_DATABASE=your_database_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

### 3. Install Dependencies
Ensure Node.js is installed, then run:
```bash
npm install
```

### 4. Run the Project in Development Mode
To run the app using `nodemon`:
```bash
npm run start
```

### 5. Access the App
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔄 Core Workflows

### 1. The Hosting Workflow
* **Add Property:**
  * Host navigates to `/host/add-home` which renders the form template.
  * Submitting the form triggers a POST request to `/host/add-home`.
  * The controller instantiates a new `homes` model and saves it. The rating defaults to `NULL` (since only guests who stay should rate the property).
* **View Hosted Properties:**
  * Hosts can view all their properties at `/host/homeslist`. The controller queries the model using `homes.fetchAll` and renders the list.
* **Edit Property:**
  * Clicking "Edit" sends a GET request to `/host/edit/:id`.
  * The server fetches the current details using `homes.fetchById` and pre-fills them in `views/host/edithome.ejs`.
  * Clicking "Apply" sends a POST request to `/host/edits`. The server maps the updated fields to the existing property ID and runs an SQL `UPDATE` statement.
* **Delete Property:**
  * Clicking "Remove" submits a POST request to `/host/remove-home` carrying the target ID. The model runs an SQL `DELETE` statement.

### 2. The User/Guest Workflow
* **Browse Homes:**
  * Users view all available listings on the homepage `/` laid out in a responsive grid.
* **View Details:**
  * Clicking "Details" on a property card routes the user to `/details/:id` which showcases a two-column detail page layout (large image, verified badges, specs, and a booking CTA).
* **Manage Favorites:**
  * Users can click the heart icon (♥) on home cards to mark a property as a favorite, which routes to `/fav`.

---

## 📝 Design Patterns Applied
* **MVC Pattern:** Strict division between models (handling DB query logic), controllers (handling request-response flow), and views (rendering dynamic HTML UI using EJS templates).
* **Relational Database Storage:** Transitions from local JSON storage to a structured PostgreSQL relational schema, executing `INSERT`, `UPDATE`, `DELETE`, and `SELECT` queries asynchronously.
* **Redesigned UI Grid**: Implements a clean 5-column responsive grid layout on the main page, cards with consistent aspect-ratio cropped images, and subtle interactive animations.
