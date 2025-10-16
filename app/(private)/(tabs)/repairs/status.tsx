import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ActualizarEstadoScreen() {
  const [estado, setEstado] = useState("En progreso");
  const [nuevoEstado, setNuevoEstado] = useState("");

  // ======== función para asignar color según estado ========
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Pendiente":
      case "Revisión":
      case "En progreso":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-800", // fondo adaptado a modo oscuro
          text: "text-yellow-800 dark:text-yellow-100", // texto inverso
          border: "border-yellow-300 dark:border-yellow-700",
        };
      case "Completo":
        return {
          bg: "bg-green-100 dark:bg-green-800",
          text: "text-green-800 dark:text-green-100",
          border: "border-green-300 dark:border-green-700",
        };
      case "Cancelado":
        return {
          bg: "bg-red-100 dark:bg-red-800",
          text: "text-red-800 dark:text-red-100",
          border: "border-red-300 dark:border-red-700",
        };
      default:
        return {
          bg: "bg-background-50",
          text: "text-typography-900",
          border: "border-background-200",
        };
    }
  };

  const estadoColors = getEstadoColor(estado);

  return (
    <View className="flex-1 bg-background-100 items-center" style={{backgroundColor: "#193456"}}>
      {/* Header */}

      {/* Título */}
      <Text className="text-3xl font-extrabold text-white"
              style={{ color: "#FFB74D", marginTop: 40}}>
        Actualizar Estado
      </Text>

      {/* Card principal */}
      <View className="bg-background-50 w-[90%] rounded-xl p-5 items-center border border-4" style={{margin: 40}}>
        {/* Imagen del equipo */}
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/4824/4824793.png",
          }}
          className="w-20 h-20 mb-3"
        />

        {/* Información del cliente */}
        <View className="items-center mb-4">
          <Text className="font-bold text-base text-typography-900">
            # 201354
          </Text>
          <Text className="text-base text-typography-900">Michelle Garza</Text>
          <Text className="text-sm text-typography-900">iPhone 14 Pro</Text>
          <Text className="text-xs text-typography-900 opacity-70">
            No funciona
          </Text>
        </View>

        {/* Estado actual */}
        <View className="w-full mb-3">
          <Text className="text-xl font-bold mb-1 text-typography-900">
            Estado actual
          </Text>
          <View
            className={`p-3 rounded-md items-center border ${estadoColors.bg} ${estadoColors.border}`}
          >
            <Text className={`font-bold ${estadoColors.text}`}>{estado}</Text>
          </View>
        </View>

        {/* Cambiar estado */}
        <View className="w-full mb-5">
          <Text className="text-xl font-bold mb-1 text-typography-900">
            Cambiar estado
          </Text>
          <View className="border border-background-200 rounded-md bg-background-50">
            <Picker
              selectedValue={nuevoEstado}
              onValueChange={(itemValue) => {
                setNuevoEstado(itemValue);
                if (itemValue) setEstado(itemValue);
              }}
            >
              <Picker.Item label="Seleccionar estado" value="" />
              <Picker.Item label="Pendiente" value="Pendiente" />
              <Picker.Item label="Revisión" value="Revisión" />
              <Picker.Item label="En progreso" value="En progreso" />
              <Picker.Item label="Completo" value="Completo" />
              <Picker.Item label="Cancelado" value="Cancelado" />
            </Picker>
          </View>
        </View>

        {/* Botones */}
        <TouchableOpacity className="bg-green-600 w-4/5 py-2 rounded-md items-center mb-3">
          <Text className="text-2xl text-white font-bold">Guardar</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-red-600 w-4/5 py-2 rounded-md items-center">
          <Text className="text-2xl text-white font-bold">Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
