import { Badge } from "@/shared/components/ui/badge";
import { Button, ButtonText } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { RepairsRepository } from "@/shared/repositories/repairs.repository";
import { Repair, RepairNote, RepairPiece } from "@/shared/types/repair.type";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const getStatusText = (status: Repair["status"]) => {
  const statusMap = {
    in_review: "En Revisión",
    repairing: "Reparando",
    waiting_parts: "Esperando Piezas",
    done: "Terminado",
    not_repaired: "No Reparado",
    delivered: "Entregado",
  };
  return statusMap[status];
};

const getStatusColor = (status: Repair["status"]) => {
  const colorMap = {
    in_review: "info",
    repairing: "warning",
    waiting_parts: "muted",
    done: "success",
    not_repaired: "error",
    delivered: "success",
  };
  return colorMap[status] as "info" | "warning" | "muted" | "success" | "error";
};

const getStatusBadgeStyle = (status: Repair["status"]) => {
  const styleMap = {
    in_review: "bg-blue-100 border-blue-400",
    repairing: "bg-orange-100 border-orange-400",
    waiting_parts: "bg-gray-100 border-gray-400",
    done: "bg-green-100 border-green-400",
    not_repaired: "bg-red-100 border-red-400",
    delivered: "bg-emerald-100 border-emerald-400",
  };
  return styleMap[status];
};

const getStatusTextStyle = (status: Repair["status"]) => {
  const styleMap = {
    in_review: "text-blue-800",
    repairing: "text-orange-800",
    waiting_parts: "text-gray-700",
    done: "text-green-800",
    not_repaired: "text-red-800",
    delivered: "text-emerald-800",
  };
  return styleMap[status];
};

