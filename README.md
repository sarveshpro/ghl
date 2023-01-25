# GOHIGHLEVEL BACKEND DEV HIRING CHALLENGE

Frontend Url - https://ghl-frontend.vercel.app/

Backend Url - https://ghl-production.up.railway.app/

API Docs - https://ghl-production.up.railway.app/api-docs/ (incomplete)


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

## Tech Stack

### Database

I have used firestore as the database in this project. there is a single collection called `events` which consists of the following properties -

- startTime(Timestamp) - session start time
- endTime(Timestamp) - session end time
- metadata(optional object) - was intended to support custom form data like name, email, phone. but did not implement.

### Backend App

For backend application I went for a typescript-express stack. I used the `typescript-express-starter` template to initialize the project.

### Logic for some important functionality

#### Generating Free Slots

1. get date range, event duration and timezone in query
2. validate input for invalid date range, duration and timezone
3. get all time slots in date range, divide time by duration in minutes and store start time of each slot in an array
4. filter slots to keep only the ones that fall inside the owner's availability time range
5. compare with events to check for conflict that fall within the requested time range (in actual implementation I missed this part and I am camparing with all events. this can be improved)
3. for the remaining slots which do not have any conflict, convert the time to user timezone and return to the user.

#### Creating a new event

1. get start time and duration in request
2. check if slot is in the owner's availability time range
3. check for any overlap with existing events
4. create event

## Testing

Run `npm run test` to run the test suite.

## Deployment

This project is deployed on Railway. The database is hosted on Firebase.
