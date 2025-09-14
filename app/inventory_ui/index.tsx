import { Button, ButtonText } from '@/shared/components/ui/button';
import { Input, InputField, InputSlot } from '@/shared/components/ui/input';
import { Table, TableBody, TableData, TableFooter, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useState } from 'react';
import { Modal as RNModal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const InventoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  
  const categories = [
    '', 
    'Pantallas',
    'Baterias',
    'Conectores',
    'Placas Bases',
    'Cámaras',
    'Micas',
  ];

  //Datos de items
  const inventoryData = [
    { id: 1, repuesto: 'Pantalla LCD', cantidad: 15, idRepuesto: '0002', categoria: 'Pantallas', estado: 'Disponible' },
    { id: 2, repuesto: 'Bateria IPhone 15', cantidad: 25, idRepuesto: '0056', categoria: 'Baterias', estado: 'Disponible' },
    { id: 3, repuesto: 'Puerto de Carga Samsung', cantidad: 8, idRepuesto: '0023', categoria: 'Conectores', estado: 'Disponible' },
    { id: 4, repuesto: 'Placa Base Motorola', cantidad: 2, idRepuesto: '0180', categoria: 'Placas Bases', estado: 'Bajo Stock' },
    { id: 5, repuesto: 'Cámara Trasera IPhone 11', cantidad: 5, idRepuesto: '0250', categoria: 'Cámaras', estado: 'Disponible' },
    { id: 6, repuesto: 'Mica Cristal Templado Samsung J7', cantidad: 5, idRepuesto: '0279', categoria: 'Micas', estado: 'Disponible' },
  ];

  const filteredData = inventoryData.filter(item =>
    item.repuesto.toLowerCase().includes(searchText.toLowerCase()) &&
    (selectedCategory === '' || item.categoria === selectedCategory)
  );

  const totalItems = filteredData.reduce((sum, item) => sum + item.cantidad, 0);

  const handleClickVer = (item: any) => {
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

  return (
    <>
      <View className="flex-1 pt-5 mb-8 items-start bg-background-50">
        <Text className="text-3xl font-bold ml-6 mb-2 text-secondary-900">Inventory</Text>
        <Text className="text-xl ml-6 mb-2 text-primary-500">Control de Inventario</Text>

        {/* Barra de busqueda */}
        <View className="my-2 w-full flex flex-row items-center mb-3 ml-5">
          <Input className="bg-background-50 rounded-xl flex-row items-center border-2 border-primary-300 w-64 mr-6">
            <InputSlot className="pl-3">
              <AntDesign name="search1" size={24} color="gray" />
            </InputSlot>
            <InputField
              placeholder="Search"
              value={searchText}
              onChangeText={setSearchText}
              className="text-secondary-900 font-bold bg-background-50"/>
          </Input>

        
          <View className="flex flex-row space-x-2 ml-10 mr-5 relative">
            <TouchableOpacity
              onPress={toggleFilterMenu}
              className="rounded-full p-2 bg-background-300 flex-row justify-center items-center h-11">
              <Feather name="filter" size={24} color="white" className="align-middle translate-y-[1px]" />
            </TouchableOpacity>

            {isFilterMenuOpen && (
              <View className="absolute top-14 right-0 bg-background-100 border-2 border-primary-300 rounded-md shadow-lg z-50 w-40">
                <Text className="px-4 py-2 font-bold text-secondary-900 border-b border-primary-300">Categoría:</Text>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => handleSelectCategory(cat)}
                    className={`px-4 py-2 ${selectedCategory === cat ? 'bg-primary-300' : ''}`}>
                    <Text className={selectedCategory === cat ? 'text-primary-900' : 'text-primary-900'}>
                      {cat === '' ? 'Todas' : cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Button
              size="lg"
              className="rounded-full ml-4 p-2 bg-primary-400 border-2 border-primary-400 flex-row justify-center items-center h-11">
              <FontAwesome6 name="add" size={24} color="black" className="align-middle translate-y-[-2px]" />
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
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              className="w-full"
            >
              <Table className="min-w-[600px] border-primary-400 rounded-lg overflow-visible">
                <TableHeader>
                  <TableRow className="bg-background-100 border-b-2 border-primary-400">
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">Repuesto</TableHead>
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">Cantidad</TableHead>
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">ID</TableHead>
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">Categoría</TableHead>
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">Estado</TableHead>
                    <TableHead className="text-secondary-900 text-center px-5 py-3 text-lg">Detalle</TableHead>
                  </TableRow>
                </TableHeader>

<TableBody>
  {filteredData.map((item) => (
    <TableRow key={item.id} className="bg-background-100">
      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">{item.repuesto}</TableData>
      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">{item.cantidad}</TableData>
      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">{item.idRepuesto}</TableData>
      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">{item.categoria}</TableData>
      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md">{item.estado}</TableData>
      <TableData className="px-5 py-3 text-secondary-900 text-center border-b-1 border-secondary-300 text-md flex justify-center items-center">
        <Button variant="link" onPress={() => handleClickVer(item)} className="p-0 mx-auto">
           <AntDesign name="eye" size={24} color="#3ed389ff" className="ml-10" />
        </Button>
      </TableData>
    </TableRow>
  ))}
</TableBody>

                <TableFooter>
                  <TableRow className="bg-secondary-200">
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">Total Items</TableHead>
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">{totalItems}</TableHead>
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">-</TableHead>
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">-</TableHead>
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">-</TableHead>
                    <TableHead className="text-secondary-900 px-5 py-5 text-md">-</TableHead>
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
      <Text className="text-xl font-bold mb-4 text-primary-900">Detalles del Repuesto</Text>
      <ScrollView style={{ maxHeight: 300 }}>
        <Text><Text className="text-lg font-bold text-primary-900">Repuesto:</Text> <Text className="text-primary-900">{selectedItem?.repuesto}</Text></Text>
        <Text><Text className="text-lg font-bold text-primary-900">Cantidad:</Text> <Text className="text-primary-900">{selectedItem?.cantidad}</Text></Text>
        <Text><Text className="text-lg font-bold text-primary-900">ID:</Text> <Text className="text-primary-900">{selectedItem?.idRepuesto}</Text></Text>
        <Text><Text className="text-lg font-bold text-primary-900">Categoría:</Text> <Text className="text-primary-900">{selectedItem?.categoria}</Text></Text>
        <Text><Text className="text-lg font-bold text-primary-900">Estado:</Text> <Text className="text-primary-900">{selectedItem?.estado}</Text></Text>
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

    </>
  );
};

export default InventoryPage;
