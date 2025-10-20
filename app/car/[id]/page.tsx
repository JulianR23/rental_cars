'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Car, Booking, memoryDb, saveToLocalStorage } from '@/app/lib/memoryDb';
import Image from 'next/image';
import { markCarUnavailable } from '@/app/lib/cars';
import styles from '../../styles/CarDetail.module.css';

import { Alert, Snackbar } from "@mui/material";
import { calculatePriceTotal } from '@/app/lib/utils/CalculatePriceTotal';

type AlertSeverity = 'success' | 'error' | 'warning' | 'info';

export default function CarDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [car, setCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: AlertSeverity;
  }>({ open: false, message: '', severity: 'success' });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const foundCar = memoryDb.cars.find((c) => c.id === id);
    if (foundCar) setCar(foundCar);
  }, [id]);

  useEffect(() => {
    if (!startDate || !endDate || !car) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return;

    const totalPrice = calculatePriceTotal(start, end, car);
    setTotalPrice(totalPrice);
  }, [startDate, endDate, car]);

  const showAlert = (message: string, severity: AlertSeverity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleReserve = () => {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) {
      showAlert('Por favor selecciona un usuario antes de reservar', 'warning');
      router.push('/select-user');
      return;
    }

    if (!car || !startDate || !endDate || !totalPrice) {
      showAlert('Por favor completa todos los campos', 'error');
      return;
    }

    if (!car.available) {
      showAlert('Este auto no está disponible actualmente', 'error');
      return;
    }

    const booking: Booking = {
      id: Date.now().toString(),
      carId: car.id,
      userId,
      startDate,
      endDate,
      totalPrice,
      createAt: new Date().toISOString(),
      status: 'pending',
    };

    memoryDb.bookings.push(booking);
    saveToLocalStorage();
    markCarUnavailable(car.id);
    showAlert('¡Reserva realizada exitosamente!', 'success');
    setTimeout(() => router.push('/'), 1200);
  };

  if (!car) return <div className={styles.notFound}>Auto no encontrado</div>;

  return (
    <div className={styles.container}>
      {/* Snackbar de alertas */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <div className={styles.detailCard}>
        <div className={styles.imageContainer}>
          <Image
            src={car.imageUrl[0]}
            alt={car.model}
            width={500}
            height={350}
            className={styles.image}
          />
        </div>

        <div className={styles.infoContainer}>
          <h1 className={styles.title}>
            {car.brand} {car.model}
          </h1>

          <div className={styles.infoSection}>
            <p><strong>Precio por día:</strong> ${car.pricePerDay}</p>
            <p><strong>Placa:</strong> {car.licensePlate}</p>
            <p><strong>Color:</strong> {car.color}</p>
            <p><strong>Año:</strong> {car.year}</p>
            <p>
              <strong>Disponible:</strong>{' '}
              <span className={car.available ? styles.available : styles.unavailable}>
                {car.available ? 'Sí' : 'No'}
              </span>
            </p>
          </div>

          <hr className={styles.divider} />

          <h2 className={styles.subtitle}>Reserva tu vehículo</h2>
          <div className={styles.formGroup}>
            <label>Fecha de inicio:</label>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (endDate && e.target.value > endDate) setEndDate('');
              }}
            />

            <label>Fecha de fin:</label>
            <input
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => setEndDate(e.target.value)}
            />

            {totalPrice !== null && (
              <p className={styles.total}><strong>Total:</strong> ${totalPrice}</p>
            )}

            <button className={styles.reserveButton} onClick={handleReserve}>
              Reservar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
