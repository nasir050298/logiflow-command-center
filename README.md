# LogiFlow Command Center

A full-stack **Logistics Command Center** for shipment tracking, fleet management, driver coordination, warehouse operations, delivery status monitoring, route planning, invoicing, customer support, and logistics analytics.

## Features

- Role-based demo login for Admin, Fleet Manager, and Driver
- Executive logistics dashboard with live KPIs
- Shipment tracking and delivery status management
- Fleet and vehicle overview
- Driver management and assignment tracking
- Warehouse capacity and inventory movement summaries
- Route planning and delivery progress overview
- Customer support ticket tracking
- Invoice and payment status overview
- Realtime operations alerts using Socket.IO
- Logistics analytics using Recharts
- Professional blue/orange dashboard UI

## Tech Stack

Frontend:
- React
- Vite
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- Socket.IO Client

Backend:
- Node.js
- Express
- TypeScript
- Socket.IO
- JWT-style demo authentication
- In-memory demo data

## Demo Login

Admin:

```txt
Email: admin@logiflow.ai
Password: password123
```

Fleet Manager:

```txt
Email: fleet@logiflow.ai
Password: password123
```

Driver:

```txt
Email: driver@logiflow.ai
Password: password123
```

## Run Locally

```bash
npm run install:all
npm run dev
```

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:5000
```

## Future Improvements

The current version of LogiFlow Command Center is a portfolio/demo project. In future versions, the following improvements can be added to make the system more complete, scalable, and production-ready:

- Database integration using MongoDB or PostgreSQL for persistent shipment, fleet, driver, warehouse, and invoice data
- Secure authentication with password hashing, JWT refresh tokens, and role-based access control
- Separate dashboards for Admin, Fleet Manager, Driver, Warehouse Manager, Customer Support, and Finance Officer
- Live GPS tracking for vehicles and delivery personnel
- Map-based route visualization and route optimization
- Shipment barcode/QR code scanning
- Proof-of-delivery upload with customer signature and delivery photos
- Driver mobile app for route updates, delivery confirmation, and issue reporting
- Warehouse stock movement tracking with inbound and outbound records
- Vehicle maintenance scheduling and fuel usage tracking
- Customer portal for shipment tracking and support requests
- Automated invoice generation and payment tracking
- Email, SMS, and push notifications for shipment status updates
- AI-based delivery delay prediction using traffic, weather, and route history
- Advanced analytics for delivery performance, fleet utilization, warehouse efficiency, and revenue trends
- Export reports to PDF, Excel, and CSV
- Admin activity logs and audit trail
- Deployment support using Docker, Nginx, and cloud hosting platforms

## Security Notice

This project is for educational, portfolio, and demonstration purposes. It is not production-ready without database integration, secure password hashing, input validation, stronger role permissions, audit logs, and deployment hardening.

## Suggested GitHub Description

A full-stack logistics command center built with React, TypeScript, Express, Socket.IO, and Recharts for shipment tracking, fleet management, driver coordination, warehouse operations, route planning, and logistics analytics.
