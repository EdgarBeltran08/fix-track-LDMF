import { number, object, string } from "yup";

export const createRepairSchema = object({
  customerName: string()
    .required("El nombre del cliente es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  customerEmail: string()
    .email("Ingresa un correo electrónico válido")
    .required("El correo electrónico es requerido"),
  customerPhone: string()
    .required("El teléfono es requerido")
    .min(10, "El teléfono debe tener al menos 10 dígitos"),
  deviceModel: string()
    .required("El modelo del dispositivo es requerido")
    .min(2, "El modelo debe tener al menos 2 caracteres"),
  issueDescription: string()
    .required("La descripción del problema es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  estimatedCost: number()
    .required("El costo estimado es requerido")
    .min(0, "El costo estimado debe ser mayor o igual a 0")
    .typeError("Debe ser un número válido"),
});
