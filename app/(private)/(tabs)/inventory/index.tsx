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
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const InventoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsFilterMenuOpen(false);
  };

  const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
    try {
      const items = await InventoryRepository.getAll();
      setInventoryItems(items);
      return items; // Retorno de los items
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      return []; // En caso de error, retornamos arreglo vacío
    }
  };

  const handleQuantityChange = async (
    item: InventoryItem,
    newQuantity: number
  ) => {
    if (newQuantity < 0) return;

    try {
      await InventoryRepository.updateQuantity(item.id, newQuantity);

      setInventoryItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: newQuantity,
                state: newQuantity > 0 ? "available" : "unavailable",
              }
            : i
        )
      );
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
      alert("No se pudo actualizar la cantidad");
    }
  };

  const handleAddItem = async () => {
    if (!newName || !newUnitCost || !newCategory || !newQuantity) {
      alert("Por favor llena todos los campos obligatorios");
      return;
    }

    try {
      await InventoryRepository.create({
        name: newName,
        sku: newSku || null,
        unitCost: parseFloat(newUnitCost),
        category: { id: "", name: newCategory, createdAt: new Date() },
        state: "available",
        quantity: parseInt(newQuantity, 10),
      });

      setIsAddModalOpen(false);
      fetchInventoryItems();
      alert("Producto agregado exitosamente al inventario");

      // Limpia campos
      setNewName("");
      setNewUnitCost("");
      setNewSku("");
      setNewCategory("");
      setNewQuantity("");
    } catch (error) {
      console.error("Error agregando repuesto:", error);
      alert("Error al agregar el repuesto");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInventoryItems();
    setRefreshing(false);
  };

  useEffect(() => {
    const fixStates = async (items: InventoryItem[]) => {
      for (const item of items) {
        if (item.quantity === 0 && item.state !== "unavailable") {
          await InventoryRepository.updateQuantity(item.id, 0);
        }
      }
    };

    fetchInventoryItems().then((items) => fixStates(items));
  }, []);

  // Estados del nuevo repuesto
  const [newCategory, setNewCategory] = useState("");
  //Cambio para agregar repuesto a base de datos
  const [newName, setNewName] = useState("");
  const [newUnitCost, setNewUnitCost] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  return (
    <>
      <View className="flex-1 pt-5 mb-8 items-start bg-[#193456]">
        <Text className="text-3xl font-bold ml-6 mb-2 color-white">
          Inventory
        </Text>
        <Text className="text-xl ml-6 mb-2 color-white">
          Control de Inventario
        </Text>

        {/* Barra de busqueda */}
        <View className="my-2 w-full flex flex-row items-center mb-3 ml-5">
          <Input className="bg-background-50 rounded-xl flex-row items-center border-2 border-[#FFB74D]  w-64 mr-6">
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
              <View className="absolute top-14 right-0 bg-background-100 border-2 border-[#FFB74D]  rounded-md shadow-lg z-50 w-40">
                <Text className="px-4 py-2 font-bold text-secondary-900 border-b border-[#FFB74D]">
                  Categoría:
                </Text>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => handleSelectCategory(cat)}
                    className={`px-4 py-2 ${
                      selectedCategory === cat ? "bg-[#FFB74D]" : ""
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
              className="rounded-full ml-4 p-2 bg-[#FFB74D] border-2 border-[#FFB74D] flex-row justify-center items-center h-11"
              //ON PRESS PARA MODAL
              onPress={() => setIsAddModalOpen(true)}
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
              <Table className="min-w-[600px] border-[#FFB74D] rounded-lg overflow-visible">
                <TableHeader>
                  <TableRow className="bg-background-100 border-b-2 border-[#FFB74D]">
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
                      Cantidad
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

                      {/* Cantidad con botones + y - */}
                      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">
                        <View className="flex flex-row items-center justify-center space-x-2">
                          <TouchableOpacity
                            onPress={() =>
                              handleQuantityChange(item, item.quantity - 1)
                            }
                            disabled={item.quantity === 0}
                          >
                            <AntDesign
                              name="minus-circle"
                              size={22}
                              color={item.quantity === 0 ? "gray" : "#FFB74D"}
                            />
                          </TouchableOpacity>

                          <Text className="text-secondary-900 font-bold mx-2">
                            {item.quantity}
                          </Text>

                          <TouchableOpacity
                            onPress={() =>
                              handleQuantityChange(item, item.quantity + 1)
                            }
                          >
                            <AntDesign
                              name="plus-circle"
                              size={22}
                              color="#FFB74D"
                            />
                          </TouchableOpacity>
                        </View>
                      </TableData>

                      {/* Estado dinámico */}
                      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">
                        {item.quantity === 0 ? "No Disponible" : "Disponible"}
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
                            color="#FFB74D"
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

      <RNModal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center items-center bg-black/60 p-5">
          <View className="bg-background-50 rounded-xl border-2 border-primary-300 p-5 w-full max-w-[400px]">
            <Text className="text-xl font-bold mb-4 text-primary-900">
              Detalles del Repuesto
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text>
                <Text className="text-lg font-bold text-primary-900">
                  Repuesto:
                </Text>{" "}
                <Text className="text-primary-900">{selectedItem?.name}</Text>
              </Text>
              <Text>
                <Text className="text-lg font-bold text-primary-900">
                  Costo Unitario:
                </Text>{" "}
                <Text className="text-primary-900">
                  ${selectedItem?.unitCost}
                </Text>
              </Text>
              <Text>
                <Text className="text-lg font-bold text-primary-900">SKU:</Text>{" "}
                <Text className="text-primary-900">
                  {selectedItem?.sku || "N/A"}
                </Text>
              </Text>
              <Text>
                <Text className="text-lg font-bold text-primary-900">
                  Categoría:
                </Text>{" "}
                <Text className="text-primary-900">
                  {selectedItem?.category?.name || "N/A"}
                </Text>
              </Text>
              <Text>
                <Text className="text-lg font-bold text-primary-900">
                  Estado:
                </Text>{" "}
                <Text className="text-primary-900">
                  {selectedItem?.state === "available"
                    ? "Disponible"
                    : "No Disponible"}
                </Text>
              </Text>
            </ScrollView>
            <Button
              variant="outline"
              action="secondary"
              onPress={handleCloseModal}
              className="mt-4 bg-primary-300 border-primary-300 rounded-full p-2"
            >
              <ButtonText>Cerrar</ButtonText>
            </Button>
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
            <View className="bg-background-50 rounded-xl border-2 border-[#FFB74D] p-6 w-full max-w-[400px]">
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
                      value={newName}
                      onChangeText={setNewName}
                    />
                  </Input>
                </View>

                <View className="mb-3">
                  <Text className="text-primary-900 font-semibold mb-1">
                    Costo unitario
                  </Text>
                  {/* Costo */}
                  <Input>
                    <InputField
                      placeholder="Ej. 250.00"
                      keyboardType="numeric"
                      value={newUnitCost}
                      onChangeText={setNewUnitCost}
                    />
                  </Input>
                </View>

                <View className="mb-3">
                  <Text className="text-primary-900 font-semibold mb-1">
                    SKU
                  </Text>
                  {/* SKU */}
                  <Input>
                    <InputField
                      placeholder="Ej. IP12-SCR-001"
                      value={newSku}
                      onChangeText={setNewSku}
                    />
                  </Input>
                </View>
                <View className="mb-3">
                  <Text className="text-primary-900 font-semibold mb-1">
                    Cantidad
                  </Text>
                  <Input>
                    <InputField
                      placeholder="Ej. 10"
                      keyboardType="numeric"
                      value={newQuantity}
                      onChangeText={setNewQuantity}
                    />
                  </Input>
                </View>
                <View className="mb-3">
                  <Text className="text-primary-900 font-semibold mb-1">
                    Categoría
                  </Text>
                  <View className="border-2 border-2 border-[#FFB74D] rounded-xl bg-background-50 overflow-hidden">
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
                  className="bg-background-200 border-2 border-[#FFB74D] rounded-full px-5"
                >
                  <ButtonText>Cancelar</ButtonText>
                </Button>

                <Button
                  className="bg-[#FFB74D] border-primary-400 rounded-full px-5"
                  onPress={handleAddItem}
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

export default InventoryPage;
