import { Button, ButtonText } from "@/shared/components/ui/button";
import { useRouter } from "expo-router"; // 👈 Importamos el router
import React, { useRef, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, View } from "react-native";
import Signature from "react-native-signature-canvas";

export default function EntregarEquipo() {
  const [folio, setFolio] = useState("");
  const [firma, setFirma] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const signatureRef = useRef<any>(null);
  const router = useRouter(); // 👈 Inicializamos router

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
      {
        text: "Sí",
        onPress: () => {
          router.push("/(private)/(tabs)");
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-background-50 p-6"
      scrollEnabled={scrollEnabled}
      contentContainerStyle={{ paddingBottom: 120 }}
      style={{ backgroundColor: "#193456" }}
    >
      {/* Encabezado */}
      <View className="items-center mb-6 mt-2">
        <Text className="text-2xl font-bold text-typography-900 mb-3  text-white">
          Entregar Equipo
        </Text>
        <Image
          source={require("@/assets/images/delivery-img.png")}
          style={{ width: 100, height: 100, marginBottom: 8 }}
        />

        <Text className="text-center  text-white text-typography-900 opacity-70">
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

      {/* Firma */}
      <View className="bg-[#EDFFFD] p-6 rounded-2xl shadow-lg mb-6 border border-[#FFB74D]/30">
        <Text className="text-xl font-bold mb-4 text-[#193456]">
          Firma del Cliente
        </Text>

        <View
          style={{
            height: 330,
            borderWidth: 2,
            borderColor: "#FFB74D",
            borderRadius: 12,
            backgroundColor: "#fff",
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
                background-color: #fff; 
                height: 160px; 
              }
              .m-signature-pad--footer { 
                display: flex; 
                justify-content: space-between; 
                align-items: center;
                height: 40px; 
                background-color: #fff;
              }
              .m-signature-pad--description {
                display: none; 
              }
              .m-signature-pad--footer .button.clear {
                background-color: #E5E7EB;
                color: #374151;
              }
              .m-signature-pad--footer .button.save {
                background-color: #FFB74D;
                color: #fff;
              }
            `}
          />
        </View>

        {firma && (
          <View className="flex-row items-center mt-4 p-3 bg-green-100 rounded-xl border border-green-300">
            <Text className="text-green-800 font-semibold">
              ✓ Firma guardada correctamente
            </Text>
          </View>
        )}
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
        <Button
          action="secondary"
          size="sm"
          className="flex-1 mx-1 bg-gray-500"
          style={{ backgroundColor: "#FFB74D" }}
          onPress={handleEntregar}
        >
          <ButtonText className="text-white font-semibold">Entregar</ButtonText>
        </Button>

        <Button
          action="secondary"
          size="sm"
          className="flex-1 mx-1 bg-gray-500"
          onPress={handleCancel} // 👈 manejador agregado
        >
          <ButtonText className="text-white font-semibold">Cancelar</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
}
