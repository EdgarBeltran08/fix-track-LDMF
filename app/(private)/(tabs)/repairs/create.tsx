import CheckBox from "expo-checkbox";
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
type ChecklistKeys =
  | "aparatoMojado"
  | "noEnciende"
  | "seApagaSolo"
  | "noCarga"
  | "bateriaInflada"
  | "seDescarga"
  | "seReinicia"
  | "pantallaRota"
  | "pantallaManchas"
  | "tactilNoResponde"
  | "sinImagen"
  | "rayasPantalla"
  | "pantallaNegra";
//
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
  const [checklist, setChecklist] = useState<Record<ChecklistKeys, boolean>>({
    aparatoMojado: false,
    noEnciende: false,
    seApagaSolo: false,
    noCarga: false,
    bateriaInflada: false,
    seDescarga: false,
    seReinicia: false,
    pantallaRota: false,
    pantallaManchas: false,
    tactilNoResponde: false,
    sinImagen: false,
    rayasPantalla: false,
    pantallaNegra: false,
  });

  const toggleCheckbox = (key: ChecklistKeys) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <ScrollView
      className="flex-1 bg-background-0 p-4"
      scrollEnabled={scrollEnabled}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Título */}
      <View className="mb-8 mt-2">
        <Text className="text-3xl font-bold text-center text-typography-900 mb-2">
          Registrar reparación
        </Text>
        <View className="w-20 h-1 bg-primary-500 mx-auto rounded-full" />
      </View>

      {/* Bloque Cliente */}
      <View className="bg-background-0 p-6 rounded-2xl shadow-lg mb-6 border border-outline-100">
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
          className="border border-outline-200 rounded-xl p-4 mb-4 text-typography-900 bg-background-50 focus:border-primary-500 focus:bg-background-0"
        />
        <TextInput
          placeholder="Teléfono"
          value={form.telefono}
          onChangeText={(v) => handleChange("telefono", v)}
          keyboardType="phone-pad"
          placeholderTextColor="#999999"
          className="border border-outline-200 rounded-xl p-4 mb-4 text-typography-900 bg-background-50 focus:border-primary-500 focus:bg-background-0"
        />
        <TextInput
          placeholder="Correo electrónico"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          keyboardType="email-address"
          placeholderTextColor="#999999"
          className="border border-outline-200 rounded-xl p-4 text-typography-900 bg-background-50 focus:border-primary-500 focus:bg-background-0"
        />
      </View>

      {/* Bloque Equipo */}
      <View className="bg-background-0 p-6 rounded-2xl shadow-lg mb-6 border border-outline-100">
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
          className="border border-outline-200 rounded-xl p-4 mb-4 text-typography-900 bg-background-50 focus:border-primary-500 focus:bg-background-0"
        />
        <TextInput
          placeholder="Modelo"
          value={form.modelo}
          onChangeText={(v) => handleChange("modelo", v)}
          placeholderTextColor="#999999"
          className="border border-outline-200 rounded-xl p-4 mb-4 text-typography-900 bg-background-50 focus:border-primary-500 focus:bg-background-0"
        />
        <TextInput
          placeholder="IMEI / Número de serie"
          value={form.imei}
          onChangeText={(v) => handleChange("imei", v)}
          placeholderTextColor="#999999"
          className="border border-outline-200 rounded-xl p-4 mb-4 text-typography-900 bg-background-50 focus:border-primary-500 focus:bg-background-0"
        />
        {/* Checklist */}
        <Text className="text-lg font-bold text-typography-900 mb-2">
          Este equipo se recibe:
        </Text>

        <View className="gap-2 mb-4">
          <View className="flex-row items-center mb-2">
            <CheckBox
              value={checklist.aparatoMojado}
              onValueChange={() => toggleCheckbox("aparatoMojado")}
              color={checklist.aparatoMojado ? "#FFB74D" : undefined}
            />
            <Text className="ml-2 text-typography-900">Aparato mojado</Text>
          </View>

          <Text className="font-bold text-typography-900 mt-2">
            Condiciones relacionadas con la batería y energía
          </Text>

          {[
            ["noEnciende", "No enciende"],
            ["seApagaSolo", "Se apaga solo"],
            ["noCarga", "No carga aún conectado"],
            ["bateriaInflada", "Batería inflada"],
            ["seDescarga", "Se descarga demasiado rápido"],
            ["seReinicia", "Se reinicia constantemente"],
          ].map(([key, label]) => (
            <View key={key} className="flex-row items-center mb-1">
              <CheckBox
                value={checklist[key as ChecklistKeys]}
                onValueChange={() => toggleCheckbox(key as ChecklistKeys)}
                color={checklist[key as ChecklistKeys] ? "#FFB74D" : undefined}
              />
              <Text className="ml-2 text-typography-900">{label}</Text>
            </View>
          ))}

          <Text className="font-bold text-typography-900 mt-3">
            Condiciones de la pantalla
          </Text>

          {[
            ["pantallaRota", "Pantalla rota o estrellada"],
            [
              "pantallaManchas",
              "Pantalla con manchas (amarillas, negras o de colores)",
            ],
            ["tactilNoResponde", "Táctil no responde o responde parcialmente"],
            ["sinImagen", "Pantalla encendida pero sin imagen"],
            ["rayasPantalla", "Pantalla con rayas verticales / horizontales"],
            ["pantallaNegra", "Pantalla completamente negra"],
          ].map(([key, label]) => (
            <View key={key} className="flex-row items-center mb-1">
              <CheckBox
                value={checklist[key as ChecklistKeys]}
                onValueChange={() => toggleCheckbox(key as ChecklistKeys)}
                color={checklist[key as ChecklistKeys] ? "#FFB74D" : undefined}
              />
              <Text className="ml-2 text-typography-900">{label}</Text>
            </View>
          ))}
        </View>
        {/*CHECKLIST*/}
        <TextInput
          placeholder="Describe el problema o daño del equipo..."
          value={form.descripcion}
          onChangeText={(v) => handleChange("descripcion", v)}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholderTextColor="#999999"
          className="border border-outline-200 rounded-xl p-4 h-32 text-typography-900 bg-background-50 focus:border-primary-500 focus:bg-background-0"
        />
        {/* texto legal*/}
        <Text className="text-xs text-typography-700 mt-3 text-justify">
          Green Monkey responsabiliza al cliente de la procedencia lícita del
          equipo. La garantía solo aplica en mano de obra y en piezas
          reemplazadas, cualquier falla adicional genera un costo extra. Golpes
          o manipulación indebida no tendrán garantía de ningún tipo. Estos
          equipos corren el riesgo de apagarse definitivamente. El cliente
          cuenta con 30 días para recoger su equipo. No nos hacemos responsables
          por SIM o accesorios olvidados.
        </Text>
      </View>

      {/* Bloque Firma */}
      <View className="bg-background-0 p-6 rounded-2xl shadow-lg mb-6 border border-outline-100">
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
            borderColor: "rgb(var(--color-outline-200))",
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
          className="bg-primary-500 flex-1 rounded-xl p-4 shadow-lg border border-primary-600"
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
