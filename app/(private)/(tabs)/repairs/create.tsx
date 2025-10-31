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
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal, // Añadido
  ScrollView,
  StyleSheet, // Añadido
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Eliminado: import Signature from "react-native-signature-canvas";
import { ValidationError } from "yup";

// --- TIPOS Y CONSTANTES ---
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

// --- TEXTO DE TÉRMINOS Y CONDICIONES ---
const LOREM_TEXT = `
TÉRMINOS Y CONDICIONES DEL SERVICIO DE REPARACIÓN FIX TRACK

Artículo 1: Aceptación y Consentimiento

Al entregar su equipo para diagnóstico y/o reparación, el Cliente acepta de manera expresa los siguientes términos y condiciones. La aceptación se formaliza mediante la Confirmación Digital (Nombre Completo) en el presente formulario, que sustituye a la firma autógrafa y tiene plena validez legal.

Artículo 2: Riesgo de la Reparación y Daños Potenciales

El Cliente reconoce y acepta que:
1. Riesgo de Pérdida Total o Daño Adicional: La reparación de equipos electrónicos, especialmente aquellos con daño por líquidos, daños severos o manipulación previa, conlleva el riesgo inherente de que el equipo pueda sufrir un fallo permanente e irreparable (incluyendo el riesgo de que el dispositivo no encienda de forma definitiva). Fix Track no se hace responsable por la pérdida total del equipo o la aparición de fallos adicionales no relacionados con el servicio contratado.
2. Pérdida de Datos: El proceso de diagnóstico o reparación puede requerir el reinicio del sistema operativo. Es responsabilidad exclusiva del Cliente realizar una copia de seguridad (backup) de todos los datos, archivos e información almacenada en el equipo antes de su entrega. Fix Track no es responsable por la pérdida total o parcial de datos.
3. Anulación de Garantía del Fabricante: La manipulación o apertura del equipo por parte de Fix Track puede anular la garantía oficial del fabricante del dispositivo.

Artículo 3: Garantía del Servicio

1. Alcance de la Garantía: La garantía ofrecida por Fix Track se limita estrictamente a la mano de obra realizada y a la pieza de repuesto específica que fue instalada.
2. Vigencia: La garantía es válida por 30 días naturales a partir de la fecha de entrega del equipo al Cliente.
3. Exclusiones: La garantía será nula en los siguientes casos:
   * Manipulación Indebida: Si el equipo presenta daños físicos, golpes, caídas, señales de humedad o cualquier tipo de manipulación externa o interna posterior a la reparación.
   * Fallas Adicionales: Si la falla reportada después de la reparación es diferente a la originalmente reparada. Cualquier falla adicional generará un nuevo presupuesto y costo extra.

Artículo 4: Procedencia y Bloqueo del Equipo

El Cliente declara bajo protesta de decir verdad que el equipo entregado es de su legítima propiedad y procedencia lícita. Fix Track no se responsabiliza por dispositivos reportados como robados o bloqueados por IMEI, y se reserva el derecho de denunciar a las autoridades competentes si se detecta alguna anomalía.

Artículo 5: Plazos de Recolección y Resguardo

1. Plazo de Recolección: Una vez que la reparación esté finalizada (o el diagnóstico haya sido rechazado por el Cliente), el Cliente dispone de 30 días naturales para recoger el equipo.
2. Costo de Resguardo: Vencido el plazo de 30 días, Fix Track se reserva el derecho de aplicar un costo diario de almacenaje o considerar el equipo en abandono, procediendo a su desecho o venta para cubrir los gastos de almacenaje y/o diagnóstico.
3. Accesorios: Fix Track no se hace responsable por tarjetas SIM, tarjetas de memoria, fundas, protectores, o cualquier otro accesorio olvidado en el equipo.
`;

// --- COMPONENTE MODAL DE TÉRMINOS Y CONDICIONES ---
const TermsModal = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View className="bg-background-0 p-6 rounded-2xl shadow-lg w-11/12 h-3/4">
          <Text className="text-2xl font-bold text-typography-900 mb-4 text-center">
            Términos y Condiciones
          </Text>
          <ScrollView className="flex-1 border border-outline-200 p-3 rounded-lg mb-4">
            <Text className="text-base text-typography-900 text-justify">
              {LOREM_TEXT}
            </Text>
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            className="bg-primary-500 rounded-xl p-3"
          >
            <Text className="text-background-0 text-center font-bold">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
