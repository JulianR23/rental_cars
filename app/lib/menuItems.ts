import { ROUTES } from './routes';

export const PUBLIC_MENU = [
  { label: 'Rentar', href: ROUTES.cars },
  { label: 'Mis reservas', href: ROUTES.myBookings },
  { label: 'Administrativo', href: ROUTES.admin.root },
];

export const ADMIN_MENU = [
  { label: 'Usuarios', href: ROUTES.admin.users },
  { label: 'Autos', href: ROUTES.admin.cars },
  { label: 'Reservas', href: ROUTES.admin.bookings },
];
