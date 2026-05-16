import { BarChart3, Boxes, Building2, ClipboardList, Headphones, Home, Map, Receipt, Route, Truck, Users } from 'lucide-react';

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'shipments', label: 'Shipments', icon: ClipboardList },
  { id: 'fleet', label: 'Fleet', icon: Truck },
  { id: 'drivers', label: 'Drivers', icon: Users },
  { id: 'warehouses', label: 'Warehouses', icon: Building2 },
  { id: 'routes', label: 'Routes', icon: Route },
  { id: 'tracking', label: 'Live Tracking', icon: Map },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'support', label: 'Support', icon: Headphones },
  { id: 'inventory', label: 'Inventory Flow', icon: Boxes },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
];
