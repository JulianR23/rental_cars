'use client';

import { useEffect, useState } from "react";
import { CarsGrid, Title } from "../components";
import { memoryDb, Car } from "../lib/memoryDb";
import { seedCars } from "../seed/seed";

export default function CarPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const availableCars = memoryDb.cars.filter(
      car => car.available && car.imageUrl && car.imageUrl.length > 0
    );
    setCars(availableCars);
    setLoading(false);
  }, []);

  useEffect(() => {
  seedCars();

    const availableCars = memoryDb.cars.filter(
      car => car.available && car.imageUrl && car.imageUrl.length > 0
    );
    setCars(availableCars);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Cargando autos...</p>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="px-5 sm:px-10">
        <Title title="Renta de autos" subtitle="Todos los autos disponibles"/>
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 text-lg">No hay autos disponibles en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 sm:px-10">
      <Title title="Renta de autos" subtitle="Todos los autos disponibles"/>
      <CarsGrid cars={cars}/>
    </div>
  );
}