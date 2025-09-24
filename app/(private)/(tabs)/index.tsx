import { Badge } from "@/shared/components/ui/badge";
import { Button, ButtonText } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input, InputField } from "@/shared/components/ui/input";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

// Mock data types
type User = {
  name: string;
  email: string;
  role: "receptionist" | "technician" | "admin";
  createdAt: Date;
  isActive: boolean;
};

type Repair = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deviceModel: string;
  issueDescription: string;
  status:
    | "in_review"
    | "repairing"
    | "waiting_parts"
    | "done"
    | "not_repaired"
    | "delivered";
  createdAt: Date;
  updatedAt: Date;
  assignedTo: string;
  estimatedCost: number;
  finalCost: number;
  deliveryDate: Date | null;
  folio: string;
};

// Mock data
const mockUser: User = {
  name: "Leon Casas",
  email: "leon@fixtrack.com",
  role: "admin",
  createdAt: new Date(),
  isActive: true,
};

const mockRepairs: Repair[] = [
  {
    id: "1",
    customerName: "Michelle Garza",
    customerEmail: "michelle@email.com",
    customerPhone: "555-1234",
    deviceModel: "iPhone 14 Pro",
    issueDescription: "Pantalla rota, no responde al tacto",
    status: "repairing",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
    assignedTo: "tech-1",
    estimatedCost: 2500,
    finalCost: 0,
    deliveryDate: new Date("2024-01-20"),
    folio: "FT-2024-001",
  },
  {
    id: "2",
    customerName: "Carlos Mendoza",
    customerEmail: "carlos@email.com",
    customerPhone: "555-9012",
    deviceModel: "iPhone 13",
    issueDescription: "Problema con el audio",
    status: "in_review",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date(),
    assignedTo: "tech-1",
    estimatedCost: 1200,
    finalCost: 0,
    deliveryDate: null,
    folio: "FT-2024-003",
  },
  {
    id: "3",
    customerName: "Ana López",
    customerEmail: "ana@email.com",
    customerPhone: "555-5678",
    deviceModel: "Samsung Galaxy S23",
    issueDescription: "No carga la batería",
    status: "waiting_parts",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date(),
    assignedTo: "tech-2",
    estimatedCost: 800,
    finalCost: 0,
    deliveryDate: null,
    folio: "FT-2024-002",
  },
  {
    id: "4",
    customerName: "Sofia Herrera",
    customerEmail: "sofia@email.com",
    customerPhone: "555-3456",
    deviceModel: "Xiaomi Redmi Note 12",
    issueDescription: "Cámara trasera no funciona",
    status: "done",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date(),
    assignedTo: "tech-3",
    estimatedCost: 600,
    finalCost: 650,
    deliveryDate: new Date("2024-01-18"),
    folio: "FT-2024-004",
  },
];

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
    in_review: "bg-blue-100 border-blue-300",
    repairing: "bg-orange-100 border-orange-300",
    waiting_parts: "bg-gray-100 border-gray-400",
    done: "bg-green-100 border-green-300",
    not_repaired: "bg-red-100 border-red-300",
    delivered: "bg-green-100 border-green-300",
  };
  return styleMap[status];
};

