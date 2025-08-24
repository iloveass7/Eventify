# Eventify

## Project Description

Eventify is a full-stack web application designed to help users discover, create, and manage events. It provides a platform for users to find events based on their interests, and for organizers to create and manage their own events. The application includes features for user authentication, event management, an admin dashboard, and more.

## Features Implemented

- **User Authentication:** Secure user registration and login system.
- **Event Discovery:** Browse and search for events based on various criteria.
- **Event Management:** Create, update, and delete events.
- **Admin Dashboard:** A dedicated dashboard for administrators to manage users and events.
- **Interest-Based Recommendations:** Users can select their interests to get personalized event recommendations.
- **Certificate Generation:** Generate certificates for event attendees.
- **Responsive Design:** A mobile-friendly interface for a seamless experience across devices.

## Instructions to Run Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm installed on your machine.
- A MongoDB database instance (local or cloud-based).

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/iloveass7/Eventify.git
    cd eventify
    ```

2.  **Install backend dependencies:**

    ```sh
    cd Backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```sh
    cd ../Frontend
    npm install
    ```

### Configuration

1.  **Backend Environment Variables:**

    Create a `.env` file in the `Backend` directory and add the following environment variables:

    ```env
    PORT=5000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    EMAIL_HOST=<your_email_host>
    EMAIL_PORT=<your_email_port>
    EMAIL_USER=<your_email_user>
    EMAIL_PASS=<your_email_password>
    ```

### Running the Application

1.  **Start the backend server:**

    ```sh
    cd Backend
    npm run dev
    ```

2.  **Start the frontend development server:**

    ```sh
    cd ../Frontend
    npm run dev
    ```

The application should now be running at `http://localhost:5173`.
