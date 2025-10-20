'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { memoryDb, saveToLocalStorage } from '@/app/lib/memoryDb';
import { Snackbar, Alert } from '@mui/material';
import styles from '../styles/SelectUser.module.css';

type AlertSeverity = 'success' | 'error' | 'warning' | 'info';

export default function SelectUserPage() {
  const router = useRouter();
  const [id, setID] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: AlertSeverity;
  }>({ open: false, message: '', severity: 'success' });

  const showAlert = (message: string, severity: AlertSeverity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !name || !email) {
      showAlert('Por favor, completa todos los campos', 'error');
      return;
    }

    const exists = memoryDb.users.some(u => u.id === id);
    if (exists) {
      showAlert('Ya existe un usuario con esta identificación', 'warning');
      return;
    }

    const newUser = {
      id,
      name,
      email,
      isAdmin,
    };

    memoryDb.users.push(newUser);
    saveToLocalStorage();
    localStorage.setItem('currentUserId', newUser.id);

    localStorage.setItem('currentUserId', newUser.id);

    window.dispatchEvent(new Event('userChanged'));
    showAlert('Usuario creado exitosamente', 'success');

    setTimeout(() => {
      const carId = localStorage.getItem('carToBook');
      if (carId) {
        localStorage.removeItem('carToBook');
        router.push(`/car/${carId}`);
      } else {
        router.push('/cars');
      }
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <div className={styles.card}>
        <h1 className={styles.title}>Crear Usuario</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Identificación</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setID(e.target.value)}
              placeholder="Ej: 123456789"
            />
          </div>

          <div className={styles.field}>
            <label>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Julian Clavijo"
            />
          </div>

          <div className={styles.field}>
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: julian@mail.com"
            />
          </div>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            ¿Es administrador?
          </label>

          <button type="submit" className={styles.button}>
            Crear y continuar
          </button>
        </form>
      </div>
    </div>
  );
}
