'use client';
import React from 'react';
import styles from '../styles/Card.module.css';
import Image from 'next/image';

interface CardProps {
  image: string;
  bookingId: string;
  brand: string;
  model: string;
  location: string;
  startDate: string;
  endDate: string;
  total: number;
  status: string;
}

export default function Card({
  image,
  bookingId,
  brand,
  model,
  location,
  startDate,
  endDate,
  total,
  status,
}: CardProps) {
  return (
    <div className={styles.cardContainer}>
      <Image src={image} alt={model} width={140} height={90} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>Reserva #{bookingId}</div>
        <p className={styles.cardText}><strong>Fechas:</strong> {startDate} - {endDate}</p>
        <p className={styles.cardText}><strong>Ubicación:</strong> {location}</p>
        <p className={styles.cardText}><strong>Total:</strong> ${total}</p>
        <p className={styles.cardText}><strong>Estado:</strong> {status}</p>
        <p className={styles.cardText}>{brand} {model}</p>
      </div>
    </div>
  );
}
