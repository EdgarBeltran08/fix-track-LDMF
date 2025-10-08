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
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
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

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" zoomAndPan="magnify" viewBox="0 0 810 809.999993" height="120" preserveAspectRatio="xMidYMid meet" version="1.0"><path fill="#0c6aba" d="M 268.246094 30.773438 L 276.132812 30.714844 L 284.738281 30.695312 L 293.839844 30.640625 C 303.785156 30.589844 313.734375 30.558594 323.683594 30.53125 L 333.984375 30.5 C 350.121094 30.449219 366.261719 30.414062 382.402344 30.390625 C 400.988281 30.363281 419.570312 30.292969 438.15625 30.183594 C 454.289062 30.09375 470.421875 30.0625 486.554688 30.050781 C 493.398438 30.039062 500.242188 30.007812 507.085938 29.960938 C 516.679688 29.894531 526.269531 29.894531 535.859375 29.914062 L 544.382812 29.8125 C 562.160156 29.9375 575.492188 33.027344 591.007812 41.824219 C 604.433594 50.800781 614.40625 62.089844 622.960938 75.699219 C 630.601562 93.015625 631.753906 109.800781 631.6875 128.421875 L 631.722656 135.898438 C 631.757812 144.125 631.753906 152.347656 631.75 160.570312 C 631.765625 166.484375 631.785156 172.398438 631.804688 178.3125 C 631.851562 194.34375 631.863281 210.378906 631.867188 226.414062 C 631.871094 236.441406 631.878906 246.464844 631.894531 256.488281 C 631.941406 289.683594 631.964844 322.875 631.964844 356.066406 L 631.964844 366.898438 C 631.960938 395.882812 632.011719 424.863281 632.085938 453.84375 C 632.164062 483.652344 632.199219 513.460938 632.191406 543.269531 C 632.191406 559.984375 632.210938 576.699219 632.265625 593.414062 C 632.316406 609.136719 632.320312 624.863281 632.277344 640.589844 C 632.273438 646.34375 632.285156 652.101562 632.316406 657.859375 C 632.617188 714.785156 632.617188 714.785156 620.316406 737.167969 C 611.148438 752.058594 601.011719 763.230469 585.679688 771.800781 C 567.773438 779.726562 551.144531 780.945312 531.761719 780.828125 L 522.984375 780.867188 C 513.464844 780.902344 503.953125 780.882812 494.433594 780.851562 C 487.78125 780.859375 481.128906 780.867188 474.476562 780.878906 C 458.78125 780.886719 443.082031 780.867188 427.382812 780.820312 C 414.90625 780.792969 402.425781 780.796875 389.949219 780.835938 C 372.679688 780.878906 355.410156 780.890625 338.140625 780.859375 C 331.582031 780.855469 325.023438 780.863281 318.460938 780.882812 C 309.277344 780.902344 300.089844 780.871094 290.902344 780.828125 L 282.773438 780.878906 C 262.726562 780.699219 244.40625 777.550781 226.6875 767.78125 C 212.925781 756.738281 201.90625 745.117188 194.011719 729.175781 C 188.847656 714.242188 187.910156 701.042969 187.96875 685.320312 L 187.933594 677.78125 C 187.898438 669.476562 187.902344 661.175781 187.90625 652.867188 C 187.890625 646.902344 187.875 640.9375 187.851562 634.96875 C 187.804688 618.78125 187.792969 602.59375 187.789062 586.402344 C 187.785156 576.285156 187.777344 566.164062 187.761719 556.042969 C 187.714844 520.722656 187.691406 485.398438 187.691406 450.070312 L 187.691406 444.59375 C 187.695312 415.335938 187.644531 386.078125 187.570312 356.820312 C 187.492188 326.738281 187.457031 296.652344 187.464844 266.570312 C 187.464844 249.695312 187.449219 232.820312 187.390625 215.949219 C 187.339844 200.070312 187.335938 184.195312 187.378906 168.324219 C 187.382812 162.507812 187.371094 156.695312 187.339844 150.882812 C 187.042969 93.765625 187.042969 93.765625 199.339844 71.128906 C 208.074219 57.402344 219.242188 47.273438 233.308594 39.160156 C 245.027344 33.089844 255.066406 30.84375 268.246094 30.773438 M 241.96875 76.457031 C 233.324219 84.871094 229.121094 93.789062 225.007812 105.082031 C 222.128906 115.316406 222.21875 125.292969 222.304688 135.863281 L 222.265625 143.160156 C 222.246094 151.179688 222.25 159.199219 222.285156 167.21875 C 222.273438 172.992188 222.257812 178.761719 222.242188 184.527344 C 222.207031 200.167969 222.222656 215.804688 222.246094 231.441406 C 222.265625 247.820312 222.246094 264.199219 222.234375 280.578125 C 222.21875 308.078125 222.238281 335.578125 222.277344 363.078125 C 222.320312 394.863281 222.304688 426.640625 222.261719 458.421875 C 222.226562 485.722656 222.21875 513.027344 222.242188 540.328125 C 222.257812 556.628906 222.253906 572.925781 222.230469 589.226562 C 222.207031 604.554688 222.21875 619.878906 222.269531 635.203125 C 222.28125 640.820312 222.277344 646.4375 222.257812 652.058594 C 222.238281 659.738281 222.265625 667.417969 222.304688 675.097656 L 222.25 681.804688 C 222.398438 696.617188 225.234375 707.628906 231.3125 721.179688 C 236.203125 727.3125 236.203125 727.3125 241.96875 731.671875 L 247.464844 736.238281 C 252.789062 740.300781 252.789062 740.300781 260.621094 742.496094 C 264.675781 742.746094 268.742188 742.855469 272.800781 742.867188 L 280.375 742.914062 L 288.667969 742.921875 L 297.414062 742.964844 C 306.984375 743 316.550781 743.023438 326.117188 743.035156 L 346.039062 743.082031 C 358.191406 743.109375 370.34375 743.125 382.496094 743.132812 C 398.589844 743.140625 414.683594 743.175781 430.773438 743.242188 C 448.039062 743.3125 465.304688 743.351562 482.574219 743.359375 C 489.15625 743.363281 495.742188 743.386719 502.324219 743.421875 C 511.535156 743.46875 520.742188 743.460938 529.953125 743.441406 L 538.199219 743.519531 C 549.640625 743.449219 557.792969 742.988281 568.539062 738.726562 C 574.785156 734.65625 579.15625 730.941406 583.851562 725.175781 L 587.816406 720.433594 C 591.519531 715.585938 591.519531 715.585938 593.671875 707.859375 C 593.925781 702.84375 594.015625 697.820312 594.023438 692.800781 L 594.054688 683.292969 L 594.050781 672.851562 L 594.078125 661.863281 C 594.101562 653.96875 594.113281 646.074219 594.125 638.179688 C 594.140625 625.683594 594.179688 613.1875 594.234375 600.691406 L 594.285156 587.847656 L 594.308594 581.351562 C 594.421875 552.257812 594.511719 523.167969 594.542969 494.078125 C 594.5625 474.453125 594.625 454.832031 594.730469 435.207031 C 594.777344 424.828125 594.8125 414.453125 594.796875 404.074219 C 594.789062 394.300781 594.820312 384.527344 594.898438 374.75 C 594.921875 369.484375 594.898438 364.21875 594.871094 358.949219 C 595.054688 341.699219 596.363281 328.339844 604.523438 312.972656 C 613.613281 295.574219 610.4375 271.429688 609.921875 252.203125 C 609.238281 238.492188 606.355469 227.0625 600.269531 214.808594 C 595.351562 203.335938 595.296875 192.867188 595.445312 180.535156 L 595.339844 166.804688 C 595.328125 159.671875 595.339844 152.542969 595.378906 145.410156 C 595.398438 138.46875 595.339844 131.53125 595.277344 124.589844 L 595.382812 118.210938 C 595.265625 109.367188 594.636719 102.519531 590.894531 94.421875 C 585.300781 85.132812 580.695312 79.386719 572.023438 72.628906 C 561.886719 67.121094 554.710938 65.472656 543.351562 65.542969 L 535.777344 65.570312 L 527.898438 65.632812 L 519.917969 65.671875 C 513.414062 65.703125 506.917969 65.746094 500.417969 65.800781 L 498.367188 71.441406 L 495.589844 78.789062 L 492.875 86.09375 L 489.761719 92.441406 C 481.769531 97.769531 481.769531 97.769531 473.980469 98.875 C 449.023438 100.25 424.074219 100.765625 399.082031 100.902344 C 395.390625 100.925781 391.695312 100.953125 388.003906 100.992188 C 382.730469 101.039062 377.449219 101.046875 372.171875 101.046875 L 362.855469 101.082031 C 352.960938 100.367188 344.582031 98.382812 335.222656 95.105469 C 326.121094 86.25 323.011719 77.726562 319.238281 65.800781 C 310.359375 65.503906 301.476562 65.285156 292.59375 65.136719 L 285.046875 64.863281 C 268.277344 64.628906 255.964844 66.894531 241.96875 76.457031 " fill-opacity="1" fill-rule="nonzero"/><path fill="#FFB74D" d="M 556.371094 238.96875 C 564.507812 243.269531 570.328125 247.042969 576.023438 254.289062 C 578.5625 263.433594 579.636719 272.324219 577.6875 281.597656 C 568.929688 297.828125 555.3125 309.792969 542.21875 322.558594 C 524.5 339.761719 524.5 339.761719 507.902344 358.027344 C 492.625 375.839844 475.457031 391.980469 458.789062 408.476562 C 451.863281 415.332031 444.941406 422.195312 438.03125 429.0625 L 433.296875 433.730469 C 423.976562 442.992188 415.492188 452.59375 407.164062 462.757812 C 398.410156 471.277344 389.402344 479.351562 377.648438 483.242188 C 371.585938 483.8125 367.636719 483.386719 361.867188 481.40625 C 353.714844 476.183594 347.28125 469.6875 340.554688 462.757812 L 320.40625 442.527344 C 314.875 437.074219 309.160156 431.832031 303.25 426.792969 C 294.71875 419.441406 286.519531 411.824219 278.441406 403.984375 L 271.808594 397.5625 C 265.507812 390.320312 261.628906 383.691406 257.957031 374.84375 C 257.957031 365.519531 257.957031 365.519531 260.621094 356.191406 C 264.5625 349.871094 268.585938 345.566406 273.941406 340.207031 C 283.472656 337.03125 290.570312 336.851562 300.585938 337.542969 C 311.289062 342.917969 318.917969 349.949219 327.261719 358.464844 L 334.710938 365.996094 L 342.382812 373.84375 C 347.4375 378.992188 352.5 384.132812 357.570312 389.269531 L 364.332031 396.171875 C 369.4375 401.601562 369.4375 401.601562 375.191406 404.148438 L 377.316406 399.394531 C 380.667969 393.222656 384.160156 389.222656 389.148438 384.304688 L 394.457031 379.019531 L 400.203125 373.386719 L 406.136719 367.492188 C 412.410156 361.273438 418.6875 355.066406 424.980469 348.867188 C 431.222656 342.703125 437.457031 336.53125 443.683594 330.355469 C 447.558594 326.515625 451.4375 322.683594 455.320312 318.863281 C 465.828125 308.488281 475.886719 297.695312 485.5 286.484375 C 492.941406 277.953125 500.910156 269.953125 508.910156 261.949219 L 513.777344 256.984375 L 518.519531 252.230469 L 522.726562 247.988281 C 533.394531 238.910156 542.472656 237.53125 556.371094 238.96875 " fill-opacity="1" fill-rule="nonzero"/><path fill="#FFB74D" d="M 300.585938 337.542969 C 311.589844 343.039062 319.429688 350.4375 328.03125 359.136719 L 331.921875 363.046875 C 335.972656 367.132812 340.015625 371.230469 344.050781 375.339844 L 352.339844 383.707031 C 359.082031 390.507812 365.8125 397.320312 372.527344 404.148438 C 367.6875 412.394531 363.089844 419.324219 356.375 426.128906 C 349.757812 433.5625 347.003906 439.546875 344.882812 449.273438 C 344.269531 452.871094 343.695312 456.476562 343.21875 460.09375 C 335.207031 456.523438 329.902344 452.640625 323.902344 446.277344 C 317.488281 439.628906 310.769531 433.300781 303.753906 427.292969 C 295.097656 419.761719 286.660156 411.992188 278.441406 403.984375 L 271.808594 397.5625 C 265.507812 390.320312 261.628906 383.691406 257.957031 374.84375 C 257.957031 365.519531 257.957031 365.519531 260.621094 356.191406 C 264.5625 349.871094 268.585938 345.566406 273.941406 340.207031 C 283.472656 337.03125 290.570312 336.851562 300.585938 337.542969 " fill-opacity="1" fill-rule="nonzero"/><path fill="#0767b9" d="M 356.539062 678.554688 C 364.476562 677.957031 372.152344 677.679688 380.09375 677.660156 L 387.179688 677.605469 C 392.132812 677.578125 397.085938 677.566406 402.039062 677.566406 C 409.621094 677.542969 417.207031 677.472656 424.792969 677.359375 C 429.597656 677.34375 434.402344 677.332031 439.210938 677.328125 L 446.097656 677.210938 C 451.960938 677.257812 457.363281 677.414062 463.117188 678.554688 C 468.578125 683.417969 468.578125 683.417969 471.109375 689.210938 C 471.609375 697.871094 471.609375 697.871094 471.109375 705.195312 C 465.074219 708.214844 461.691406 708.226562 454.992188 708.289062 L 448.253906 708.371094 L 440.96875 708.402344 L 433.5 708.445312 C 428.289062 708.472656 423.078125 708.488281 417.863281 708.5 C 409.859375 708.527344 401.863281 708.609375 393.863281 708.691406 C 388.804688 708.710938 383.746094 708.722656 378.6875 708.734375 L 371.40625 708.835938 L 364.667969 708.808594 L 358.726562 708.839844 L 353.875 707.859375 L 348.546875 699.867188 C 349.210938 691.710938 349.210938 691.710938 351.210938 683.882812 Z M 356.539062 678.554688 " fill-opacity="1" fill-rule="nonzero"/></svg>`;

