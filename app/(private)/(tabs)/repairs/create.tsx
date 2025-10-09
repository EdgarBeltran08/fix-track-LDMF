import React, { useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Signature from "react-native-signature-canvas";

type FormData = {
  nombre: string;
  telefono: string;
  email: string;
  marca: string;
  modelo: string;
  imei: string;
  descripcion: string;
};

type FormField = keyof FormData;

export default function AddEquipoForm() {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    telefono: "",
    email: "",
    marca: "",
    modelo: "",
    imei: "",
    descripcion: "",
  });

  const [firma, setFirma] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Ref para controlar el componente Signature
  const signatureRef = useRef<any>(null);

  const handleChange = (field: FormField, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleOK = (signature: string) => {
    setFirma(signature);
    console.log("Firma guardada:", signature);
    setScrollEnabled(true);
  };

  // Limpiar firma tanto en estado como en canvas
  const handleClear = () => {
    setFirma(null);
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
  };

  const handleCancel = () => {
    Alert.alert("Cancelar", "¿Estás seguro de que quieres cancelar?", [
      { text: "No" },
      { text: "Sí", onPress: () => console.log("Formulario cancelado") },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-[#193456] p-4"
      scrollEnabled={scrollEnabled}
    >
      {/* Título */}
      <View className="mb-8 mt-2">
        <Text className="text-3xl font-bold text-center color-white mb-2">
          Registrar reparación
        </Text>
        <View className="w-20 h-1 bg-[#FFB74D] mx-auto rounded-full" />
      </View>

      {/* Bloque Cliente */}
      <View className="bg-[#EDFFFD]  p-6 rounded-2xl shadow-lg mb-6 border border-outline-100">
        <View className="flex-row items-center mb-4">
          <View className="w-2 h-6 bg-primary-500 rounded-full mr-3" />
          <Text className="text-xl font-bold text-typography-900">
            Datos del Cliente
          </Text>
        </View>
        <TextInput
          placeholder="Nombre completo"
          value={form.nombre}
          onChangeText={(v) => handleChange("nombre", v)}
          placeholderTextColor="#999999"
          className="border-2 border-[#FFB74D] rounded-xl p-4 mb-4 text-typography-900 bg-[#EDFFFD]  focus:border-[#FFB74D] focus:bg-background-0"
        />
        <TextInput
          placeholder="Teléfono"
          value={form.telefono}
          onChangeText={(v) => handleChange("telefono", v)}
          keyboardType="phone-pad"
          placeholderTextColor="#999999"
          className="border-2 border-[#FFB74D] rounded-xl p-4 mb-4 text-typography-900 bg-[#EDFFFD]  focus:border-[#FFB74D] focus:bg-background-0"
        />
        <TextInput
          placeholder="Correo electrónico"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          keyboardType="email-address"
          placeholderTextColor="#999999"
          className="border-2 border-[#FFB74D] rounded-xl p-4 text-typography-900 bg-[#EDFFFD]  focus:border-[#FFB74D] focus:bg-background-0"
        />
      </View>

      {/* Bloque Equipo */}
      <View className="bg-[#EDFFFD]  p-6 rounded-2xl shadow-lg mb-6 border border-outline-100">
        <View className="flex-row items-center mb-4">
          <View className="w-2 h-6 bg-info-500 rounded-full mr-3" />
          <Text className="text-xl font-bold text-typography-900">
            Datos del Equipo
          </Text>
        </View>
        <TextInput
          placeholder="Marca del dispositivo"
          value={form.marca}
          onChangeText={(v) => handleChange("marca", v)}
          placeholderTextColor="#999999"
          className="border-2 border-[#FFB74D] rounded-xl p-4 mb-4 text-typography-900 bg-[#EDFFFD]  focus:border-[#FFB74D] focus:bg-background-0"
        />
        <TextInput
          placeholder="Modelo"
          value={form.modelo}
          onChangeText={(v) => handleChange("modelo", v)}
          placeholderTextColor="#999999"
          className="border-2 border-[#FFB74D] rounded-xl p-4 mb-4 text-typography-900 bg-[#EDFFFD]  focus:border-[#FFB74D] focus:bg-background-0"
        />
        <TextInput
          placeholder="IMEI / Número de serie"
          value={form.imei}
          onChangeText={(v) => handleChange("imei", v)}
          placeholderTextColor="#999999"
          className="border-2 border-[#FFB74D] rounded-xl p-4 mb-4 text-typography-900 bg-[#EDFFFD]  focus:border-[#FFB74D] focus:bg-background-0"
        />
        <TextInput
          placeholder="Describe el problema o daño del equipo..."
          value={form.descripcion}
          onChangeText={(v) => handleChange("descripcion", v)}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholderTextColor="#999999"
          className="border-2 border-[#FFB74D] rounded-xl p-4 h-32 text-typography-900 bg-[#EDFFFD]  focus:border-[#FFB74D] focus:bg-background-0"
        />
      </View>

      {/* Bloque Firma */}
      <View className="bg-[#EDFFFD]  p-6 rounded-2xl shadow-lg mb-6 border border-outline-100">
        <View className="flex-row items-center mb-4">
          <View className="w-2 h-6 bg-warning-500 rounded-full mr-3" />
          <Text className="text-xl font-bold text-typography-900">
            Firma del Cliente
          </Text>
        </View>
        <View
          style={{
            height: 200,
            borderWidth: 2,
            borderColor: "#FFB74D",
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
            webStyle={`.m-signature-pad {border: none; background-color: rgb(var(--color-background-50));}`}
          />
        </View>

        {firma && (
          <View className="flex-row items-center mt-4 p-3 bg-success-50 rounded-xl border border-success-200">
            <Text className="text-success-700 font-semibold">
              ✓ Firma guardada correctamente
            </Text>
          </View>
        )}

        {/* Botón para borrar la firma */}
        <TouchableOpacity
          onPress={handleClear}
          className="bg-secondary-200 rounded-xl p-4 mt-4 border border-outline-200"
        >
          <Text className="text-typography-700 text-center font-semibold">
            Borrar Firma
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botones Finales */}
      <View className="flex-row justify-between mb-8 gap-4">
        <TouchableOpacity
          onPress={() => console.log("Datos:", form, firma)}
          className="bg-[#FFB74D] flex-1 rounded-xl p-4 shadow-lg border border-[#FFB74D]"
        >
          <Text className="text-background-0 text-center font-bold text-lg">
            Registrar Equipo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancel}
          className="bg-secondary-200 flex-1 rounded-xl p-4 shadow-lg border border-outline-200"
        >
          <Text className="text-typography-700 text-center font-bold text-lg">
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
