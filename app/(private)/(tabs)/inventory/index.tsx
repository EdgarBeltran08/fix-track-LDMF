@ -1,21 +1,25 @@
import { Button, ButtonText } from "@/shared/components/ui/button";
import { Input, InputField, InputSlot } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableData,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { InventoryRepository } from "@/shared/repositories/inventory.repository";
import { InventoryItem } from "@/shared/types/inventory.type";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { useEffect, useState } from "react";
//impor de modal
import { Picker } from "@react-native-picker/picker";
import {
  KeyboardAvoidingView,
  Platform,
  Modal as RNModal,
  RefreshControl,
  ScrollView,
@ -35,6 +39,7 @@ const InventoryPage: React.FC = () => {

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = [
    "",
@ -90,6 +95,7 @@ const InventoryPage: React.FC = () => {
  useEffect(() => {
    fetchInventoryItems();
  }, []);
  const [newCategory, setNewCategory] = useState("");

  return (
    <>
@ -154,10 +160,11 @@ const InventoryPage: React.FC = () => {
                ))}
              </View>
            )}

            <Button
              size="lg"
              className="rounded-full ml-4 p-2 bg-primary-400 border-2 border-primary-400 flex-row justify-center items-center h-11"
              //ON PRESS PARA MODAL
              onPress={() => setIsAddModalOpen(true)}
            >
              <FontAwesome6
                name="add"
@ -337,6 +344,111 @@ const InventoryPage: React.FC = () => {
          </View>
        </View>
      </RNModal>

      <RNModal
        //MODAL PARA AGREGAR OBJETO AL INVENTARIO
        visible={isAddModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-center items-center bg-black/60 p-5">
            <View className="bg-background-50 rounded-xl border-2 border-primary-300 p-6 w-full max-w-[400px]">
              <Text className="text-xl font-bold mb-4 text-primary-900 text-center">
                Agregar al inventario
              </Text>

              {/* Formulario */}
              <ScrollView
                className="w-full"
                style={{ maxHeight: 300 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View className="mb-3">
                  <Text className="text-primary-900 font-semibold mb-1">
                    Nombre del repuesto
                  </Text>
                  <Input>
                    <InputField placeholder="Ej. Pantalla iPhone 12" />
                  </Input>
                </View>

                <View className="mb-3">
                  <Text className="text-primary-900 font-semibold mb-1">
                    Costo unitario
                  </Text>
                  <Input>
                    <InputField
                      placeholder="Ej. 250.00"
                      keyboardType="numeric"
                    />
                  </Input>
                </View>

                <View className="mb-3">
                  <Text className="text-primary-900 font-semibold mb-1">
                    SKU
                  </Text>
                  <Input>
                    <InputField placeholder="Ej. IP12-SCR-001" />
                  </Input>
                </View>

                <View className="mb-3">
                  <Text className="text-primary-900 font-semibold mb-1">
                    Categoría
                  </Text>
                  <View className="border-2 border-primary-300 rounded-xl bg-background-50 overflow-hidden">
                    <Picker
                      selectedValue={newCategory}
                      onValueChange={(itemValue) => setNewCategory(itemValue)}
                      style={{
                        fontSize: 14,
                      }}
                      itemStyle={{
                        fontSize: 14,
                      }}
                      dropdownIconColor="#FFB74D"
                    >
                      <Picker.Item label="Seleccionar categoría..." value="" />
                      <Picker.Item label="Pantallas" value="Pantallas" />
                      <Picker.Item label="Baterias" value="Baterias" />
                      <Picker.Item label="Conectores" value="Conectores" />
                      <Picker.Item label="Placas Bases" value="Placas Bases" />
                      <Picker.Item label="Cámaras" value="Cámaras" />
                      <Picker.Item label="Micas" value="Micas" />
                    </Picker>
                  </View>
                </View>
              </ScrollView>

              {/* Botones */}
              <View className="flex-row justify-between mt-6">
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={() => setIsAddModalOpen(false)}
                  className="bg-background-200 border-primary-300 rounded-full px-5"
                >
                  <ButtonText>Cancelar</ButtonText>
                </Button>

                <Button
                  className="bg-primary-400 border-primary-400 rounded-full px-5"
                  onPress={() => setIsAddModalOpen(false)}
                >
                  <ButtonText>Agregar</ButtonText>
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </RNModal>
    </>
  );
};