export default function AuthIndex() {
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<Partial<LoginInput>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { signIn } = useUserStore();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
        setValidationErrors({ ...validationErrors, password: message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#193456]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, minHeight: "100%" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 justify-center px-6 py-8 min-h-full">
          {/* Header with Logo */}
          {!keyboardVisible && (
            <View className="mb-8 items-center flex-shrink-0">
              {/* Logo Container */}
              <View className="mb-4 p-4 rounded-full bg-primary-50 shadow-lg shadow-primary-200/30">
                <SvgXml xml={logoSvg} width={80} height={80} />
              </View>

              {/* App Title */}
              <View className="items-center">
                <Text className="text-4xl font-black text-[#FFB74D] mb-2 tracking-tight">
                  FixTrack
                </Text>
                <Text className="text-lg text-gray-300 text-center max-w-xs leading-relaxed">
                  Gestión para talleres de reparación
                </Text>
              </View>
            </View>
          )}
          {/* Compact header for keyboard mode */}
          {keyboardVisible && (
            <View className="mb-6 items-center flex-shrink-0">
              <Text className="text-2xl font-black text-[#FFB74D] mb-1 tracking-tight">
                FixTrack
              </Text>
              <Text className="text-sm text-gray-300 text-center">
                Iniciar sesión
              </Text>
            </View>
          )}
          {/* Login Card */}
          <View className="bg-[#EDFFFD] rounded-2xl p-8 border border-[#FFB74D] shadow-xl shadow-primary-900/5 flex-shrink-0">
            {!keyboardVisible && (
              <View className="mb-6 items-center">
                <Text className="text-2xl font-bold text-typography-900 mb-2">
                  Bienvenido
                </Text>
                <Text className="text-sm text-typography-500">
                  Inicia sesión para acceder a tu panel de control
                </Text>
              </View>
            )}

            {/* Email Field */}
            <FormControl className="mb-4" isInvalid={!!validationErrors.email}>
              <FormControlLabel>
                <FormControlLabelText className="text-typography-700 font-semibold text-base mb-1">
                  Correo electrónico
                </FormControlLabelText>
              </FormControlLabel>
              <Input
                variant="outline"
                size="lg"
                className="mt-1 border-2 border-[#FFB74D] focus:border-[#FFB74D]"
              >
                <InputField
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="text-typography-900 text-base"
                  editable={!isLoading}
                />
              </Input>
              {validationErrors.email && (
                <FormControlError className="mt-1">
                  <FormControlErrorText className="text-error-600 text-sm">
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
                <FormControlLabelText className="text-typography-700 font-semibold text-base mb-1">
                  Contraseña
                </FormControlLabelText>
              </FormControlLabel>
              <Input
                variant="outline"
                size="lg"
                className="mt-1 border-2 border-[#FFB74D] focus:border-[#FFB74D]"
              >
                <InputField
                  placeholder="Tu contraseña segura"
                  value={formData.password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry
                  autoComplete="password"
                  className="text-typography-900 text-base"
                  editable={!isLoading}
                />
              </Input>
              {validationErrors.password && (
                <FormControlError className="mt-1">
                  <FormControlErrorText className="text-error-600 text-sm">
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
              className="mb-4 h-14 rounded-xl bg-[#FFB74D] shadow-lg shadow-[#FFB74D]/20"
              isDisabled={isLoading}
            >
              {isLoading ? (
                <Spinner color="white" size="small" />
              ) : (
                <ButtonText className="font-bold text-lg">
                  Iniciar Sesión
                </ButtonText>
              )}
            </Button>
          </View>
          {/* Footer */}
          {!keyboardVisible && (
            <View className="mt-6 items-center flex-shrink-0">
              <Text className="text-sm text-gray-300 text-center leading-relaxed max-w-sm">
                Optimiza el flujo de trabajo de tu taller con tecnología de
                vanguardia
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
