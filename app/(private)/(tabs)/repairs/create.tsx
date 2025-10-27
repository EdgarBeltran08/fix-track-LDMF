import {
  AlertText,
  Alert as GluestackAlert,
} from "@/shared/components/ui/alert";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/shared/components/ui/form-control";
import { RepairsRepository } from "@/shared/repositories/repairs.repository";
import { createRepairSchema } from "@/shared/schemas/repairs.schemas";
import { useUserStore } from "@/shared/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import CheckBox from "expo-checkbox";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Signature from "react-native-signature-canvas";
import { ValidationError } from "yup";

type FormData = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deviceModel: string;
  issueDescription: string;
  estimatedCost: string;
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
  const { user } = useUserStore();
  const [form, setForm] = useState<FormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deviceModel: "",
    issueDescription: "",
    estimatedCost: "",
  });

  const [firma, setFirma] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "success" | "error";
    message: string;
    folio?: string;
  }>({
    visible: false,
    type: "success",
    message: "",
  });

  // Ref para controlar el componente Signature
  const signatureRef = useRef<any>(null);

  // Auto-dismiss alert after 4 seconds
  useEffect(() => {
    if (alertConfig.visible) {
      const timer = setTimeout(() => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alertConfig.visible]);

  const handleChange = (field: FormField, value: string) => {
    setForm({ ...form, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
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
      {
        text: "Sí",
        onPress: () => {
          router.back();
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      // Clear previous errors
      setErrors({});

      // Validate form
      const validatedData = await createRepairSchema.validate(
        {
          ...form,
          estimatedCost: parseFloat(form.estimatedCost) || 0,
        },
        { abortEarly: false }
      );

      // Check if user is logged in
      if (!user?.id) {
        setAlertConfig({
          visible: true,
          type: "error",
          message: "Debes iniciar sesión para crear una reparación",
        });
        return;
      }

      setLoading(true);

      // Generate folio
      const folio = `FT-${new Date().getFullYear()}-${String(Date.now()).slice(
        -6
      )}`;

      // Combine issue description with checklist items
      const selectedIssues = Object.entries(checklist)
        .filter(([, value]) => value)
        .map(([key]) => {
          const issueLabels: Record<ChecklistKeys, string> = {
            aparatoMojado: "Aparato mojado",
            noEnciende: "No enciende",
            seApagaSolo: "Se apaga solo",
            noCarga: "No carga aún conectado",
            bateriaInflada: "Batería inflada",
            seDescarga: "Se descarga demasiado rápido",
            seReinicia: "Se reinicia constantemente",
            pantallaRota: "Pantalla rota o estrellada",
            pantallaManchas: "Pantalla con manchas",
            tactilNoResponde: "Táctil no responde",
            sinImagen: "Pantalla encendida pero sin imagen",
            rayasPantalla: "Pantalla con rayas",
            pantallaNegra: "Pantalla completamente negra",
          };
          return issueLabels[key as ChecklistKeys];
        });

      const fullDescription =
        selectedIssues.length > 0
          ? `${
              validatedData.issueDescription
            }\n\nProblemas detectados:\n- ${selectedIssues.join("\n- ")}`
          : validatedData.issueDescription;

      // Create repair object
      const repairData = {
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        deviceModel: validatedData.deviceModel,
        issueDescription: fullDescription,
        status: "in_review" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTo: user.id,
        estimatedCost: validatedData.estimatedCost,
        finalCost: 0,
        deliveryDate: null,
        folio,
        notes: [],
        pieces: [],
      };

      // Save to Firebase
      await RepairsRepository.create(repairData);

      // Reset form
      setForm({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        deviceModel: "",
        issueDescription: "",
        estimatedCost: "",
      });
      setChecklist({
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
      setFirma(null);
      if (signatureRef.current) {
        signatureRef.current.clearSignature();
      }

      // Show success toast
      setAlertConfig({
        visible: true,
        type: "success",
        message: "¡Reparación registrada exitosamente!",
        folio: folio,
      });

      // Navigate back after alert is visible
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Handle validation errors
        const validationErrors: Partial<Record<FormField, string>> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path as FormField] = err.message;
          }
        });
        setErrors(validationErrors);
        // Errors will be displayed by FormControl components
      } else {
        console.error("Error creating repair:", error);
        setAlertConfig({
          visible: true,
          type: "error",
          message:
            "Ocurrió un error al registrar la reparación. Por favor, intenta de nuevo.",
        });
      }
    } finally {
      setLoading(false);
    }
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
    <View className="flex-1">
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

          <FormControl className="mb-4" isInvalid={!!errors.customerName}>
            <TextInput
              placeholder="Nombre completo"
              value={form.customerName}
              onChangeText={(v) => handleChange("customerName", v)}
              placeholderTextColor="#999999"
              className={`border-2 rounded-xl p-4 text-typography-900 bg-background-50 ${
                errors.customerName ? "border-error-500" : "border-outline-200"
              }`}
            />
            {errors.customerName && (
              <FormControlError className="mt-1">
                <FormControlErrorText className="text-error-600 text-sm">
                  {errors.customerName}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl className="mb-4" isInvalid={!!errors.customerPhone}>
            <TextInput
              placeholder="Teléfono"
              value={form.customerPhone}
              onChangeText={(v) => handleChange("customerPhone", v)}
              keyboardType="phone-pad"
              placeholderTextColor="#999999"
              className={`border-2 rounded-xl p-4 text-typography-900 bg-background-50 ${
                errors.customerPhone ? "border-error-500" : "border-outline-200"
              }`}
            />
            {errors.customerPhone && (
              <FormControlError className="mt-1">
                <FormControlErrorText className="text-error-600 text-sm">
                  {errors.customerPhone}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.customerEmail}>
            <TextInput
              placeholder="Correo electrónico"
              value={form.customerEmail}
              onChangeText={(v) => handleChange("customerEmail", v)}
              keyboardType="email-address"
              placeholderTextColor="#999999"
              className={`border-2 rounded-xl p-4 text-typography-900 bg-background-50 ${
                errors.customerEmail ? "border-error-500" : "border-outline-200"
              }`}
            />
            {errors.customerEmail && (
              <FormControlError className="mt-1">
                <FormControlErrorText className="text-error-600 text-sm">
                  {errors.customerEmail}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </View>

        {/* Bloque Equipo */}
        <View className="bg-background-0 p-6 rounded-2xl shadow-lg mb-6 border border-outline-100">
          <View className="flex-row items-center mb-4">
            <View className="w-2 h-6 bg-info-500 rounded-full mr-3" />
            <Text className="text-xl font-bold text-typography-900">
              Datos del Equipo
            </Text>
          </View>

          <FormControl className="mb-4" isInvalid={!!errors.deviceModel}>
            <TextInput
              placeholder="Modelo del dispositivo (ej: iPhone 14 Pro, Samsung Galaxy S23)"
              value={form.deviceModel}
              onChangeText={(v) => handleChange("deviceModel", v)}
              placeholderTextColor="#999999"
              className={`border-2 rounded-xl p-4 text-typography-900 bg-background-50 ${
                errors.deviceModel ? "border-error-500" : "border-outline-200"
              }`}
            />
            {errors.deviceModel && (
              <FormControlError className="mt-1">
                <FormControlErrorText className="text-error-600 text-sm">
                  {errors.deviceModel}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl className="mb-4" isInvalid={!!errors.estimatedCost}>
            <TextInput
              placeholder="Costo estimado de la reparación"
              value={form.estimatedCost}
              onChangeText={(v) => handleChange("estimatedCost", v)}
              keyboardType="numeric"
              placeholderTextColor="#999999"
              className={`border-2 rounded-xl p-4 text-typography-900 bg-background-50 ${
                errors.estimatedCost ? "border-error-500" : "border-outline-200"
              }`}
            />
            {errors.estimatedCost && (
              <FormControlError className="mt-1">
                <FormControlErrorText className="text-error-600 text-sm">
                  {errors.estimatedCost}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Checklist */}
          <Text className="text-lg font-bold text-typography-900 mb-2 mt-2">
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
                  color={
                    checklist[key as ChecklistKeys] ? "#FFB74D" : undefined
                  }
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
              [
                "tactilNoResponde",
                "Táctil no responde o responde parcialmente",
              ],
              ["sinImagen", "Pantalla encendida pero sin imagen"],
              ["rayasPantalla", "Pantalla con rayas verticales / horizontales"],
              ["pantallaNegra", "Pantalla completamente negra"],
            ].map(([key, label]) => (
              <View key={key} className="flex-row items-center mb-1">
                <CheckBox
                  value={checklist[key as ChecklistKeys]}
                  onValueChange={() => toggleCheckbox(key as ChecklistKeys)}
                  color={
                    checklist[key as ChecklistKeys] ? "#FFB74D" : undefined
                  }
                />
                <Text className="ml-2 text-typography-900">{label}</Text>
              </View>
            ))}
          </View>
          {/*CHECKLIST*/}

          <FormControl isInvalid={!!errors.issueDescription}>
            <TextInput
              placeholder="Describe el problema o daño del equipo..."
              value={form.issueDescription}
              onChangeText={(v) => handleChange("issueDescription", v)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor="#999999"
              className={`border-2 rounded-xl p-4 h-32 text-typography-900 bg-background-50 ${
                errors.issueDescription
                  ? "border-error-500"
                  : "border-outline-200"
              }`}
            />
            {errors.issueDescription && (
              <FormControlError className="mt-1">
                <FormControlErrorText className="text-error-600 text-sm">
                  {errors.issueDescription}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* texto legal*/}
          <Text className="text-xs text-typography-700 mt-3 text-justify">
            Green Monkey responsabiliza al cliente de la procedencia lícita del
            equipo. La garantía solo aplica en mano de obra y en piezas
            reemplazadas, cualquier falla adicional genera un costo extra.
            Golpes o manipulación indebida no tendrán garantía de ningún tipo.
            Estos equipos corren el riesgo de apagarse definitivamente. El
            cliente cuenta con 30 días para recoger su equipo. No nos hacemos
            responsables por SIM o accesorios olvidados.
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
            onPress={handleSubmit}
            disabled={loading}
            className={`flex-1 rounded-xl p-4 shadow-lg border ${
              loading
                ? "bg-primary-300 border-primary-400"
                : "bg-primary-500 border-primary-600"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-background-0 text-center font-bold text-lg">
                Registrar Reparación
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancel}
            disabled={loading}
            className={`flex-1 rounded-xl p-4 shadow-lg border border-outline-200 ${
              loading ? "opacity-50" : ""
            }`}
          >
            <Text className="text-typography-700 text-center font-bold text-lg">
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Alert Component */}
      {alertConfig.visible && (
        <View className="absolute top-16 left-4 right-4 z-50">
          <GluestackAlert
            action={alertConfig.type}
            className={`${
              alertConfig.type === "success" ? "bg-success-700" : "bg-error-700"
            } rounded-xl shadow-2xl p-4`}
          >
            <View className="flex-row items-start justify-between w-full">
              <View className="flex-row items-start flex-1 gap-3">
                <Ionicons
                  name={
                    alertConfig.type === "success"
                      ? "checkmark-circle"
                      : "close-circle"
                  }
                  size={24}
                  color="white"
                />
                <View className="flex-1">
                  <AlertText className="text-white font-bold text-base mb-1">
                    {alertConfig.type === "success" ? "¡Éxito!" : "Error"}
                  </AlertText>
                  <AlertText className="text-white text-sm">
                    {alertConfig.message}
                  </AlertText>
                  {alertConfig.folio && (
                    <AlertText className="text-white text-sm font-semibold mt-1">
                      Folio: {alertConfig.folio}
                    </AlertText>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  setAlertConfig((prev) => ({ ...prev, visible: false }))
                }
                className="ml-2"
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </GluestackAlert>
        </View>
      )}
    </View>
  );
}
