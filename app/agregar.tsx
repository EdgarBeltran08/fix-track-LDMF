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
      className="flex-1 bg-gray-100 p-4"
      scrollEnabled={scrollEnabled}
    >
      {/* Título */}
      <Text className="text-2xl font-bold text-center mb-6  text-black">
        Registrar Equipo
      </Text>

      {/* Bloque Cliente */}
      <View className="bg-white p-4 rounded-2xl shadow mb-6">
        <Text className="text-lg font-semibold mb-3 text-gray-700">
          Datos del Cliente
        </Text>
        <TextInput
          placeholder="Nombre"
          value={form.nombre}
          onChangeText={(v) => handleChange("nombre", v)}
          placeholderTextColor="#999"
          className="border border-gray-300 rounded-lg p-2 mb-3"
        />
        <TextInput
          placeholder="Teléfono"
          value={form.telefono}
          onChangeText={(v) => handleChange("telefono", v)}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
          className="border border-gray-300 rounded-lg p-2 mb-3"
        />
        <TextInput
          placeholder="Email"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          keyboardType="email-address"
          placeholderTextColor="#999"
          className="border border-gray-300 rounded-lg p-2"
        />
      </View>

      {/* Bloque Equipo */}
      <View className="bg-white p-4 rounded-2xl shadow mb-6">
        <Text className="text-lg font-semibold mb-3 text-gray-700">
          Datos del Equipo
        </Text>
        <TextInput
          placeholder="Marca"
          value={form.marca}
          onChangeText={(v) => handleChange("marca", v)}
          placeholderTextColor="#999"
          className="border border-gray-300 rounded-lg p-2 mb-3"
        />
        <TextInput
          placeholder="Modelo"
          value={form.modelo}
          onChangeText={(v) => handleChange("modelo", v)}
          placeholderTextColor="#999"
          className="border border-gray-300 rounded-lg p-2 mb-3"
        />
        <TextInput
          placeholder="IMEI"
          value={form.imei}
          onChangeText={(v) => handleChange("imei", v)}
          placeholderTextColor="#999"
          className="border border-gray-300 rounded-lg p-2 mb-3"
        />
        <TextInput
          placeholder="Descripción del problema"
          value={form.descripcion}
          onChangeText={(v) => handleChange("descripcion", v)}
          multiline
          numberOfLines={6} // más líneas por defecto
          textAlignVertical="top" // asegura que el texto empieza arriba
          placeholderTextColor="#999"
          className="border border-gray-300 rounded-lg p-2 h-32" // altura tipo textarea
        />
      </View>

      {/* Bloque Firma */}
      <View className="bg-white p-4 rounded-2xl shadow mb-6">
        <Text className="text-lg font-semibold mb-3 text-gray-700">
          Firma del Cliente
        </Text>
        <View
          style={{
            height: 200,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
          }}
        >
          <Signature
            ref={signatureRef} // Asignamos el ref
            onOK={handleOK}
            onBegin={() => setScrollEnabled(false)}
            onEnd={() => setScrollEnabled(true)}
            descriptionText="Firme aquí"
            clearText="Borrar"
            confirmText="Guardar"
            webStyle={`.m-signature-pad {border: none;}`}
          />
        </View>

        {firma && (
          <Text className="text-sm text-green-600 mt-2">
            ✔ Firma guardada correctamente
          </Text>
        )}

        {/* Botón para borrar la firma */}
        <TouchableOpacity
          onPress={handleClear}
          className="bg-gray-400 rounded-lg p-2 mt-2"
        >
          <Text className="text-white text-center font-semibold">
            Borrar Firma
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botones Finales */}
      <View className="flex-row justify-between mb-6">
        <TouchableOpacity
          onPress={() => console.log("Datos:", form, firma)}
          className="bg-green-400 flex-1 rounded-lg p-3 mr-2"
        >
          <Text className="text-white text-center font-semibold">
            Registrar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancel}
          className="bg-gray-400 flex-1 rounded-lg p-3 ml-2"
        >
          <Text className="text-white text-center font-semibold">Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
