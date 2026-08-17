# RentEase Product Requirements Document (PRD)

## Overview
RentEase is a rental marketplace for furniture, appliances, and electronics targeting urban users seeking affordable, flexible living solutions.

## User Features
- User registration & login
- Browse products by category:
  - Furniture (bed, sofa, table)
  - Appliances (fridge, washing machine, TV)
- View product details:
  - Rental price
  - Security deposit
  - Rental tenure options
- Add to cart & checkout
- Choose delivery date and location
- Manage active rentals
- Request maintenance support
- View rental history

## Admin / Vendor Features
- Add & manage product inventory
- Set rental pricing & tenure
- Manage delivery & pickup schedules
- Track product availability
- Handle maintenance requests
- Monitor returns and damages

## Admin Feature
- Manage users and inventory
- Monitor orders and rentals
- Handle disputes & damage claims
- Generate reports and analytics
- Manage service areas

## Data Requirements

### Sample Product Data
- Product users: renters who select products and place rental orders.
- Category: furniture, appliances, electronics, etc.
- Monthly rent: recurring rental charge per item.
- Security deposit: refundable deposit to secure each rental.
- Rental tenure options: common tenancy lengths such as 3, 6, and 12 months.

### Sample Business Data
- Name: business or service provider name.
- Skill type: category or specialization for service offerings.
- Services offered: rental delivery, maintenance, installation.
- Product list: inventory of available rental items.
- Pricing: monthly rent, deposit, and any package pricing.

## Key Performance Indicators (KPIs)
- Number of active rentals
- Monthly recurring revenue (MRR)
- Product utilization rate
- Customer retention rate
- Maintenance request resolution time

## Assumptions & Constraints

### Assumptions
- Users prefer rentals over ownership.
- Reliable delivery partners are available.
- Inventory is locally stored.

### Constraints
- Logistics and maintenance costs.
- Product wear and tear.
- Inventory availability limitations.

## Deliverables
- Functional web application.
- Admin dashboard.
- PRD and technical documentation.
- Deployment-ready build.

## Expected Impact
- Affordable living solutions for urban users.
- Reduced financial burden.
- Sustainable product usage.
- Improved rental experience.

## Current Implementation Status

### Implemented
- User authentication and role-based admin access.
- Product catalog with category, monthly rent, deposit, and tenure options.
- Cart, checkout, and order creation flows.
- Rental order tracking and admin order management.
- Maintenance/support request submission and admin resolution.
- Admin dashboard with users, products, orders, revenue, active rentals, utilization, retention, and maintenance resolution metrics.

### Remaining enhancements
- Business data model for service providers and pricing packages.
- More explicit renter-product assignment for utilization tracking.
- Customer retention tracking based on repeat rentals over time.
- Deeper delivery/pickup scheduling and return workflow.
- Full PRD documentation maturity in project repo.
- Manage delivery and pickup schedules in admin flow.
- Track returns, damages, and dispute resolution.
- Model service areas and vendor business data.

## Notes
This PRD document is intentionally designed to reflect the current product vision and help guide the remaining work toward a complete RentEase rental solution.

## Remaining Work
- Add payment integration and a checkout payment step to support real rentals.
- Enforce service-area availability and product inventory status during browsing and checkout.
- Add pickup scheduling and return workflow for end users, including pickup date selection.
- Enhance admin order lifecycle management for approval, delivery, return requests, damage claims, and dispute resolution.
- Add resolved maintenance request workflows and admin updates for request status changes.
- Add a dedicated user profile page with address and phone management.
- Improve UI polish, mobile responsiveness, and user experience consistency.
- Add environment setup documentation and root-level scripts for installing and running both `client` and `server`.
- Add deployment configuration and testing for production readiness.
