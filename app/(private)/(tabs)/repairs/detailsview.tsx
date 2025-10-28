import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function DetallesEquipoView() {
  const cliente = {
    nombre: "Juan Pérez",
    telefono: "8123456789",
    email: "juan@example.com",
  };

  const equipo = {
    marca: "Samsung",
    modelo: "Galaxy S21",
    imei: "123456789012345",
    descripcion: "Pantalla rota y falla en el táctil.",
  };

  const piezas = [
    { id: 1, name: "Pantalla LCD", cost: 120, quantity: 1 },
    { id: 2, name: "Batería", cost: 45, quantity: 1 },
  ];

  const laborCost = 50;
  const partsCost = piezas.reduce((acc, p) => acc + p.cost * p.quantity, 0);
  const totalCost = laborCost + partsCost;

  const notas =
    "Se cambió pantalla y batería. Se probó completamente y el equipo funciona correctamente.";

  const firma = "https://i.imgur.com/QbU7L1K.png"; // ejemplo de imagen de firma

  return (
    <ScrollView
      className="flex-1 bg-background-50 p-5"
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* ENCABEZADO */}
      <Text className="text-3xl font-bold text-center text-typography-900 mb-6">
        Detalles de la Reparación
      </Text>

      {/* DATOS DEL CLIENTE */}
      <View className="bg-background-100 border border-background-200 rounded-2xl p-5 mb-6">
        <Text className="text-xl font-bold text-typography-900 mb-3">
          Datos del Cliente
        </Text>
        <Text className="text-typography-900 mb-1">
          <Text className="font-semibold">Nombre: </Text>
          {cliente.nombre}
        </Text>
        <Text className="text-typography-900 mb-1">
          <Text className="font-semibold">Teléfono: </Text>
          {cliente.telefono}
        </Text>
        <Text className="text-typography-900">
          <Text className="font-semibold">Correo: </Text>
          {cliente.email}
        </Text>
      </View>

      {/* DATOS DEL EQUIPO */}
      <View className="bg-background-100 border border-background-200 rounded-2xl p-5 mb-6">
        <Text className="text-xl font-bold text-typography-900 mb-3">
          Datos del Equipo
        </Text>
        <Text className="text-typography-900 mb-1">
          <Text className="font-semibold">Marca: </Text>
          {equipo.marca}
        </Text>
        <Text className="text-typography-900 mb-1">
          <Text className="font-semibold">Modelo: </Text>
          {equipo.modelo}
        </Text>
        <Text className="text-typography-900 mb-1">
          <Text className="font-semibold">IMEI / Serie: </Text>
          {equipo.imei}
        </Text>
        <Text className="text-typography-900 mt-3">
          <Text className="font-semibold">Descripción: </Text>
          {equipo.descripcion}
        </Text>
      </View>

      {/* PIEZAS UTILIZADAS */}
      <View className="bg-background-100 border border-background-200 rounded-2xl p-5 mb-6">
        <Text className="text-xl font-bold text-typography-900 mb-3">
          Piezas Utilizadas
        </Text>
        {piezas.map((p) => (
          <View
            key={p.id}
            className="flex-row justify-between bg-background-50 border border-background-200 rounded-xl p-3 mb-2"
          >
            <View>
              <Text className="text-typography-900 font-semibold">
                {p.name}
              </Text>
              <Text className="text-typography-900 text-sm">
                Cantidad: {p.quantity}
              </Text>
            </View>
            <Text className="text-primary-600 font-bold">
              ${p.cost.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* COSTOS */}
      <View className="bg-background-100 border border-background-200 rounded-2xl p-5 mb-6">
        <Text className="text-xl font-bold text-typography-900 mb-3">
          Costos de la Reparación
        </Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-typography-900 font-semibold">
            Mano de obra
          </Text>
          <Text className="text-primary-600 font-bold">
            ${laborCost.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-typography-900 font-semibold">Piezas</Text>
          <Text className="text-primary-600 font-bold">
            ${partsCost.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between border-t border-background-200 pt-2">
          <Text className="text-typography-900 font-bold">Total</Text>
          <Text className="text-primary-600 font-bold">
            ${totalCost.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* NOTAS */}
      <View className="bg-background-100 border border-background-200 rounded-2xl p-5 mb-6">
        <Text className="text-xl font-bold text-typography-900 mb-3">
          Notas
        </Text>
        <Text className="text-typography-900">{notas}</Text>
      </View>

      {/* FIRMA */}
      <View className="bg-background-100 border border-background-200 rounded-2xl p-5 items-center mb-6">
        <Text className="text-xl font-bold text-typography-900 mb-3">
          Firma del Cliente
        </Text>
        <View className="w-full border border-background-200 rounded-xl bg-background-50 p-3 items-center">
          {firma ? (
            <Image
              source={{ uri: firma }}
              style={{ width: "100%", height: 120, resizeMode: "contain" }}
            />
          ) : (
            <Text className="text-typography-900/70 italic">
              (Sin firma registrada)
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
