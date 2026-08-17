# RentEase

RentEase is a rental marketplace for furniture, appliances, and electronics. It includes user-facing rental browsing, cart and checkout flows, order tracking, maintenance requests, and an admin dashboard for managing inventory and rental operations.

## Features
- User registration and login with JWT auth.
- Product browsing with search and category filters.
- Cart management and checkout.
- Order history for users.
- Support and maintenance requests for customers.
- Admin dashboard with KPI overview and management of products, orders, and maintenance.

## Architecture
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- State management: Redux Toolkit
- Styling: Tailwind CSS

## Setup
1. Install dependencies
   - `npm install` in project root
   - or `npm run install-all` to install both `server` and `client` dependencies
2. Set environment variables in `server/.env` or copy `server/.env.example`
3. Run the backend
   - `npm run start-server` or `npm run --prefix server dev`
4. Run the frontend
   - `npm run start-client` or `npm run --prefix client dev`
5. Run both locally
   - `npm run dev`

## Admin Dashboard KPIs
- Total users
- Total products
- Total orders
- Revenue
- Active rentals
- Product utilization
- Customer retention
- Average maintenance resolution time

## Notes
The project includes the PRD in `PRD.md`, a deployment-ready client build, and root-level scripts for install and development.
