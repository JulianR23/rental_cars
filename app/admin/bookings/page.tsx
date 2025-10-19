"use client";

import { calculatePriceTotal } from "@/app/lib/utils/CalculatePriceTotal";
import { CrudPage } from "../../components/CrudBase";
import { memoryDb, Booking, saveToLocalStorage } from "../../lib/memoryDb";
import { statusOptions } from "@/app/lib/status.helper";
import { useState } from "react";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function BookingsPage() {
  const [startDate, setStartDate] = useState<string>("");

  const fetchAll = async () => {
    await delay(100);
    return memoryDb.bookings;
  };

  const createItem = async (item: Booking) => {
    const id = Date.now().toString();

    const car = memoryDb.cars.find((c) => c.id === item.carId);
    if (!car) throw new Error("Auto no encontrado");

    if (!car.available) {
      throw new Error("El auto no está disponible para reservar");
    }

    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      throw new Error("La fecha de inicio no puede ser anterior a hoy");
    }
    if (end < start) {
      throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio");
    }

    const totalPrice = calculatePriceTotal(start, end, car);

    memoryDb.bookings.push({ ...item, id, totalPrice });

    const carIndex = memoryDb.cars.findIndex((c) => c.id === item.carId);
    if (carIndex >= 0) {
      memoryDb.cars[carIndex].available = false;
    }

    saveToLocalStorage();
  };

  const updateItem = async (id: string, item: Booking) => {
    const idx = memoryDb.bookings.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const oldBooking = memoryDb.bookings[idx];
    const car = memoryDb.cars.find((c) => c.id === item.carId);
    if (!car) throw new Error("Auto no encontrado");

    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      throw new Error("La fecha de inicio no puede ser anterior a hoy");
    }
    if (end < start) {
      throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio");
    }

    const totalPrice = calculatePriceTotal(start, end, car);

    if (oldBooking.carId !== item.carId) {
      const oldCarIndex = memoryDb.cars.findIndex((c) => c.id === oldBooking.carId);
      if (oldCarIndex >= 0) {
        memoryDb.cars[oldCarIndex].available = true;
      }

      const newCarIndex = memoryDb.cars.findIndex((c) => c.id === item.carId);
      if (newCarIndex >= 0) {
        if (!memoryDb.cars[newCarIndex].available) {
          throw new Error("El auto seleccionado no está disponible");
        }
        memoryDb.cars[newCarIndex].available = false;
      }
    }

    memoryDb.bookings[idx] = { ...item, id, totalPrice };
    saveToLocalStorage();
  };

  const deleteItem = async (id: string) => {
    const booking = memoryDb.bookings.find((b) => b.id === id);

    if (booking) {
      const carIndex = memoryDb.cars.findIndex((c) => c.id === booking.carId);
      if (carIndex >= 0) {
        memoryDb.cars[carIndex].available = true;
      }
    }

    memoryDb.bookings = memoryDb.bookings.filter((b) => b.id !== id);
    saveToLocalStorage();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <CrudPage<Booking>
      fetchAll={fetchAll}
      createItem={createItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
      idField="id"
      fields={[
        { name: "userId", label: "ID del Usuario" },
        { name: "carId", label: "ID del Auto" },
        {
          name: "startDate",
          label: "Fecha de Inicio",
          type: "date",
          min: today,
          onChange: (value: string) => setStartDate(value),
        },
        {
          name: "endDate",
          label: "Fecha de Fin",
          type: "date",
          min: startDate || today,
        },
        {
          name: "totalPrice",
          label: "Precio Total",
          type: "number",
          readOnly: true,
        },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: statusOptions,
        },
      ]}
    />
  );
}
