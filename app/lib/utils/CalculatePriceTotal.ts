/**
 * Calcula el precio total de una reserva según las fechas.
 * @param {Date} startDate - Fecha de inicio de la reserva.
 * @param {Date} endDate - Fecha de finalización de la reserva.
 * @param {number} pricePerDay - Costo por día del vehículo.
 * @returns {number} Total a pagar.
 */

export function calculatePriceTotal(startDate: Date, endDate: Date, car: { pricePerDay: number }): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    return diffDays * car.pricePerDay;
}
