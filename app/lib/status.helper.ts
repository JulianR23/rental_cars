import { category, status } from "./memoryDb";

export const statusBase: status = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
};

const categoryBase: category = {
  sedan: "Sedán",
  suv: "SUV",
  truck: "Camioneta",
  coupe: "Coupé",
};

export const statusOptions = Object.values(statusBase);
export const categoryOptions = Object.values(categoryBase);