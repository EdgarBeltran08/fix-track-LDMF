import { Button, ButtonText } from "@/shared/components/ui/button";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Part {
  id: number;
  name: string;
  cost: number;
  quantity: number;
}

const Details: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([
    { id: 1, name: "Pantalla LCD", cost: 120, quantity: 1 },
    { id: 2, name: "Batería", cost: 45, quantity: 1 },
  ]);
  const [notes, setNotes] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPartName, setNewPartName] = useState("");
  const [newPartCost, setNewPartCost] = useState("");
  const [newPartQuantity, setNewPartQuantity] = useState("1");

  const laborCost = 50;
  const partsCost = parts.reduce((acc, p) => acc + p.cost * p.quantity, 0);
  const totalCost = laborCost + partsCost;

  const addPart = () => {
    if (!newPartName || !newPartCost) return;
    const newPart: Part = {
      id: Date.now(),
      name: newPartName,
      cost: parseFloat(newPartCost),
      quantity: parseInt(newPartQuantity),
    };
    setParts([...parts, newPart]);
    setNewPartName("");
    setNewPartCost("");
    setNewPartQuantity("1");
    setIsModalVisible(false);
  };

  const removePart = (id: number) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setParts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    );
  };
  const [scrollEnabled, setScrollEnabled] = useState(true);
  return (
    <ScrollView
      className="flex-1 bg-background-50 p-5" style={{backgroundColor:"#193456"}}
      scrollEnabled={scrollEnabled}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View className=" bg-background-50 rounded-2xl p-5 border border  shadow-sm border-4" style={{marginTop:40}}>
        <Text className="text-2xl font-bold text-center text-typography-900 mb-5">
          Detalles
        </Text>

        {/* PIEZAS UTILIZADAS */}
        <View className="mb-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-typography-900">
              Piezas utilizadas
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              className="flex-row items-center"
            >
              <AntDesign name="plus" size={20} color="#51bb54ff" />
              <Text className=" text-primary-600 font-semibold ml-1">
                Añadir
              </Text>
            </TouchableOpacity>
          </View>

          {parts.map((p) => (
            <View
              key={p.id}
              className="bg-background-100 border border-background-200  rounded-xl p-3 mb-3 flex-row justify-between items-center"
            >
              <View className="flex-1">
                <Text className="text-typography-900 font-semibold text-base">
                  {p.name}
                </Text>
                <Text className="text-typography-900 text-sm">
                  Cantidad: {p.quantity}
                </Text>

                <View className="flex-row mt-2  text-primary-600">
                  <TouchableOpacity
                    onPress={() => updateQuantity(p.id, -1)}
                    className="px-2"
                  >
                    <AntDesign name="minus" size={18} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => updateQuantity(p.id, 1)}
                    className="px-2"
                  >
                    <AntDesign name="plus" size={18} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="items-end">
                <Text className=" text-primary-600 font-bold">
                  ${p.cost.toFixed(2)}
                </Text>
                <TouchableOpacity
                  onPress={() => removePart(p.id)}
                  className="mt-1"
                >
                  <Feather name="trash-2" size={18} color="#E57373" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* COSTO DE LA REPARACION */}
        <View className="mb-5 ">
          <Text className="text-lg font-bold text-typography-900 mb-3 ">
            Costo de Reparación
          </Text>

          {[
            { label: "Mano de obra", value: laborCost },
            { label: "Costo de piezas", value: partsCost },
            { label: "Total", value: totalCost },
          ].map((item, idx) => (
            <View
              key={idx}
              className="bg-background-100 border border-background-200 rounded-lg p-3 mb-2 flex-row justify-between items-center"
            >
              <Text className="text-typography-900 font-semibold">
                {item.label}
              </Text>
              <Text className=" text-primary-600 font-bold">
                ${item.value.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* NOTAS para el equipo */}
        <View className="mb-5">
          <Text className="text-lg font-bold text-typography-900 mb-2">
            Notas
          </Text>
          <TextInput
            multiline
            placeholder="Agregar notas sobre la reparación del equipo"
            value={notes}
            onChangeText={setNotes}
            className="border border-background-200 rounded-xl bg-background-100 p-3 text-typography-900 min-h-[100px]"
          />
        </View>

        {/* BOTONES */}
        {/* BOTONES */}
        <View className="flex-row justify-between mt-4">
          {/* Botón para Actualizar */}
          <Button
            action="primary"
            size="lg"
            className="flex-1 mr-2 rounded-full"
            // onPress={handleUpdate} //funcion que usaremos
          >
            <ButtonText className="font-semibold text-white text-base">
              Actualizar
            </ButtonText>
          </Button>

          {/* Botón Cancelar */}
          <Button
            action="negative"
            size="lg"
            className="flex-1 ml-2 rounded-full"
            //onPress={handleCancel} // //funcion que usaremos
          >
            <ButtonText className="font-semibold text-white text-base ">
              Cancelar
            </ButtonText>
          </Button>
        </View>
      </View>

      {/* MODAL PARA AGREGAR PIEZA */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 p-5">
          <View className="bg-background-200 w-full max-w-[400px] rounded-2xl p-5  border border-background-400">
            <Text className="text-lg font-bold mb-4 text-typography-900">
              Agregar Pieza
            </Text>

            <TextInput
              placeholder="Nombre de la pieza"
              value={newPartName}
              onChangeText={setNewPartName}
              className="border border-background-400 rounded-xl p-3 mb-3 text-typography-900"
            />
            <TextInput
              placeholder="Costo"
              value={newPartCost}
              onChangeText={setNewPartCost}
              keyboardType="numeric"
              className="border border-background-400 rounded-xl p-3 mb-3 text-typography-900"
            />
            <TextInput
              placeholder="Cantidad"
              value={newPartQuantity}
              onChangeText={setNewPartQuantity}
              keyboardType="numeric"
              className="border border-background-400 rounded-xl p-3 mb-3 text-typography-400"
            />

            <View className="flex-row justify-between mt-3">
              <TouchableOpacity
                onPress={addPart}
                className="bg-[#4CAF50] py-2 px-6 rounded-full"
              >
                <Text className="text-white font-bold">Agregar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="bg-[#E57373] py-2 px-6 rounded-full"
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Details;
