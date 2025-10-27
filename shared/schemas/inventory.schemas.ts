import * as yup from "yup";

export const createInventoryItemSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre del repuesto es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  unitCost: yup
    .string()
    .required("El costo unitario es requerido")
    .test("is-valid-number", "Debe ser un número válido mayor a 0", (value) => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }),
  sku: yup.string().optional(),
  category: yup
    .string()
    .required("La categoría es requerida")
    .notOneOf([""], "Debe seleccionar una categoría"),
});
