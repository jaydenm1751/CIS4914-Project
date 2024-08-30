# CIS4914-Project
TODO:
# Subleaser

**A platform to connect individuals looking to sublease their apartments or homes with those seeking such opportunities.**

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [Project Structure](#project-structure)
8. [Team Members](#team-members)
9. [License](#license)

## Introduction

Subleaser is a website designed to simplify the process of finding or posting a sublease. It provides a centralized, user-friendly platform for sublease seekers and providers, offering features like advanced filtering and direct messaging to streamline communication.

### Problem Statement

Finding a sublease can be a challenging and time-consuming process, often requiring users to navigate through various platforms with limited search functionalities.

### Solution

The proposed website provides an intuitive interface where users can:
- Post sublease listings with essential details such as location, price, and roommate information.
- Search and filter these listings based on specific criteria.
- Communicate directly with listers through a built-in messaging system.

## Features

- **User Authentication**: Secure login and registration for users.
- **Sublease Posting**: Users can create and manage their sublease postings.
- **Advanced Search and Filtering**: Filter listings based on location, price, and more.
- **Direct Messaging**: In-app messaging system to communicate with sublease providers.
- **User Management**: Manage posts and messages efficiently.

## Technologies Used

- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: (e.g., MongoDB, PostgreSQL, specify if decided)
- **Others**: (List any other tools or libraries, e.g., Redux, JWT for authentication)

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/jaydenm1751/CIS4914-Project.git
    cd CIS4914-Project
    ```

2. **Navigate to the Frontend Directory**:
    ```bash
    cd frontend
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Navigate to the Backend Directory**:
    ```bash
    cd ../backend
    ```

5. **Install Dependencies**:
    ```bash
    npm install
    ```

6. **Create a `.env` file in the backend directory**:
    Define necessary environment variables (like database URLs, API keys, etc.).

7. **Run the Application**:
    - **Frontend**:
        ```bash
        cd ../frontend
        npm start
        ```
    - **Backend**:
        ```bash
        cd ../backend
        npm start
        ```

## Usage

Once the application is running:

1. **Navigate to the Frontend URL**: Usually, it will be running on `http://localhost:3000`.
2. **Sign up or Log in**: Register a new account or log in with existing credentials.
3. **Explore the Features**: Post a sublease, search for available listings, and communicate with others.

## Contributing

We welcome contributions! Here’s how you can help:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for more details on our code of conduct and the process for submitting pull requests.

## Project Structure

Here's an overview of the project's structure:

- **frontend/**: Contains all the React frontend code.
- **backend/**: Contains the Node.js server and API code.
- **docs/**: Documentation files for the project (if any).
- **.gitignore**: Lists files and directories ignored by Git.
- **README.md**: This file.

## Team Members

- **Nikolas Praschma** (Scrum Master) - [nikolas.praschma@ufl.edu](mailto:nikolas.praschma@ufl.edu)
- **Justin Sanabria** (Front End Developer) - [justinsanabria@ufl.edu](mailto:justinsanabria@ufl.edu)
- **Jayden McKenna** (Project Manager) - [jaydenmckenna@ufl.edu](mailto:jaydenmckenna@ufl.edu)
- **Stephen Ng** (Back End Developer) - [sng1@ufl.edu](mailto:sng1@ufl.edu)

## License

This project is licensed under the [MIT License](LICENSE).

