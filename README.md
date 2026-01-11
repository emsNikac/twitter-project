Twitter Clone (Mobile + API)

A simplified Twitter/X clone built as a learning project, featuring
authentication, tweets, likes, retweets, and follow/unfollow
functionality.

------------------------------------------------------------------------

Project Structure

This repository contains both the backend API and the mobile
application:

-   twitter-backend/ – NestJS REST API
-   twitter-mobile/ – React Native (Expo) mobile app

The mobile app communicates with the backend via a REST API secured
using JWT authentication.

------------------------------------------------------------------------

Running the Project Locally

Requirements

-   Node.js (v18+ recommended)
-   npm or yarn
-   Expo CLI
-   Android Studio or physical device
-   Git

------------------------------------------------------------------------

Backend (NestJS API)

    cd twitter-backend
    npm install
    npm run start:dev

The backend will start on: http://localhost:3000

Backend responsibilities: - User authentication (JWT) - User profiles -
Follow / unfollow users - Tweets, likes, and retweets - Feed generation

Note: In-memory storage only (no database).

------------------------------------------------------------------------

Mobile App (React Native + Expo)

    cd twitter-mobile
    npm install
    npx expo start

Then: - Press a to open Android emulator - Or scan QR code with Expo Go

Android emulator networking: http://10.0.2.2:3000

------------------------------------------------------------------------

Architecture Overview

Backend

-   NestJS modular architecture
-   Controllers, services, DTOs
-   JWT authentication
-   REST API

Mobile

-   React Native + Expo
-   Context API (AuthContext, TweetsContext)
-   Axios API layer
-   React Navigation

------------------------------------------------------------------------

Features

-   User authentication
-   Tweets, likes, retweets
-   Follow / unfollow users
-   User profiles
-   Feed with engagement state
-   Logout

------------------------------------------------------------------------

Technologies Used

Backend: - NestJS - TypeScript - Node.js - JWT - bcrypt

Mobile: - React Native - Expo - TypeScript - Axios - React Navigation

------------------------------------------------------------------------
