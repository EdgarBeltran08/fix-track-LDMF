import { Button, ButtonText } from "@/shared/components/ui/button"; // Asegúrate de que ButtonIcon esté importado
import { Input, InputField, InputSlot } from "@/shared/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/shared/components/ui/modal";
import {
  Table,
  TableBody,
  TableData,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import AntDesign from "@expo/vector-icons/AntDesign"; // Icono de Expo Vector Icons
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"; // Icono de agregar
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const InventoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Datos de items (más adelante vendrán de la base de datos)
  const inventoryData = [
    {
      id: 1,
      repuesto: "Pantalla LCD",
      cantidad: 15,
      idRepuesto: "0002",
      categoria: "Pantallas",
      estado: "Disponible",
    },
    {
      id: 2,
      repuesto: "Bateria IPhone 15",
      cantidad: 25,
      idRepuesto: "0056",
      categoria: "Baterias",
      estado: "Disponible",
    },
    {
      id: 3,
      repuesto: "Puerto de Carga Samsung",
      cantidad: 8,
      idRepuesto: "0023",
      categoria: "Conectores",
      estado: "Disponible",
    },
    {
      id: 4,
      repuesto: "Placa Base Motorola",
      cantidad: 2,
      idRepuesto: "0180",
      categoria: "Placas Bases",
      estado: "Bajo Stock",
    },
    {
      id: 5,
      repuesto: "Cámara Trasera IPhone 11",
      cantidad: 5,
      idRepuesto: "0250",
      categoria: "Oficina",
      estado: "Disponible",
    },
    {
      id: 6,
      repuesto: "Mica Cristal Templado Samsung J7",
      cantidad: 5,
      idRepuesto: "0279",
      categoria: "Micas",
      estado: "Disponible",
    },
  ];

  // Filtrar los datos con base en el texto de búsqueda
  const filteredData = inventoryData.filter((item) =>
    item.repuesto.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalItems = filteredData.reduce((sum, item) => sum + item.cantidad, 0);

  const handleClickVer = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <View className="flex-1 pt-5 items-start bg-background-50">
      <Text className="text-3xl font-bold ml-6 mb-4 text-secondary-900">
        Inventario
      </Text>

      {/* Barra de búsqueda */}
      <View className="my-2 w-4/5 ml-5 flex flex-row items-center mb-3">
        <Input className="border-2 border-secondary-300 rounded-xl flex-row items-center shadow-md flex-grow mr-4">
          {/* Icono al inicio del input */}
          <InputSlot className="pl-3">
            <AntDesign name="search1" size={24} color="gray" />
          </InputSlot>

          {/* Campo de texto */}
          <InputField
            placeholder="Buscar Item..."
            value={searchText}
            onChangeText={setSearchText}
            className="text-secondary-900 font-bold flex-1"
          />
        </Input>

        <Button
          size="lg"
          className="ml-4 rounded-full p-2 bg-background-primary-50 border-2 border-secondary-300 flex-row justify-center items-center h-11"
        >
          <Feather name="filter" size={24} color="gray" />
        </Button>

        <Button
          size="lg"
          className="ml-4 rounded-full p-2 bg-background-primary-50 border-2 border-secondary-300 flex-row justify-center items-center h-11"
        >
          <FontAwesome6
            name="add"
            size={24}
            color="gray"
            className="align-middle translate-y-[-2px]"
          />
        </Button>
      </View>

      {/* Contenedor de la tabla */}
      <View className="flex-1 pt-2 ml-5 mx-2 w-11/12 max-h-[500px]">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            className="w-full"
          >
            <Table className="min-w-[600px] border-2 border-secondary-300 rounded-md overflow-visible">
              <TableHeader>
                <TableRow className="bg-background-50 border-b-2 border-secondary-300">
                  <TableHead className="text-secondary-900 text-center px-2">
                    Repuesto
                  </TableHead>
                  <TableHead className="text-secondary-900 text-center px-2">
                    Cantidad
                  </TableHead>
                  <TableHead className="text-secondary-900 text-center px-2">
                    ID
                  </TableHead>
                  <TableHead className="text-secondary-900 text-center px-2">
                    Categoría
                  </TableHead>
                  <TableHead className="text-secondary-900 text-center px-2">
                    Estado
                  </TableHead>
                  <TableHead className="text-secondary-900 text-center px-2">
                    Detalle
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className="bg-background-50">
                    <TableData className="px-2 text-secondary-900 border-secondary-300">
                      {item.repuesto}
                    </TableData>
                    <TableData className="px-2 text-secondary-900 border-secondary-300 text-center">
                      {item.cantidad}
                    </TableData>
                    <TableData className="px-2 text-secondary-900 border-secondary-300 text-center">
                      {item.idRepuesto}
                    </TableData>
                    <TableData className="px-2 text-secondary-900 border-secondary-300 text-center">
                      {item.categoria}
                    </TableData>
                    <TableData className="px-2 text-secondary-900 border-secondary-300 text-center">
                      {item.estado}
                    </TableData>
                    <TableData className="px-2 text-secondary-900 border-secondary-300 text-center ">
                      {/* Hacer clickeable el texto "Ver" */}
                      <TouchableOpacity onPress={() => handleClickVer(item)}>
                        <Text className="ml-6 text-blue-600 underline text-base font-bold">
                          Ver
                        </Text>
                      </TouchableOpacity>
                    </TableData>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow className="bg-secondary-200">
                  <TableHead className="text-secondary-900 px-2">
                    Total Items
                  </TableHead>
                  <TableHead className="text-secondary-900 px-2">
                    {totalItems}
                  </TableHead>
                  <TableHead className="text-secondary-900 px-2">-</TableHead>
                  <TableHead className="text-secondary-900 px-2">-</TableHead>
                  <TableHead className="text-secondary-900 px-2">-</TableHead>
                  <TableHead className="text-secondary-900 px-2">-</TableHead>
                </TableRow>
              </TableFooter>
            </Table>
          </ScrollView>
        </ScrollView>
      </View>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="text-xl font-bold">Detalles del Repuesto</Text>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Text>
              <b>Repuesto:</b> {selectedItem?.repuesto}
            </Text>
            <Text>
              <b>Cantidad:</b> {selectedItem?.cantidad}
            </Text>
            <Text>
              <b>ID:</b> {selectedItem?.idRepuesto}
            </Text>
            <Text>
              <b>Categoría:</b> {selectedItem?.categoria}
            </Text>
            <Text>
              <b>Estado:</b> {selectedItem?.estado}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={handleCloseModal}
            >
              <ButtonText>Cerrar</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
};

export default InventoryPage;
