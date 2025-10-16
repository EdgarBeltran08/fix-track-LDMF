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
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Modal as RNModal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const InventoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCost, setNewItemCost] = useState("");
  const [newItemSku, setNewItemSku] = useState("");

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    "",
    "Pantallas",
    "Baterias",
    "Conectores",
    "Placas Bases",
    "Cámaras",
    "Micas",
  ];

  const filteredData = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (selectedCategory === "" || item.category?.name === selectedCategory)
  );

  const totalItems = filteredData.length;

  const handleClickVer = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedItem(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewItemName("");
    setNewItemCost("");
    setNewItemSku("");
    setNewCategory("");
  };

  const handleAddItem = async () => {
    if (!newItemName || !newItemCost || !newCategory) {
      // You might want to show an error toast here
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      // TODO: Implement the actual repository call to add the item
      // Example:
      // const newItem: Omit<InventoryItem, 'id' | 'createdAt'> = {
      //   name: newItemName,
      //   unitCost: parseFloat(newItemCost),
      //   sku: newItemSku || null,
      //   state: "available",
      //   category: { name: newCategory } // Adjust based on your Category type
      // };
      // await InventoryRepository.create(newItem);

      handleCloseAddModal();
      await fetchInventoryItems(); // Refresh the list

      // You might want to show a success toast here
      alert("Artículo agregado exitosamente");
    } catch (error) {
      console.error("Error adding inventory item:", error);
      alert("Error al agregar el artículo");
    }
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsFilterMenuOpen(false);
  };

  const fetchInventoryItems = async () => {
    try {
      const items = await InventoryRepository.getAll();
      setInventoryItems(items);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInventoryItems();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  return (
    <>
      <View className="flex-1 pt-5 mb-8 items-start bg-background-50">
        <Text className="text-3xl font-bold ml-6 mb-2 text-secondary-900">
          Inventory
        </Text>
        <Text className="text-xl ml-6 mb-2 text-primary-500">
          Control de Inventario
        </Text>

        {/* Barra de busqueda */}
        <View className="my-2 w-full flex flex-row items-center mb-3 ml-5">
          <Input className="bg-background-50 rounded-xl flex-row items-center border-2 border-primary-300 w-64 mr-6">
            <InputSlot className="pl-3">
              <AntDesign name="search" size={24} color="gray" />
            </InputSlot>
            <InputField
              placeholder="Search"
              value={searchText}
              onChangeText={setSearchText}
              className="text-secondary-900 font-bold bg-background-50"
            />
          </Input>

          <View className="flex flex-row space-x-2 ml-10 mr-5 relative">
            <TouchableOpacity
              onPress={toggleFilterMenu}
              className="rounded-full p-2 bg-background-300 flex-row justify-center items-center h-11"
            >
              <Feather
                name="filter"
                size={24}
                color="white"
                className="align-middle translate-y-[1px]"
              />
            </TouchableOpacity>

            {isFilterMenuOpen && (
              <View className="absolute top-14 right-0 bg-background-100 border-2 border-primary-300 rounded-md shadow-lg z-50 w-40">
                <Text className="px-4 py-2 font-bold text-secondary-900 border-b border-primary-300">
                  Categoría:
                </Text>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => handleSelectCategory(cat)}
                    className={`px-4 py-2 ${
                      selectedCategory === cat ? "bg-primary-300" : ""
                    }`}
                  >
                    <Text
                      className={
                        selectedCategory === cat
                          ? "text-primary-900"
                          : "text-primary-900"
                      }
                    >
                      {cat === "" ? "Todas" : cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Button
              size="lg"
              className="rounded-full ml-4 p-2 bg-primary-400 border-2 border-primary-400 flex-row justify-center items-center h-11"
              onPress={handleOpenAddModal}
            >
              <FontAwesome6
                name="add"
                size={24}
                color="black"
                className="align-middle translate-y-[-2px]"
              />
            </Button>
          </View>
        </View>

        {/* Contenedor de la tabla */}
        <View className="flex-1 rounded-lg pt-2 ml-5 mx-2 w-11/12 max-h-[500px]">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={true}
            nestedScrollEnabled={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              className="w-full"
            >
              <Table className="min-w-[600px] border-primary-400 rounded-lg overflow-visible">
                <TableHeader>
                  <TableRow className="bg-background-100 border-b-2 border-primary-400">
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">
                      Repuesto
                    </TableHead>
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">
                      Costo Unitario
                    </TableHead>
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">
                      SKU
                    </TableHead>
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">
                      Categoría
                    </TableHead>
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">
                      Estado
                    </TableHead>
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">
                      Detalle
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className="bg-background-100">
                      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">
                        {item.name}
                      </TableData>
                      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">
                        ${item.unitCost}
                      </TableData>
                      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">
                        {item.sku || "N/A"}
                      </TableData>
                      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">
                        {item.category?.name || "N/A"}
                      </TableData>
                      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">
                        {item.state === "available"
                          ? "Disponible"
                          : "No Disponible"}
                      </TableData>
                      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md flex justify-center items-center">
                        <Button
                          variant="link"
                          onPress={() => handleClickVer(item)}
                          className="p-0 mx-auto"
                        >
                          <AntDesign
                            name="eye"
                            size={24}
                            color="#3ed389ff"
                            className="ml-10"
                          />
                        </Button>
                      </TableData>
                    </TableRow>
                  ))}
                </TableBody>

                <TableFooter>
                  <TableRow className="bg-secondary-200">
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">
                      Total Items
                    </TableHead>
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">
                      {totalItems}
                    </TableHead>
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">
                      -
                    </TableHead>
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">
                      -
                    </TableHead>
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">
                      -
                    </TableHead>
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">
                      -
                    </TableHead>
                  </TableRow>
                </TableFooter>
              </Table>
            </ScrollView>
          </ScrollView>
        </View>
      </View>

      {/* Add New Item Modal */}
      <RNModal
        visible={isAddModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseAddModal}
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
                    <InputField
                      placeholder="Ej. Pantalla iPhone 12"
                      value={newItemName}
                      onChangeText={setNewItemName}
                    />
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
                      value={newItemCost}
                      onChangeText={setNewItemCost}
                    />
                  </Input>
                </View>

                <View className="mb-3">
                  <Text className="text-primary-900 font-semibold mb-1">
                    SKU
                  </Text>
                  <Input>
                    <InputField
                      placeholder="Ej. IP12-SCR-001"
                      value={newItemSku}
                      onChangeText={setNewItemSku}
                    />
                  </Input>
                </View>

                <View className="mb-3">
                  <Text className="text-primary-900 font-semibold mb-1">
                    Categoría
                  </Text>
                  <View className="border-2 border-primary-300 rounded-xl bg-background-50 overflow-hidden">
                    <Picker
                      selectedValue={newCategory}
                      onValueChange={(itemValue: string) =>
                        setNewCategory(itemValue)
                      }
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
                  onPress={handleCloseAddModal}
                  className="bg-background-200 border-primary-300 rounded-full px-5"
                >
                  <ButtonText>Cancelar</ButtonText>
                </Button>

                <Button
                  className="bg-primary-400 border-primary-400 rounded-full px-5"
                  onPress={handleAddItem}
                >
                  <ButtonText>Agregar</ButtonText>
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </RNModal>

      {/* View Item Details Modal */}
      <RNModal
        visible={isViewModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseViewModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-center items-center bg-black/60 p-5">
            <View className="bg-background-50 rounded-xl border-2 border-primary-300 p-6 w-full max-w-[400px]">
              <Text className="text-xl font-bold mb-4 text-primary-900 text-center">
                Detalles del Repuesto
              </Text>

              {selectedItem && (
                <ScrollView
                  className="w-full"
                  style={{ maxHeight: 300 }}
                  showsVerticalScrollIndicator={false}
                >
                  <View className="mb-4">
                    <Text className="text-primary-900 font-semibold mb-1">
                      Nombre del repuesto
                    </Text>
                    <View className="bg-background-100 border-2 border-primary-200 rounded-xl p-3">
                      <Text className="text-secondary-900">
                        {selectedItem.name}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-primary-900 font-semibold mb-1">
                      Costo unitario
                    </Text>
                    <View className="bg-background-100 border-2 border-primary-200 rounded-xl p-3">
                      <Text className="text-secondary-900">
                        ${selectedItem.unitCost}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-primary-900 font-semibold mb-1">
                      SKU
                    </Text>
                    <View className="bg-background-100 border-2 border-primary-200 rounded-xl p-3">
                      <Text className="text-secondary-900">
                        {selectedItem.sku || "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-primary-900 font-semibold mb-1">
                      Categoría
                    </Text>
                    <View className="bg-background-100 border-2 border-primary-200 rounded-xl p-3">
                      <Text className="text-secondary-900">
                        {selectedItem.category?.name || "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-primary-900 font-semibold mb-1">
                      Estado
                    </Text>
                    <View className="bg-background-100 border-2 border-primary-200 rounded-xl p-3">
                      <Text className="text-secondary-900">
                        {selectedItem.state === "available"
                          ? "Disponible"
                          : "No Disponible"}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-primary-900 font-semibold mb-1">
                      Fecha de creación
                    </Text>
                    <View className="bg-background-100 border-2 border-primary-200 rounded-xl p-3">
                      <Text className="text-secondary-900">
                        {selectedItem.createdAt.toLocaleDateString("es-ES")}
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              )}

              {/* Botones */}
              <View className="flex-row justify-center mt-6">
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={handleCloseViewModal}
                  className="bg-background-200 border-primary-300 rounded-full px-8"
                >
                  <ButtonText>Cerrar</ButtonText>
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </RNModal>
    </>
  );
};

export default InventoryPage;
