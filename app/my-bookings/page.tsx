'use client';

import { useEffect, useState } from 'react';
import { Booking, Car, memoryDb } from '@/app/lib/memoryDb';
import { useRouter } from 'next/navigation';
import Card from '@/app/components/Card';
import { statusBase } from '../lib/status.helper';

interface BookingWithCar extends Booking {
  car: Car | null;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithCar[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) {
      alert('Primero selecciona un usuario');
      router.push('/select-user');
      return;
    }

    const userBookings = memoryDb.bookings
      .filter(booking => booking.userId === userId)
      .map(booking => ({
        ...booking,
        car: memoryDb.cars.find(car => car.id === booking.carId) || null
      }));

    setBookings(userBookings);
  }, [router]);

  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Mis Reservas</h1>
        <p className="mt-4 text-gray-600">No tienes reservas todavía.</p>
      </div>
    );
  }
  {bookings.map((booking) => { const statusText = statusBase[booking.status] || booking.status; })}


 return (
  <div className="p-6 max-w-5xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Reservas Realizadas</h1>

    <div className="space-y-6">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          bookingId={booking.id}
          image={booking.car?.imageUrl[0] || '/placeholder.png'}
          brand={booking.car?.brand || 'Marca no disponible'}
          model={booking.car?.model || 'Modelo no disponible'}
          location="Medellín - Centro"
          startDate={booking.startDate}
          endDate={booking.endDate}
          total={booking.totalPrice}
          status={statusBase[booking.status] || booking.status}
        />
      ))}
    </div>
  </div>
);

}
