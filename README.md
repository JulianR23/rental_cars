# RentCar - Sistema de Alquiler de Vehículos

Este proyecto es una aplicación web desarrollada con **Next.js 14**, **TypeScript** y **Material UI**, que permite la gestión de un sistema de alquiler de vehículos.  
Cuenta con un **módulo administrativo** para gestionar autos y un **módulo público** para que los usuarios puedan registrarse, explorar vehículos y realizar reservas.

## Cómo levantar el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/rentcar.git
cd rentcar

npm install
npm dev
```
El proyecto se levantará en http://localhost:3000
También se encuentra desplegado en Vercel con el enlace: https://rental-cars-phi.vercel.app/

Decsiones tomadas:
### 1. Arquitectura

Se usó la arquitectura de Next.js App Router, organizada en `/app` con las siguientes subcarpetas:

- **/admin** → Módulo administrativo  
- **/api** → Endpoint de carga de imágenes  
- **/car** → Página para cada auto y reserva  
- **/cars** → Listado público de los autos disponibles  
- **/components** → Componentes reutilizables  
- **/config** → Configuración general del proyecto  
- **/lib** → Base de datos en memoria y utilidades  
- **/my-bookings** → Página para ver las reservas del usuario  
- **/seed** → Semilla para autos iniciales  
- **/select-user** → Registro y selección de usuario (cliente/admin)  
- **/styles** → Estilos globales y módulos CSS  


### 2. Almacenamiento

Se implementó un memoryDb como almacenamiento en memoria para poder simular las operaciones CRUD sin una base de datos real.
Se usa localStorage para que puedan persistir los datos del usuario y de los autos.

### 3. Roles
Si el usuario es administrador o isAdmin = true, puede acceder al módulo administrativo.

### 4. Interfaz
Se utiliza Material UI para los componentes visuales.
Se aplican diseños limpios con CSS modular.

