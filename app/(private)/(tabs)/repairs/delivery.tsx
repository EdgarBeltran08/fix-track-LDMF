import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// IMPORTAR LA FUNCIÓN DE REPOSITORIO NECESARIA
// import { RepairsRepository } from "@/shared/repositories/repairs.repository"; 
// (Descomentar y ajustar la ruta si usas un repositorio)


export default function EntregarEquipo() {
  const [folio, setFolio] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [loading, setLoading] = useState(false); // Nuevo estado de carga

  const [scrollEnabled] = useState(true);

  // --- FUNCIÓN PARA ENTREGAR (ELIMINA LA REPARACIÓN) ---
  const handleEntregar = () => {
    if (!folio.trim()) {
      Alert.alert("Folio requerido", "Por favor, ingresa el número de folio.");
      return;
    }
    if (!nombreCompleto.trim()) {
      Alert.alert(
        "Nombre requerido",
        "Por favor, ingrese el nombre completo de quien recibe el equipo."
      );
      return;
    }

    // Confirmación final antes de eliminar/entregar
    Alert.alert(
      "Confirmar Entrega y Cierre",
      `¿Estás seguro de que deseas confirmar la entrega y eliminar permanentemente la reparación con folio ${folio.trim()}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar Entrega", 
          style: "destructive", // Se usa 'destructive' ya que es una acción final/eliminación
          onPress: async () => {
            setLoading(true);
            try {
              // LÓGICA DE ELIMINACIÓN
              // ⚠️ ASUMIMOS QUE TENEMOS UN MÉTODO PARA ELIMINAR LA REPARACIÓN POR FOLIO O ID
              // await RepairsRepository.delete(folio.trim()); 
              
              // Simulación de éxito después de la eliminación/entrega final
              Alert.alert(
                "¡Éxito!",
                `La reparación con folio ${folio.trim()} ha sido entregada y eliminada del sistema. Entregado a: ${nombreCompleto.trim()}`
              );

              // Regresar a la pantalla de listado principal (ya que el registro no existe más)
              router.replace("/repairs"); 

            } catch (error) {
              console.error("Error al eliminar la reparación:", error);
              Alert.alert("Error", "No se pudo completar la entrega/eliminación. Verifica la conexión.");
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };
  // -----------------------------------------------------

  // --- FUNCIÓN PARA CANCELAR (REGRESA A DETALLES) ---
  const handleCancel = () => {
    Alert.alert("Cancelar", "¿Deseas descartar la entrega y volver a los detalles de la reparación?", [
      { text: "No", style: "cancel" },
      { 
        text: "Sí, Volver", 
        onPress: () => {
          // Asumimos que la pantalla anterior es 'details.tsx' y queremos volver ahí
          router.back(); 
        }
      },
    ]);
  };
  // --------------------------------------------------

  return (
    <ScrollView
      className="flex-1 bg-background-50 p-6"
      scrollEnabled={scrollEnabled}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Encabezado */}
      <View className="items-center mb-6 mt-2">
        <Text className="text-2xl font-bold text-typography-900 mb-3">
          Entregar Equipo
        </Text>
        <Image
          source={require("@/assets/images/delivery-img.png")}
          style={{ width: 100, height: 100, marginBottom: 8 }}
        />

        <Text className="text-center text-typography-900 opacity-70">
          Ingresa el folio para la entrega del equipo reparado
        </Text>
      </View>

      {/* Campo de Folio */}
      <View className="bg-background-100 p-5 rounded-2xl shadow-md border border-background-200 mb-6">
        <Text className="text-typography-900 mb-2 font-semibold">
          Número de folio
        </Text>
        <TextInput
          placeholder="Ej: FT-2025-123456"
          placeholderTextColor="#9CA3AF"
          value={folio}
          onChangeText={setFolio}
          className="border border-background-200 rounded-xl p-4 bg-background-50 text-typography-900"
          editable={!loading}
        />
      </View>

      {/* Confirmación de Entrega */}
      <View className="bg-background-100 p-5 rounded-2xl shadow-md border border-background-200 mb-6">
        <Text className="text-typography-900 mb-3 font-semibold">
          Confirmación de Entrega
        </Text>
        <Text className="text-typography-900 mb-2 text-sm opacity-80">
          Persona que recibe (Nombre Completo)
        </Text>
        <TextInput
          placeholder="Ej: Juan Pérez Sánchez"
          placeholderTextColor="#9CA3AF"
          value={nombreCompleto}
          onChangeText={setNombreCompleto}
          className="border border-background-200 rounded-xl p-4 bg-background-50 text-typography-900"
          editable={!loading}
        />
      </View>

      {/* Advertencia */}
      <View className="flex-row items-start bg-background-50 p-3 rounded-xl border border-background-200">
        <Text className="text-3xl mr-3 text-typography-900">⚠️</Text>
        <Text className="text-typography-900 flex-1">
          Verificar que el folio sea correcto antes de realizar la entrega
        </Text>
      </View>
      
      {/* Botones de acción */}
      <View className="flex-row justify-between gap-4 mb-6 p-4">
        <TouchableOpacity
          onPress={handleEntregar}
          disabled={loading}
          className={`flex-1 rounded-xl p-4 border border-background-200 ${loading ? 'bg-success-300' : 'bg-success-400'}`}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-background-50 text-center font-bold text-lg">
              Entregar
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancel}
          disabled={loading}
          className={`flex-1 rounded-xl p-4 border border-background-200 ${loading ? 'opacity-50 bg-background-200' : 'bg-background-200'}`}
        >
          <Text className="text-typography-900 text-center font-bold text-lg">
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}