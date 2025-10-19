'use client';
import { CrudPage } from "../../components/CrudBase";
import { memoryDb, saveToLocalStorage, Car } from "../../lib/memoryDb";
import { categoryOptions } from "@/app/lib/status.helper";
import { createCar, updateCar } from '@/app/lib/cars';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export default function CarsAdminPage() {
  const fetchAll = async () => {
    await delay(100);
    return memoryDb.cars;
  };

const createItem = async (item: Car) => {
  createCar(item);
};

const updateItem = async (id: string, item: Car) => {
  updateCar(id, item);
};

  const deleteItem = async (id: string) => {
    memoryDb.cars = memoryDb.cars.filter(c => c.id !== id);
    saveToLocalStorage();
  };

  return (
    <CrudPage<Car>
      fetchAll={fetchAll}
      createItem={createItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
      idField="id"
      fields={[
        { name: "id", label: "ID", readOnly: true },
        { name: "brand", label: "Marca" },
        { name: "model", label: "Modelo" },
        { name: "licensePlate", label: "Placa" },
        { name: "year", label: "Año", type: "number" },
        { name: "color", label: "Color" },
        { name: "category", label: "Categoría", type: "select", options: categoryOptions },
        { name: "pricePerDay", label: "Precio por día", type: "number" },
        { name: "imageUrl", label: "Imágenes", type: "file", multiple: true },
        { name: "available", label: "Disponible", type: "boolean" },
      ]}
    />
  );
}