export default function DetallesEquipoView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [repair, setRepair] = useState<Repair | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRepair();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadRepair = async () => {
    try {
      setLoading(true);
      const repairData = await RepairsRepository.getById(id as string);
      setRepair(repairData);
    } catch (error) {
      console.error("Error loading repair:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background-0 items-center justify-center">
        <ActivityIndicator size="large" color="#FFB74D" />
        <Text className="text-typography-500 mt-4">Cargando detalles...</Text>
      </View>
    );
  }

  if (!repair) {
    return (
      <View className="flex-1 bg-background-0 items-center justify-center px-6">
        <View className="bg-background-100 w-20 h-20 rounded-full items-center justify-center mb-4">
          <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
        </View>
        <Text className="text-typography-900 font-bold text-xl mb-2">
          Reparación no encontrada
        </Text>
        <Text className="text-typography-600 text-center mb-6">
          No se pudo cargar la información de la reparación
        </Text>
        <Button onPress={() => router.back()} action="primary">
          <ButtonText>Volver</ButtonText>
        </Button>
      </View>
    );
  }

  // Calculate totals
  const partsCost = repair.pieces.reduce(
    (acc, piece) => acc + piece.unitCost * piece.quantity,
    0
  );
  
  // 🚨 CÁLCULO CORREGIDO: Total a Pagar = Max(0, Costo Piezas/Servicios - Anticipo de Diagnóstico)
  const totalCost = Math.max(0, partsCost - (repair.estimatedCost || 0));

  return (
    <View className="flex-1 bg-primary-0">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="bg-background-50 pt-12 pb-6 px-6 border-b-2 border-primary-400">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 w-10 h-10 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-secondary-900">
                Detalles
              </Text>
              <Text className="text-sm text-primary-500 mt-1">
                Vista completa de reparación
              </Text>
            </View>
          </View>
          <View className="bg-info-500 w-12 h-12 rounded-full items-center justify-center">
            <Ionicons name="document-text" size={24} color="white" />
          </View>
        </View>

        {/* Folio and Status */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xs font-semibold text-primary-600 mb-1">
              FOLIO
            </Text>
            <Text className="text-xl font-bold text-typography-900">
              {repair.folio}
            </Text>
          </View>
          <Badge
            action={getStatusColor(repair.status)}
            variant="outline"
            className={`border-2 ${getStatusBadgeStyle(repair.status)}`}
          >
            <Text
              className={`text-xs font-bold ${getStatusTextStyle(
                repair.status
              )}`}
            >
              {getStatusText(repair.status)}
            </Text>
          </Badge>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Client Information */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="person-circle"
              size={24}
              color="#FFB74D"
              style={{ marginRight: 8 }}
            />
            <Text className="text-lg font-bold text-typography-900">
              Datos del Cliente
            </Text>
          </View>
          <Card className="p-5 bg-background-50 border-2 border-primary-500 rounded-xl">
            <View className="mb-3">
              <Text className="text-xs font-semibold text-typography-600 mb-1">
                NOMBRE
              </Text>
              <Text className="text-base font-bold text-typography-900">
                {repair.customerName}
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-xs font-semibold text-typography-600 mb-1">
                TELÉFONO
              </Text>
              <View className="flex-row items-center">
                <Ionicons
                  name="call"
                  size={16}
                  color="#c8bd65ff"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-base text-typography-900">
                  {repair.customerPhone}
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-xs font-semibold text-typography-600 mb-1">
                CORREO ELECTRÓNICO
              </Text>
              <View className="flex-row items-center">
                <Ionicons
                  name="mail"
                  size={16}
                  color="#c8bd65ff"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-base text-typography-900">
                  {repair.customerEmail}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Device Information */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="phone-portrait"
              size={24}
              color="#FFB74D"
              style={{ marginRight: 8 }}
            />
            <Text className="text-lg font-bold text-typography-900">
              Datos del Equipo
            </Text>
          </View>
          <Card className="p-5 bg-background-50 border-2 border-primary-500 rounded-xl">
            <View className="mb-3">
              <Text className="text-xs font-semibold text-typography-600 mb-1">
                MODELO DEL DISPOSITIVO
              </Text>
              <Text className="text-base font-bold text-typography-900">
                {repair.deviceModel}
              </Text>
            </View>
            <View>
              <Text className="text-xs font-semibold text-typography-600 mb-1">
                DESCRIPCIÓN DEL PROBLEMA
              </Text>
              <Text className="text-base text-typography-900 leading-6">
                {repair.issueDescription}
              </Text>
            </View>
          </Card>
        </View>

        {/* Pieces Used */}
        {repair.pieces.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="construct"
                size={24}
                color="#FFB74D"
                style={{ marginRight: 8 }}
              />
              <Text className="text-lg font-bold text-typography-900">
                Piezas Utilizadas y Mano de Obra
              </Text>
              <View className="ml-2 bg-primary-400 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-bold">
                  {repair.pieces.length}
                </Text>
              </View>
            </View>
            <Card className="p-4 bg-background-50 border-2 border-background-200 rounded-xl">
              {repair.pieces.map((piece: RepairPiece, index: number) => (
                <View
                  key={piece.id}
                  className={`py-3 ${
                    index < repair.pieces.length - 1
                      ? "border-b border-background-200"
                      : ""
                  }`}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 pr-4">
                      <Text className="text-base font-bold text-typography-900">
                        {piece.name}
                      </Text>
                      <Text className="text-sm text-typography-600 mt-1">
                        Cantidad: {piece.quantity}
                      </Text>
                    </View>
                    <Text className="text-lg font-bold text-primary-600">
                      $
                      {(piece.unitCost * piece.quantity).toLocaleString(
                        "es-MX"
                      )}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-xs text-typography-500">
                      Precio unitario: ${piece.unitCost.toLocaleString("es-MX")}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Costs */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="cash"
              size={24}
              color="#FFB74D"
              style={{ marginRight: 8 }}
            />
            <Text className="text-lg font-bold text-typography-900">
              Costos de la Reparación
            </Text>
          </View>
          <Card className="p-5 bg-background-50 border-2 border-primary-300 rounded-xl">
            {repair.pieces.length > 0 && (
              <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-background-200">
                <View className="flex-row items-center">
                  <Ionicons
                    name="cube-outline"
                    size={18}
                    color="#c8bd65ff"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-base font-semibold text-typography-900">
                    Piezas y Mano de Obra
                  </Text>
                </View>
                <Text className="text-base font-bold text-typography-900">
                  ${partsCost.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            )}
            
            <View className="flex-row justify-between items-center pb-3">
              <Text className="text-typography-900">Anticipo de Diagnóstico</Text>
              <Text className="font-semibold text-typography-900">
                -${(repair.estimatedCost || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>

            <View className="flex-row justify-between items-center pt-3 border-t-2 border-primary-300">
              <Text className="text-lg font-bold text-typography-900">
                Total a Pagar
              </Text>
              <Text className="text-2xl font-bold text-primary-600">
                ${totalCost.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          </Card>
        </View>

        {/* Notes */}
        {repair.notes.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#FFB74D"
                style={{ marginRight: 8 }}
              />
              <Text className="text-lg font-bold text-typography-900">
                Notas de Reparación
              </Text>
              <View className="ml-2 bg-info-500 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-bold">
                  {repair.notes.length}
                </Text>
              </View>
            </View>
            <Card className="p-4 bg-background-50 border-2 border-background-200 rounded-xl">
              {repair.notes.map((note: RepairNote, index: number) => (
                <View
                  key={note.id}
                  className={`py-3 ${
                    index < repair.notes.length - 1
                      ? "border-b border-background-200"
                      : ""
                  }`}
                >
                  <View className="flex-row items-center mb-2">
                    <View className="bg-info-100 w-8 h-8 rounded-full items-center justify-center mr-2">
                      <Ionicons name="chatbox" size={16} color="#3B82F6" />
                    </View>
                    <Text className="text-xs text-typography-500">
                      {note.createdAt.toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <Text className="text-base text-typography-900 leading-6 ml-10">
                    {note.text}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Timestamps */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="time"
              size={24}
              color="#FFB74D"
              style={{ marginRight: 8 }}
            />
            <Text className="text-lg font-bold text-typography-900">
              Información Adicional
            </Text>
          </View>
          <Card className="p-5 bg-background-50 border-2 border-primary-500">
            <View className="mb-3">
              <Text className="text-xs font-semibold text-typography-600 mb-1">
                FECHA DE REGISTRO
              </Text>
              <View className="flex-row items-center">
                <Ionicons
                  name="calendar"
                  size={16}
                  color="#c8bd65ff"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-base text-typography-900">
                  {repair.createdAt.toLocaleDateString("es-MX", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
            {repair.updatedAt && (
              <View>
                <Text className="text-xs font-semibold text-typography-600 mb-1">
                  ÚLTIMA ACTUALIZACIÓN
                </Text>
                <View className="flex-row items-center">
                  <Ionicons
                    name="refresh"
                    size={16}
                    color="#c8bd65ff"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-base text-typography-900">
                    {repair.updatedAt.toLocaleDateString("es-MX", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            )}
          </Card>
        </View>

        {/* Action Buttons */}
        <View className="gap-3 mb-6">
          <Button
            action="primary"
            size="lg"
            className="rounded-xl"
            onPress={() =>
              router.push(`/(private)/(tabs)/repairs/details?id=${repair.id}`)
            }
          >
            <Ionicons
              name="create"
              size={22}
              color="white"
              style={{ marginRight: 8 }}
            />
            <ButtonText className="font-bold text-base">
              Editar Reparación
            </ButtonText>
          </Button>

          <Button
            action="secondary"
            variant="outline"
            size="lg"
            className="rounded-xl border-2 bg-background-50 border-primary-500"
            onPress={() =>
              router.push(`/(private)/(tabs)/repairs/status?id=${repair.id}`)
            }
          >
            <Ionicons
              name="swap-horizontal"
              size={22}
              color="#6B7280"
              style={{ marginRight: 8 }}
            />
            <ButtonText className="font-bold text-base">
              Cambiar Estado
            </ButtonText>
          </Button>

          {repair.status === "done" && (
            <Button
              action="positive"
              size="lg"
              className="rounded-xl bg-success-500"
              onPress={() =>
                router.push(
                  `/(private)/(tabs)/repairs/delivery?id=${repair.id}`
                )
              }
            >
              <Ionicons
                name="checkmark-done"
                size={22}
                color="white"
                style={{ marginRight: 8 }}
              />
              <ButtonText className="font-bold text-base">
                Entregar Reparación
              </ButtonText>
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  );
}