// ----------------------------------------------------

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

  // --- ESTADOS DE ACEPTACIÓN (Reemplazan a 'firma') ---
  const [nombreConfirmacion, setNombreConfirmacion] = useState<string>("");
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // ----------------------------------------------------

  const [scrollEnabled] = useState(true);
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
  
  // Eliminado: const signatureRef = useRef<any>(null);

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
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const toggleCheckbox = (key: ChecklistKeys) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  
  // Eliminado: handleOK y handleClear

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
    // --- NUEVAS VALIDACIONES DE ACEPTACIÓN ---
    if (!nombreConfirmacion.trim()) {
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Debe ingresar el nombre para confirmar la aceptación.",
      });
      return;
    }
    if (!terminosAceptados) {
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Debe aceptar los Términos y Condiciones.",
      });
      return;
    }
    // ---------------------------------------------

    try {
      setErrors({});
      const validatedData = await createRepairSchema.validate(
        {
          ...form,
          estimatedCost: parseFloat(form.estimatedCost) || 0,
        },
        { abortEarly: false }
      );

      if (!user?.id) {
        setAlertConfig({
          visible: true,
          type: "error",
          message: "Debes iniciar sesión para crear una reparación.",
        });
        return;
      }

      setLoading(true);

      const folio = `FT-${new Date().getFullYear()}-${String(
        Date.now()
      ).slice(-6)}`;

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
      
      // --- OBJETO DE DATOS PARA FIRESTORE (MODIFICADO) ---
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
        // --- NUEVOS CAMPOS DE ACEPTACIÓN ---
        nombre_acepta: nombreConfirmacion,
        terminos_aceptados: true,
        fecha_aceptacion: new Date(),
        // -------------------------------------
      };

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
        aparatoMojado: false, noEnciende: false, seApagaSolo: false,
        noCarga: false, bateriaInflada: false, seDescarga: false,
        seReinicia: false, pantallaRota: false, pantallaManchas: false,
        tactilNoResponde: false, sinImagen: false, rayasPantalla: false,
        pantallaNegra: false,
      });
      // --- RESET DE NUEVOS ESTADOS ---
      setNombreConfirmacion("");
      setTerminosAceptados(false);
      // -------------------------------

      setAlertConfig({
        visible: true,
        type: "success",
        message: "¡Reparación registrada exitosamente!",
        folio: folio,
      });

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      if (error instanceof ValidationError) {
        const validationErrors: Partial<Record<FormField, string>> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path as FormField] = err.message;
          }
        });
        setErrors(validationErrors);
      } else {
        console.error("Error creating repair:", error);
        setAlertConfig({
          visible: true,
          type: "error",
          message: "Ocurrió un error al registrar la reparación. Por favor, intenta de nuevo.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 bg-primary-0 p-0"
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Título, Bloque Cliente y Bloque Equipo (con sus FormControl) se mantienen */}
        <View className="mb-6 bg-background-50 p-4 py-6 rounded-b-3xl ">
            <Text className="text-3xl font-bold text-center text-typography-900 mb-2">
                Registrar reparación
            </Text>
            <View className="w-20 h-1 bg-primary-500 mx-auto rounded-full" />
        </View>

        {/* Bloque Cliente */}
        <View className="bg-background-0 p-6 rounded-2xl shadow-lg mb-6 border border-outline-100 m-4">
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
              placeholder="Correo electrónico (obligatorio)"
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
        <View className="bg-background-0 p-6 rounded-2xl shadow-lg mb-6 border border-outline-100 m-4">
          <View className="flex-row items-center mb-4">
            <View className="w-2 h-6 bg-info-500 rounded-full mr-3" />
            <Text className="text-xl font-bold text-typography-900">
              Datos del Equipo
            </Text>
          </View>
          <FormControl className="mb-4" isInvalid={!!errors.deviceModel}>
            <TextInput
              placeholder="Modelo del dispositivo (ej: iPhone 14 Pro)"
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
                  <CheckBox value={checklist.aparatoMojado} onValueChange={() => toggleCheckbox("aparatoMojado")} color={checklist.aparatoMojado ? "#FFB74D" : undefined} />
                  <Text className="ml-2 text-typography-900">Aparato mojado</Text>
              </View>
              <Text className="font-bold text-typography-900 mt-2">Condiciones de batería y energía</Text>
              {[["noEnciende", "No enciende"], ["seApagaSolo", "Se apaga solo"], ["noCarga", "No carga"], ["bateriaInflada", "Batería inflada"], ["seDescarga", "Se descarga rápido"], ["seReinicia", "Se reinicia"]].map(([key, label]) => (
                  <View key={key} className="flex-row items-center mb-1">
                      <CheckBox value={checklist[key as ChecklistKeys]} onValueChange={() => toggleCheckbox(key as ChecklistKeys)} color={checklist[key as ChecklistKeys] ? "#FFB74D" : undefined} />
                      <Text className="ml-2 text-typography-900">{label}</Text>
                  </View>
              ))}
              <Text className="font-bold text-typography-900 mt-3">Condiciones de la pantalla</Text>
              {[["pantallaRota", "Pantalla rota"], ["pantallaManchas", "Pantalla con manchas"], ["tactilNoResponde", "Táctil no responde"], ["sinImagen", "Sin imagen"], ["rayasPantalla", "Con rayas"], ["pantallaNegra", "Pantalla negra"]].map(([key, label]) => (
                  <View key={key} className="flex-row items-center mb-1">
                      <CheckBox value={checklist[key as ChecklistKeys]} onValueChange={() => toggleCheckbox(key as ChecklistKeys)} color={checklist[key as ChecklistKeys] ? "#FFB74D" : undefined} />
                      <Text className="ml-2 text-typography-900">{label}</Text>
                  </View>
              ))}
          </View>

          <FormControl isInvalid={!!errors.issueDescription}>
            <TextInput
              placeholder="Describe el problema o daño del equipo..."
              value={form.issueDescription}
              onChangeText={(v) => handleChange("issueDescription", v)}
              multiline numberOfLines={6} textAlignVertical="top"
              placeholderTextColor="#999999"
              className={`border-2 rounded-xl p-4 h-32 text-typography-900 bg-background-50 ${
                errors.issueDescription ? "border-error-500" : "border-outline-200"
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
        </View>

        {/* --- BLOQUE ACEPTACIÓN (NUEVO) --- */}
        <View className="bg-background-0 p-6 rounded-2xl shadow-lg mb-6 border border-outline-100 m-4">
          <View className="flex-row items-center mb-4">
            <View className="w-2 h-6 bg-warning-500 rounded-full mr-3" />
            <Text className="text-xl font-bold text-typography-900">
              Aceptación del Cliente
            </Text>
          </View>
          <Text className="text-base font-semibold text-typography-700 mb-2">
            Escriba su nombre completo para confirmar la recepción
          </Text>
          <TextInput
            placeholder="Nombre Completo del Cliente"
            value={nombreConfirmacion}
            onChangeText={setNombreConfirmacion}
            placeholderTextColor="#999999"
            className="border-2 border-outline-200 rounded-xl p-4 mb-6 text-typography-900 bg-background-50"
          />
          <View className="flex-row items-start">
            <CheckBox
              value={terminosAceptados}
              onValueChange={setTerminosAceptados}
              color={terminosAceptados ? "#2AD582" : undefined}
              className="mt-1"
            />
            <View className="ml-3 flex-1 flex-row flex-wrap">
              <Text className="text-typography-900">Acepto los </Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text className="text-primary-500 font-bold underline">
                  Términos y Condiciones
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* ---------------------------------- */}
        
        {/* Botones Finales */}
        <View className="flex-row justify-between mb-8 gap-4 m-4">
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

      {/* --- LLAMADA AL MODAL DE TÉRMINOS --- */}
      <TermsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      {/* ------------------------------------- */}
    </View>
  );
}

// --- ESTILOS PARA EL MODAL ---
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(29, 29, 29, 0.5)",
  },
});