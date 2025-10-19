export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface category {
  sedan: string;
  suv: string;
  truck: string;
  coupe: string;
}

export interface status {
  pending: string;
  confirmed: string;
  cancelled: string;
  completed: string;
}

export interface Car {
  id: string;
  model: string;
  brand: string;
  available: boolean;
  pricePerDay: number;
  imageUrl: string[];
  color?: string;
  year?: number;
  licensePlate: string;
  category?: keyof category;
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  createAt: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: keyof status;
}

// Función helper para verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';

const getFromLocalStorage = <T>(key: string, defaultValue: T[]): T[] => {
  if (!isClient) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const memoryDb = {
  users: getFromLocalStorage<User>('users', []),
  cars: getFromLocalStorage<Car>('cars', []),
  bookings: getFromLocalStorage<Booking>('bookings', []),
};

export function saveToLocalStorage() {
  if (!isClient) return;
  
  try {
    localStorage.setItem('users', JSON.stringify(memoryDb.users));
    localStorage.setItem('cars', JSON.stringify(memoryDb.cars));
    localStorage.setItem('bookings', JSON.stringify(memoryDb.bookings));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}