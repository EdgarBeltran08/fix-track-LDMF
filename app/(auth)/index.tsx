import { Button, ButtonText } from "@/shared/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/shared/components/ui/form-control";
import { Input, InputField } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { useUserStore } from "@/shared/stores/useUserStore";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { InferType, object, string, ValidationError } from "yup";

const loginInputSchema = object({
  email: string()
    .email("Por favor ingresa un correo electrónico válido")
    .required("El correo electrónico es requerido"),
  password: string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede tener más de 100 caracteres")
    .required("La contraseña es requerida"),
});
type LoginInput = InferType<typeof loginInputSchema>;

export default function AuthIndex() {
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<Partial<LoginInput>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useUserStore();

  const handleEmailChange = (text: string) => {
    setFormData({ ...formData, email: text });
    if (validationErrors.email) {
      setValidationErrors({ ...validationErrors, email: undefined });
    }
  };

  const handlePasswordChange = (text: string) => {
    setFormData({ ...formData, password: text });
    if (validationErrors.password) {
      setValidationErrors({ ...validationErrors, password: undefined });
    }
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await loginInputSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<LoginInput> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path as keyof LoginInput] = err.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const getFirebaseErrorMessage = (
    errorCode: string
  ): { field: keyof LoginInput | null; message: string } => {
    switch (errorCode) {
      case "auth/user-not-found":
        return {
          field: "email",
          message: "No se encontró una cuenta con este correo electrónico",
        };
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return { field: "password", message: "Contraseña incorrecta" };
      case "auth/invalid-email":
        return {
          field: "email",
          message: "El formato del correo electrónico no es válido",
        };
      case "auth/user-disabled":
        return { field: "email", message: "Esta cuenta ha sido deshabilitada" };
      case "auth/too-many-requests":
        return {
          field: null,
          message: "Demasiados intentos. Intenta de nuevo más tarde",
        };
      case "auth/network-request-failed":
        return {
          field: null,
          message: "Error de conexión. Verifica tu internet",
        };
      default:
        return {
          field: null,
          message: "Error al iniciar sesión. Inténtalo de nuevo",
        };
    }
  };

  const handleLogin = async () => {
    if (isLoading) return;

    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);
    try {
      await signIn(formData.email, formData.password);
    } catch (error: any) {
      const { field, message } = getFirebaseErrorMessage(error.code);

      if (field) {
        setValidationErrors({ ...validationErrors, [field]: message });
      } else {
        // For general errors, we could show them in password field or use a toast
        setValidationErrors({ ...validationErrors, password: message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-0"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-typography-900 text-center mb-2">
              FixTrack
            </Text>
            <Text className="text-base text-typography-600 text-center">
              Gestión de Reparaciones de Celulares
            </Text>
          </View>

          {/* Login Card */}
          <View className="bg-background-50 rounded-lg p-6 border border-background-200 shadow-sm">
            <Text className="text-xl font-semibold text-typography-900 mb-6 text-center">
              Inicia sesión en tu cuenta
            </Text>

            {/* Email Field */}
            <FormControl className="mb-4" isInvalid={!!validationErrors.email}>
              <FormControlLabel>
                <FormControlLabelText className="text-typography-700 font-medium">
                  Correo electrónico
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" size="lg" className="mt-2">
                <InputField
                  placeholder="Ingresa tu correo electrónico"
                  value={formData.email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="text-typography-900"
                  editable={!isLoading}
                />
              </Input>
              {validationErrors.email && (
                <FormControlError className="mt-1">
                  <FormControlErrorText>
                    {validationErrors.email}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Password Field */}
            <FormControl
              className="mb-6"
              isInvalid={!!validationErrors.password}
            >
              <FormControlLabel>
                <FormControlLabelText className="text-typography-700 font-medium">
                  Contraseña
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" size="lg" className="mt-2">
                <InputField
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry
                  autoComplete="password"
                  className="text-typography-900"
                  editable={!isLoading}
                />
              </Input>
              {validationErrors.password && (
                <FormControlError className="mt-1">
                  <FormControlErrorText>
                    {validationErrors.password}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Login Button */}
            <Button
              size="lg"
              action="primary"
              onPress={handleLogin}
              className="mb-4"
              isDisabled={isLoading}
            >
              {isLoading ? (
                <Spinner color="white" size="small" />
              ) : (
                <ButtonText className="font-semibold">
                  Iniciar Sesión
                </ButtonText>
              )}
            </Button>

            {/* Forgot Password Link */}
            <Button
              variant="link"
              action="primary"
              onPress={() => console.log("Forgot password pressed")}
              className="self-center"
            >
              <ButtonText className="text-primary-600">
                ¿Olvidaste tu contraseña?
              </ButtonText>
            </Button>
          </View>

          {/* Footer */}
          <View className="mt-8">
            <Text className="text-sm text-typography-500 text-center">
              Optimiza el flujo de trabajo de tu taller con FixTrack
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
