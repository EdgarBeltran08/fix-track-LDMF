import { Button, ButtonText } from "@/shared/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/shared/components/ui/form-control";
import { Input, InputField } from "@/shared/components/ui/input";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function AuthIndex() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError("");
  };

  const handleLogin = () => {
    // Basic validation for UI demo
    let hasError = false;

    if (!email) {
      setEmailError("El correo electrónico es requerido");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Por favor ingresa un correo electrónico válido");
      hasError = true;
    }

    if (!password) {
      setPasswordError("La contraseña es requerida");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      hasError = true;
    }

    if (!hasError) {
      // Authentication logic will be implemented later
      console.log("Login attempted with:", { email, password });
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
            <FormControl className="mb-4" isInvalid={!!emailError}>
              <FormControlLabel>
                <FormControlLabelText className="text-typography-700 font-medium">
                  Correo electrónico
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" size="lg" className="mt-2">
                <InputField
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="text-typography-900"
                />
              </Input>
              {emailError && (
                <FormControlError className="mt-1">
                  <FormControlErrorText>{emailError}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Password Field */}
            <FormControl className="mb-6" isInvalid={!!passwordError}>
              <FormControlLabel>
                <FormControlLabelText className="text-typography-700 font-medium">
                  Contraseña
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" size="lg" className="mt-2">
                <InputField
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry
                  autoComplete="password"
                  className="text-typography-900"
                />
              </Input>
              {passwordError && (
                <FormControlError className="mt-1">
                  <FormControlErrorText>{passwordError}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Login Button */}
            <Button
              size="lg"
              action="primary"
              onPress={handleLogin}
              className="mb-4"
            >
              <ButtonText className="font-semibold">Iniciar Sesión</ButtonText>
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
