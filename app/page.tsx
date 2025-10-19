'use client';

import Link from 'next/link';
import styles from './styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Alquiler de Carros JC</h1>
        <p className={styles.subtitle}>
          Tu viaje comienza aquí. Encuentra el vehículo perfecto para tus aventuras.
        </p>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <img
            src="/cars/1760855466738-f8tributo.jpeg"
            alt="Auto destacado"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}>
            <h2 className={styles.heroText}>Reserva fácil y rápido</h2>
            <Link href="/cars" className={styles.heroButton}>
              Ver Autos Disponibles
            </Link>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Alquiler de Carros JC. Todos los derechos reservados.
      </footer>
    </div>
  );
}
