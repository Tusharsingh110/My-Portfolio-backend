
# Portfolio Backend

## Introduction

Welcome to the backend repository for your portfolio project. This backend serves as the backend for your portfolio website, handling feedback submissions and other functionalities.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** [Download and install Node.js](https://nodejs.org/).
- **MongoDB:** [Install MongoDB](https://docs.mongodb.com/manual/installation/).

## Getting Started

To set up and run the backend locally, follow these steps:

### Installation

Install project dependencies using npm:

`npm start`


### Configuration

Configure environment variables as needed. You may want to create a `.env` file for storing environment variables.

### Running the Application

Start the server:

```bash
curl -X POST http://localhost:3000/api/createFeedback -H "Content-Type: application/json" -d '{
  "username": "John Doe",
  "email": "john@example.com",
  "type": "feedback",
  "collab": true,
  "message": "This is a feedback message."
}'
```


#### Read Feedbacks

- **Endpoint:** `/api/readFeedbacks/`
- **Method:** GET
- **Description:** Retrieve feedback entries from the database.

#### Testing Read Feedbacks

You can test the read feedbacks route using curl:

#### To retrieve feedback of type "feedback"
`
curl http://localhost:3000/api/readFeedbacks
`

### Database

This project uses MongoDB as the database, and Mongoose as the ODM (Object Data Modeling) library. The schema and data models are defined using Mongoose in the code.
