import express from 'express';
import cors from 'cors';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || 'logiflow_demo_secret_change_me';

const users = [
  { id: 1, name: 'Avery Johnson', email: 'admin@logiflow.ai', password: 'password123', role: 'Admin' },
  { id: 2, name: 'Maya Carter', email: 'fleet@logiflow.ai', password: 'password123', role: 'Fleet Manager' },
  { id: 3, name: 'Daniel Reed', email: 'driver@logiflow.ai', password: 'password123', role: 'Driver' }
];

const dashboard = {
  kpis: {
    activeShipments: '982',
    fleetUtilization: '87%',
    onTimeDelivery: '94%',
    revenue: '$428K'
  },
  shipmentTrend: [
    { day: 'Mon', shipments: 620 }, { day: 'Tue', shipments: 730 }, { day: 'Wed', shipments: 690 },
    { day: 'Thu', shipments: 810 }, { day: 'Fri', shipments: 940 }, { day: 'Sat', shipments: 760 }, { day: 'Sun', shipments: 680 }
  ],
  deliveryStatus: [
    { name: 'In Transit', value: 420 }, { name: 'Delivered', value: 350 }, { name: 'Pending', value: 168 }, { name: 'Delayed', value: 44 }
  ],
  warehouses: [
    { name: 'North Hub', capacity: 78 }, { name: 'South Hub', capacity: 62 }, { name: 'East Hub', capacity: 84 }, { name: 'West Hub', capacity: 56 }
  ],
  fleetPerformance: [
    { month: 'Jan', utilization: 72, maintenance: 18 }, { month: 'Feb', utilization: 78, maintenance: 16 },
    { month: 'Mar', utilization: 81, maintenance: 14 }, { month: 'Apr', utilization: 87, maintenance: 12 },
    { month: 'May', utilization: 85, maintenance: 13 }, { month: 'Jun', utilization: 90, maintenance: 10 }
  ],
  shipments: [
    { trackingid: 'LGF-2026-1001', customer: 'GreenMart Ltd.', route: 'Dhaka → Chittagong', status: 'In Transit', eta: '4h 20m' },
    { trackingid: 'LGF-2026-1002', customer: 'Metro Electronics', route: 'Shenzhen → Guangzhou', status: 'Delivered', eta: 'Completed' },
    { trackingid: 'LGF-2026-1003', customer: 'Nova Pharma', route: 'Taipei → Kaohsiung', status: 'Pending Pickup', eta: '2h 10m' },
    { trackingid: 'LGF-2026-1004', customer: 'Fresh Foods', route: 'Sylhet → Dhaka', status: 'Delayed', eta: '8h 45m' }
  ],
  fleet: [
    { vehicle: 'TRK-901', driver: 'Hasan Ali', location: 'Dhaka Ring Road', status: 'Active', load: '78%' },
    { vehicle: 'VAN-214', driver: 'Mei Lin', location: 'Warehouse East', status: 'Loading', load: '42%' },
    { vehicle: 'TRK-338', driver: 'Omar Khan', location: 'Highway A2', status: 'Maintenance', load: '0%' },
    { vehicle: 'VAN-558', driver: 'Nina Park', location: 'City Zone 4', status: 'Active', load: '66%' }
  ],
  drivers: [
    { name: 'Hasan Ali', phone: '+880 1711 000001', route: 'Dhaka → CTG', status: 'On Route', rating: '4.8' },
    { name: 'Mei Lin', phone: '+86 155 0000 1020', route: 'Guangzhou Local', status: 'Loading', rating: '4.9' },
    { name: 'Omar Khan', phone: '+880 1811 000002', route: 'Standby', status: 'Unavailable', rating: '4.6' },
    { name: 'Nina Park', phone: '+886 912 000 104', route: 'Taipei Local', status: 'On Route', rating: '4.7' }
  ],
  warehousesTable: [
    { name: 'North Hub', region: 'Dhaka', capacity: '78%', inbound: '134', outbound: '186' },
    { name: 'South Hub', region: 'Chittagong', capacity: '62%', inbound: '98', outbound: '120' },
    { name: 'East Hub', region: 'Sylhet', capacity: '84%', inbound: '76', outbound: '95' },
    { name: 'West Hub', region: 'Rajshahi', capacity: '56%', inbound: '64', outbound: '72' }
  ],
  routes: [
    { route: 'Dhaka → Chittagong', distance: '265 km', stops: '6', status: 'Optimized', cost: '$420' },
    { route: 'Taipei → Kaohsiung', distance: '352 km', stops: '4', status: 'Active', cost: '$510' },
    { route: 'Shenzhen → Guangzhou', distance: '136 km', stops: '3', status: 'Completed', cost: '$240' },
    { route: 'Sylhet → Dhaka', distance: '240 km', stops: '5', status: 'Delayed', cost: '$390' }
  ],
  tracking: [
    { vehicle: 'TRK-901', location: 'Narayanganj', speed: '62 km/h', shipment: 'LGF-2026-1001', updated: '2 min ago' },
    { vehicle: 'VAN-558', location: 'Taipei Xinyi', speed: '34 km/h', shipment: 'LGF-2026-1008', updated: '1 min ago' },
    { vehicle: 'TRK-777', location: 'Guangzhou', speed: '48 km/h', shipment: 'LGF-2026-1011', updated: '4 min ago' }
  ],
  invoices: [
    { invoice: 'INV-9001', customer: 'GreenMart Ltd.', amount: '$4,800', status: 'Paid', due: 'Completed' },
    { invoice: 'INV-9002', customer: 'Nova Pharma', amount: '$2,350', status: 'Pending', due: '2026-06-02' },
    { invoice: 'INV-9003', customer: 'Fresh Foods', amount: '$1,980', status: 'Overdue', due: '2026-05-10' }
  ],
  support: [
    { ticket: 'SUP-1101', customer: 'Fresh Foods', issue: 'Delayed refrigerated truck', priority: 'High', status: 'Open' },
    { ticket: 'SUP-1102', customer: 'Metro Electronics', issue: 'Invoice clarification', priority: 'Low', status: 'Resolved' },
    { ticket: 'SUP-1103', customer: 'Nova Pharma', issue: 'Pickup reschedule', priority: 'Medium', status: 'In Progress' }
  ],
  inventory: [
    { item: 'Electronics Pallet', warehouse: 'North Hub', quantity: '320', movement: 'Outbound', status: 'Ready' },
    { item: 'Medical Supplies', warehouse: 'South Hub', quantity: '180', movement: 'Inbound', status: 'Checking' },
    { item: 'Cold Chain Boxes', warehouse: 'East Hub', quantity: '95', movement: 'Transfer', status: 'Moving' }
  ],
  analytics: [
    { metric: 'Average Delivery Time', current: '21.4h', target: '20h', trend: '-7%', status: 'Improving' },
    { metric: 'Fuel Cost / km', current: '$0.84', target: '$0.78', trend: '+2%', status: 'Watch' },
    { metric: 'Customer Satisfaction', current: '92%', target: '95%', trend: '+4%', status: 'Good' }
  ]
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] } });

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ ok: true, service: 'LogiFlow API' }));

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).send('Invalid email or password');
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

app.get('/api/dashboard', (_, res) => res.json(dashboard));

const alerts = [
  'Route DHK-CTG has heavy traffic near Comilla checkpoint.',
  'Warehouse East reports capacity above 84%.',
  'Shipment LGF-2026-1004 requires delay approval.',
  'Vehicle TRK-338 maintenance check is pending.',
  'Customer Nova Pharma requested pickup reschedule.'
];

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
});

setInterval(() => {
  io.emit('operation-alert', alerts[Math.floor(Math.random() * alerts.length)]);
}, 9000);

server.listen(PORT, () => {
  console.log(`LogiFlow API running at http://localhost:${PORT}`);
});