const getStatusTextStyle = (status: Repair["status"]) => {
  const styleMap = {
    in_review: "text-blue-700",
    repairing: "text-orange-700",
    waiting_parts: "text-gray-700",
    done: "text-green-700",
    not_repaired: "text-red-700",
    delivered: "text-green-700",
  };
  return styleMap[status];
};

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Filter repairs based on search
  const filteredRepairs = mockRepairs.filter(
    (repair) =>
      repair.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      repair.deviceModel.toLowerCase().includes(searchText.toLowerCase()) ||
      repair.folio.toLowerCase().includes(searchText.toLowerCase())
  );

  // Get status counts
  const statusCounts = mockRepairs.reduce((acc, repair) => {
    acc[repair.status] = (acc[repair.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderRepairCard = ({ item }: { item: Repair }) => (
    <Pressable className="mb-3">
      <Card className="p-4 bg-background-50 border border-background-200">
        {/* Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-typography-900 mb-1">
              {item.customerName}
            </Text>
            <Text className="text-sm text-typography-600">{item.folio}</Text>
          </View>
          <Badge
            action={getStatusColor(item.status)}
            variant="outline"
            className={`ml-2 border-2 ${getStatusBadgeStyle(item.status)}`}
          >
            <Text
              className={`text-xs font-bold ${getStatusTextStyle(item.status)}`}
            >
              {getStatusText(item.status)}
            </Text>
          </Badge>
        </View>

        {/* Device Info */}
        <View className="mb-3">
          <Text className="text-base font-medium text-typography-800 mb-1">
            {item.deviceModel}
          </Text>
          <Text className="text-sm text-typography-600" numberOfLines={2}>
            {item.issueDescription}
          </Text>
        </View>

        {/* Footer */}
        <View className="flex-row justify-between items-center pt-3 border-t border-background-200">
          <View className="flex-row items-center">
            <Ionicons
              name="calendar-outline"
              size={16}
              color="#6B7280"
              style={{ marginRight: 4 }}
            />
            <Text className="text-sm text-typography-600">
              {item.createdAt.toLocaleDateString("es-MX")}
            </Text>
          </View>
          <Text className="text-base font-semibold text-primary-600">
            ${item.estimatedCost.toLocaleString("es-MX")}
          </Text>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-background-0">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="bg-background-50 pt-12 pb-6 px-6 border-b border-background-200">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold text-typography-900">
              ¡Hola, {mockUser.name.split(" ")[0]}!
            </Text>
            <Text className="text-sm text-typography-600 capitalize">
              {mockUser.role}
            </Text>
          </View>
          <View className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center">
            <Text className="text-white font-bold text-lg">
              {mockUser.name.charAt(0)}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <View className="flex-row space-x-4">
            <View className="bg-background-0 px-4 py-3 rounded-lg border border-background-200 min-w-[110px]">
              <Text className="text-2xl font-bold text-warning-600 text-center">
                {statusCounts.repairing || 0}
              </Text>
              <Text className="text-xs text-typography-600 text-center">
                Reparando
              </Text>
            </View>
            <View className="bg-background-0 px-4 py-3 rounded-lg border border-background-200 min-w-[110px]">
              <Text className="text-2xl font-bold text-info-600 text-center">
                {statusCounts.in_review || 0}
              </Text>
              <Text className="text-xs text-typography-600 text-center">
                En Revisión
              </Text>
            </View>
            <View className="bg-background-0 px-4 py-3 rounded-lg border border-background-200 min-w-[110px]">
              <Text className="text-2xl font-bold text-success-600 text-center">
                {statusCounts.done || 0}
              </Text>
              <Text className="text-xs text-typography-600 text-center">
                Terminados
              </Text>
            </View>
            <View className="bg-background-0 px-4 py-3 rounded-lg border border-background-200 min-w-[110px]">
              <Text className="text-2xl font-bold text-typography-500 text-center">
                {statusCounts.waiting_parts || 0}
              </Text>
              <Text className="text-xs text-typography-600 text-center">
                Esperando Piezas
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Action Bar */}
      <View className="px-6 py-4 bg-background-50 border-b border-background-200">
        <View className="flex-row space-x-3 mb-3">
          <Button
            action="primary"
            size="lg"
            className="flex-1"
            onPress={() => router.push("/(private)/(tabs)/repairs/create")}
          >
            <Ionicons
              name="add"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <ButtonText className="font-semibold">Nueva Reparación</ButtonText>
          </Button>
        </View>

        {/* Search Bar */}
        <View className="relative">
          <Input variant="outline" size="md">
            <InputField
              placeholder="Buscar por cliente, dispositivo o folio..."
              value={searchText}
              onChangeText={setSearchText}
              className="pl-10"
            />
          </Input>
          <View className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Ionicons name="search" size={20} color="#6B7280" />
          </View>
        </View>
      </View>

      {/* Repairs List */}
      <View className="flex-1 px-6 pt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-typography-900">
            Reparaciones Activas
          </Text>
          <Text className="text-sm text-typography-600">
            {filteredRepairs.length} de {mockRepairs.length}
          </Text>
        </View>

        <FlatList
          data={filteredRepairs}
          renderItem={renderRepairCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-8">
              <Ionicons name="search" size={48} color="#9CA3AF" />
              <Text className="text-typography-500 text-center mt-4">
                {searchText
                  ? "No se encontraron reparaciones"
                  : "No hay reparaciones activas"}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
