import { Car, memoryDb, saveToLocalStorage } from './memoryDb';

export function createCar(item: Omit<Car, 'id'>): Car {
  const id = Date.now().toString();
  const newCar: Car = { ...item, id };
  memoryDb.cars.push(newCar);
  saveToLocalStorage();
  return newCar;
}

export function updateCar(id: string, item: Car): Car | null {
  const idx = memoryDb.cars.findIndex(c => c.id === id);
  if (idx >= 0) memoryDb.cars[idx] = { ...item, id };
  const updatedCar = { ...item, id};

  memoryDb.cars[idx] = updatedCar;
  saveToLocalStorage();
  return updatedCar;
}

export function markCarUnavailable(id: string): boolean {
  const idx = memoryDb.cars.findIndex(c => c.id === id);
  if (idx === -1) return false;

  memoryDb.cars[idx].available = false;
  saveToLocalStorage();
  return true;
}
