# March Madness Tracker

[Website](https://mmtracker.vercel.app/mm-website)

A modern, responsive website for live NCAA basketball scores and game insights built with Vite, React, and TypeScript. The project uses Tailwind CSS for styling, shadcn-ui for reusable components, and React Query for data fetching.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [API & Data](#api--data)
- [Deployment](#deployment)
- [Acknowledgements](#acknowledgements)

## Overview

**mm-website** is a sports website that delivers live NCAA basketball scores, upcoming game schedules, and recent results. It categorizes games into "Live," "Upcoming," and "Recent" sections so fans can quickly see which games are in progress and what’s on the horizon. The site also provides navigation to prediction pages and historical game data.

## Features

- **Live Scores:** Real-time display of ongoing games with animated indicators.
- **Upcoming Games:** A schedule of games yet to start with details like game time and location.
- **Game Predictions:** Predictions for matchups happening in the tournament.
- **Recent Results:** Results from completed games.
- **API Integration:** Fetches live data from an NCAA scores API and categorizes the games.

## Technologies Used

- **Vite:** Fast build tool and development server.
- **React & TypeScript:** Modern UI library with type safety.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **React Query:** Data-fetching library that simplifies API requests.
- **Vercel:** Deployment platform (see [Deployment](#deployment)).

## Project Structure

Here's an overview of the main folders and files:

- **`src/`** – Contains the application source code.
  - **`components/`** – Reusable UI components (e.g., `ScoreCard.tsx`, `StatsCard.tsx`, `Layout.tsx`).
  - **`pages/`** – Page components for routing (e.g., `Index.tsx`, `History.tsx`, `Predictions.tsx`).
  - **`services/`** – API integration logic. For example, `ncaaApi.ts` handles fetching and transforming NCAA basketball scores.
  - **`lib/` and `hooks/`** – Utility functions and custom React hooks.
- **`api/`** - Contains API integration to get predictions from a blob storage.
- **Configuration Files:**
  - **`tsconfig.json`** – TypeScript configuration.
  - **`vercel.json`** – Vercel deployment configuration.

## API & Data

The project fetches NCAA basketball scores from an API endpoint. In `src/services/ncaaApi.ts`, the function `fetchBasketballScores` retrieves data from the `/api/ncaa-live-scores` endpoint (the base URL is currently set to an empty string and may need updating). The API response is transformed into a simpler shape and categorized into live, upcoming, and recent games using the helper function `categorizeGames`.

> **Note:** Ensure the API endpoint is configured properly before deployment.

## Deployment

This project is configured to be deployed on [Vercel](https://vercel.com). The `vercel.json` file contains necessary configuration for deployment. To deploy:

1. Push your code to GitHub.
2. Import your repository into Vercel.
3. Configure your environment variables (if any) on Vercel’s dashboard.
4. Deploy!

## Acknowledgements

- Thanks to [ncaa-api by henrygd](https://github.com/henrygd/ncaa-api) for making it easier to fetch NCAA data for free.
- Thanks to [Vercel] (https://vercel.com/) for allowing broke devs like me to host for free.
---
