# Firebase Functions

This directory contains the Firebase Cloud Functions for the SuperStore application.

## Setup

1. Install dependencies:
   ```bash
   cd functions
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Firebase project details.

3. Start the local emulator:
   ```bash
   npm run serve
   ```

## Available Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run serve`: Start the local emulator
- `npm run deploy`: Deploy functions to Firebase
- `npm run logs`: View function logs

## Functions

- `setAdminRole`: Sets admin privileges for a user
- `isUserAdmin`: Checks if a user has admin privileges

## Development

- The source code is in the `src` directory
- Compiled JavaScript is output to the `lib` directory
- The emulator runs on http://localhost:5001 by default
