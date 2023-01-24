# GOHIGHLEVEL BACKEND DEV HIRING CHALLENGE

Deployment Link - https://ghl-production.up.railway.app/

## Introduction

The purpose of this tool (GHL) is to make appointment booking between people a lot easier. The
usual process is to exchange mails between people till they find a convenient time.

## Installation

### Requirements

- NodeJS 
- NPM
- Firebase account
- `ts-node` installed globally (`npm install -g ts-node`) to run setup script

### Setup

- Clone the repository
- Run `npm install`
- Create a `.env.local` file in the root of the project and add the following variables:
  
  ```
  AVAILABILITY_START_TIME=9
  AVAILABILITY_END_TIME=11
  DURATION=30
  TIMEZONE=America/Los_Angeles
  ```

- Create a Firebase project and add initialize Firestore Database
- Create a service account for the project and add the credential file to `src/config/serviceAccount.json`
- Run `ts-node command/setup.ts` to create the database structure
- Run `npm run dev` to start the development server

## Usage

View the API documentation at [API Docs](https://ghl-production.up.railway.app/api-docs/)

## Testing

Run `npm run test` to run the test suite.

## Deployment

This project is deployed on Heroku. The database is hosted on Firebase.

## License

MIT
