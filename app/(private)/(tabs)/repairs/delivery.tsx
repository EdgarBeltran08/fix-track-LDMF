import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Signature from "react-native-signature-canvas";

export default function EntregarEquipo() {
  const [folio, setFolio] = useState("");
  const [firma, setFirma] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const signatureRef = useRef<any>(null);

  const handleOK = (signature: string) => {
    setFirma(signature);
    console.log("Firma guardada:", signature);
    setScrollEnabled(true);
  };

  const handleClear = () => {
    setFirma(null);
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
  };

  const handleEntregar = () => {
    if (!folio) {
      Alert.alert("Folio requerido", "Por favor, ingresa el número de folio.");
      return;
    }
    if (!firma) {
      Alert.alert(
        "Firma requerida",
        "El cliente debe firmar antes de continuar."
      );
      return;
    }
    Alert.alert(
      "Entrega confirmada",
      "El equipo ha sido entregado correctamente."
    );
  };

  const handleCancel = () => {
    Alert.alert("Cancelar", "¿Deseas cancelar la entrega?", [
      { text: "No" },
      { text: "Sí", onPress: () => console.log("Entrega cancelada") },
    ]);
  };

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
          placeholder="Ej: REP-2025-001"
          placeholderTextColor="#9CA3AF"
          value={folio}
          onChangeText={setFolio}
          className="border border-background-200 rounded-xl p-4 bg-background-50 text-typography-900"
        />
      </View>

      {/* Firma del Cliente */}
      <View className="bg-background-100 p-5 rounded-2xl shadow-md border border-background-200 mb-6">
        <Text className="text-typography-900 mb-3 font-semibold">
          Firma de Entregado
        </Text>
        <View
          style={{
            height: 200,
            borderWidth: 2,
            borderColor: "rgb(var(--color-background-200))",
            borderRadius: 12,
            backgroundColor: "rgb(var(--color-background-50))",
          }}
        >
          <Signature
            ref={signatureRef}
            onOK={handleOK}
            onBegin={() => setScrollEnabled(false)}
            onEnd={() => setScrollEnabled(true)}
            descriptionText="Firme aquí"
            clearText="Borrar"
            confirmText="Guardar"
            webStyle={`
              .m-signature-pad { 
                border: none; 
                background-color: rgb(var(--color-background-50));
              }
            `}
          />
        </View>

        <TouchableOpacity
          onPress={handleClear}
          className="bg-background-50 rounded-xl p-3 mt-4 border border-background-200"
        >
          <Text className="text-typography-900 text-center font-semibold">
            Borrar Firma
          </Text>
        </TouchableOpacity>
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
          className="flex-1 bg-success-400 rounded-xl p-4 border border-background-200"
        >
          <Text className="text-background-50 text-center font-bold text-lg">
            Entregar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancel}
          className="flex-1 bg-background-200 rounded-xl p-4 border border-background-200"
        >
          <Text className="text-typography-900 text-center font-bold text-lg">
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
