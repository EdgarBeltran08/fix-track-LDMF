import { Badge } from "@/shared/components/ui/badge";
import { Button, ButtonText } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input, InputField } from "@/shared/components/ui/input";
import { RepairsRepository } from "@/shared/repositories/repairs.repository";
import { useUserStore } from "@/shared/stores/useUserStore";
import { Repair, RepairStatus } from "@/shared/types/repair.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View
} from "react-native";

const getStatusText = (status: RepairStatus) => {
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

const getStatusColor = (status: RepairStatus) => {
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

const getStatusBadgeStyle = (status: RepairStatus) => {
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

const getStatusTextStyle = (status: RepairStatus) => {
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
  const { colorScheme } = useColorScheme();
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const { user, signOut } = useUserStore();

  // Load repairs on component mount
  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    try {
      const repairsData = await RepairsRepository.getAll();
      setRepairs(repairsData);
    } catch (error) {
      console.error("Error loading repairs:", error);
    }
  };

  // Filter repairs based on search
  const filteredRepairs = repairs.filter(
    (repair) =>
      repair.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      repair.deviceModel.toLowerCase().includes(searchText.toLowerCase()) ||
      repair.folio?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Get status counts
  const statusCounts = repairs.reduce((acc, repair) => {
    acc[repair.status] = (acc[repair.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRepairs();
    setRefreshing(false);
  };

  const renderRepairCard = ({ item }: { item: Repair }) => {
    // 🚀 CÁLCULO DEL COSTO FINAL APLICADO AQUÍ
    const partsCost = item.pieces.reduce(
      (acc, piece) => acc + piece.unitCost * piece.quantity,
      0
    );
    const totalAPagar = Math.max(0, partsCost - (item.estimatedCost || 0));

    return (
      <Pressable
        className="mb-3"
        onPress={() => router.push(`/(private)/(tabs)/repairs/detailsview?id=${item.id}`)}
      >
        <Card className="p-4 bg-primary-50 border border-background-200">
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
                className={`text-xs font-bold ${getStatusTextStyle(
                  item.status
                )}`}
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
          <View className="flex-row justify-between items-center p-3 bg-tertiary-500 rounded-lg">
            <View className="flex-row items-center">
              <Ionicons
                name="calendar-outline"
                size={16}
                color="#262719ff"
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm text-typography-0">
                {item.createdAt.toLocaleDateString("es-MX")}
              </Text>
            </View>
            <Text className="text-base font-bold text-primary-0 bg-primary-500 px-3 py-1 rounded-xl">
              {/* 🚨 MOSTRANDO EL CÁLCULO CORRECTO */}
              ${totalAPagar.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-background-0">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      {/* Header */}
      <View className="bg-background-50 pt-12 px-6 border-b-2 border-primary-400 pb-9">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold text-typography-900">
              ¡Hola, {user?.displayName?.split(" ")[0] || "Administrador"}!
            </Text>
            <Text className="text-sm text-typography-600 capitalize">
              {user?.role || "admin"}
            </Text>
          </View>
          <View className="relative">
            <Pressable
              className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center"
              onPress={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Text className="text-white font-bold text-lg">
                {user?.displayName?.charAt(0) || "A"}
              </Text>
            </Pressable>

            {isMenuOpen && (
              <>
                {/* Backdrop */}
                <Pressable
                  className="absolute -inset-6 w-screen h-screen z-40"
                  onPress={() => setIsMenuOpen(false)}
                />

                {/* Dropdown Menu */}
                <View className="absolute top-12 right-0 z-50 bg-background-0 rounded-lg border border-background-200 shadow-lg min-w-[160px] p-1">
                  <Pressable
                    className="flex-row items-center px-3 py-2 rounded-md active:bg-background-100"
                    onPress={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                  >
                    <Ionicons
                      name="log-out-outline"
                      size={18}
                      color="#6B7280"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-typography-700 font-normal">
                      Cerrar sesión
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
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
            className="flex-1 rounded-xl"
            onPress={() => router.push("/(private)/(tabs)/repairs/create")}
          >
            <Ionicons
              name="add-circle"
              size={22}
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
              placeholder="Buscar por cliente, dispositivo, folio o teléfono..."
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
      <View className="flex-1 px-6 pt-4 bg-primary-0">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-typography-900">
            Reparaciones Activas
          </Text>
          <Text className="text-sm text-typography-600">
            {filteredRepairs.length} de {repairs.length}
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