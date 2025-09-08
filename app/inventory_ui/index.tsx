import { Button, ButtonText } from '@/shared/components/ui/button';
import { Input, InputField, InputSlot } from '@/shared/components/ui/input';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/shared/components/ui/modal'; // Importar el Modal de Gluestack
import { Table, TableBody, TableData, TableFooter, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const InventoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedItem, setSelectedItem] = useState<any>(null); 

  // Datos de items (mas adelante vendran de la base de datos)
  const inventoryData = [
    { id: 1, repuesto: 'Pantalla LCD', cantidad: 15, idRepuesto: '0002', categoria: 'Pantallas', estado: 'Disponible' },
    { id: 2, repuesto: 'Bateria IPhone 15', cantidad: 25, idRepuesto: '0056', categoria: 'Baterias', estado: 'Disponible' },
    { id: 3, repuesto: 'Puerto de Carga Samsung', cantidad: 8, idRepuesto: '0023', categoria: 'Conectores', estado: 'Disponible' },
    { id: 4, repuesto: 'Placa Base Motorola', cantidad: 2, idRepuesto: '0180', categoria: 'Placas Bases', estado: 'Bajo Stock' },
    { id: 5, repuesto: 'Cámara Trasera IPhone 11', cantidad: 5, idRepuesto: '0250', categoria: 'Oficina', estado: 'Disponible' },
    { id: 6, repuesto: 'Mica Cristal Templado Samsung J7', cantidad: 5, idRepuesto: '0279', categoria: 'Micas', estado: 'Disponible' },
  ];

  // Filtrar los datos con base en el texto de busqueda
  const filteredData = inventoryData.filter(item => 
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
    <View style={{ flex: 1, paddingTop: 20, marginBottom: 30, alignItems: 'flex-start' }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 10 }}>Inventario</Text>

      {/* Barra de busqueda */}
      <View style={{ marginVertical: 10, width: '55%', marginLeft: 10 }}>
        <Input style={{ borderWidth: 1.5, borderRadius: 10, borderColor: '#000000' }}>
          <InputSlot className="pl-3">
          </InputSlot>
          <InputField 
            placeholder="Buscar Item..." 
            value={searchText}
            onChangeText={setSearchText}
            style={{ color: 'black', fontWeight: 'bold' }}  
          />
        </Input>
      </View>

      
      <View style={{
        flex: 1, 
        paddingTop: 10, 
        marginHorizontal: 10, 
        width: '95%', 
        maxHeight: 550,  
        borderBottomWidth: 2,  
        borderRadius: 8,  
      }}>
        <ScrollView 
          style={{ flex: 1 }} 
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            style={{ width: '100%' }}
          >
            <Table style={{
              minWidth: 600, 
              borderWidth: 2, 
              borderColor: '#000000ff',  
              borderRadius: 10,       
              overflow: 'visible'     
            }}>
              <TableHeader>
                <TableRow className="bg-primary-200">
                  <TableHead className="text-primary-900" style={{ minWidth: 110, paddingHorizontal: 8 }}>Repuesto</TableHead>
                  <TableHead className="text-primary-900" style={{ minWidth: 90, paddingHorizontal: 8 }}>Cantidad</TableHead>
                  <TableHead className="text-primary-900" style={{ minWidth: 70, paddingHorizontal: 8 }}>ID</TableHead>
                  <TableHead className="text-primary-900" style={{ minWidth: 100, paddingHorizontal: 8 }}>Categoría</TableHead>
                  <TableHead className="text-primary-900" style={{ minWidth: 100, paddingHorizontal: 8 }}>Estado</TableHead>
                  <TableHead className="text-primary-900" style={{ minWidth: 100, paddingHorizontal: 8 }}>Detalle</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} style={{ backgroundColor: '#e0e0e0ff' }}>
                    <TableData style={{ minWidth: 120, paddingHorizontal: 8, color: '#000000', borderBottomWidth: 1, borderBottomColor: '#000000ff' }}>
                      {item.repuesto}
                    </TableData>
                    <TableData style={{ minWidth: 80, paddingHorizontal: 8, color: '#000000', borderBottomWidth: 1, borderBottomColor: '#000000ff' }}>
                      {item.cantidad}
                    </TableData>
                    <TableData style={{ minWidth: 80, paddingHorizontal: 8, color: '#000000', borderBottomWidth: 1, borderBottomColor: '#000000ff' }}>
                      {item.idRepuesto}
                    </TableData>
                    <TableData style={{ minWidth: 100, paddingHorizontal: 8, color: '#000000', borderBottomWidth: 1, borderBottomColor: '#000000ff' }}>
                      {item.categoria}
                    </TableData>
                    <TableData style={{ minWidth: 100, paddingHorizontal: 8, color: '#000000', borderBottomWidth: 1, borderBottomColor: '#000000ff' }}>
                      {item.estado}
                    </TableData>
                    <TableData style={{ minWidth: 100, paddingHorizontal: 8, color: '#000000', borderBottomWidth: 1, borderBottomColor: '#000000ff' }}>
                      


                      <TouchableOpacity onPress={() => handleClickVer(item)}>
                        <Text style={{ marginLeft: 25, color: '#0066cc', textDecorationLine: 'underline', fontSize: 15 , fontWeight: 'bold' }}>Ver</Text> 
                      </TouchableOpacity>
                    </TableData>
                  </TableRow>
                ))}
              </TableBody>


              <TableFooter>
                <TableRow className="bg-secondary-200">
                  <TableHead className="text-secondary-900" style={{ minWidth: 120, paddingHorizontal: 8 }}>Total Items</TableHead>
                  <TableHead className="text-secondary-900" style={{ minWidth: 80, paddingHorizontal: 8 }}>{totalItems}</TableHead>
                  <TableHead className="text-secondary-900" style={{ minWidth: 80, paddingHorizontal: 8 }}>-</TableHead>
                  <TableHead className="text-secondary-900" style={{ minWidth: 100, paddingHorizontal: 8 }}>-</TableHead>
                  <TableHead className="text-secondary-900" style={{ minWidth: 100, paddingHorizontal: 8 }}>-</TableHead>
                  <TableHead className="text-secondary-900" style={{ minWidth: 100, paddingHorizontal: 8 }}>-</TableHead>
                </TableRow>
              </TableFooter>
            </Table>
          </ScrollView>
        </ScrollView>
      </View>

      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Detalles del Repuesto</Text>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Text><b>Repuesto:</b> {selectedItem?.repuesto}</Text>
            <Text><b>Cantidad:</b> {selectedItem?.cantidad}</Text>
            <Text><b>ID:</b> {selectedItem?.idRepuesto}</Text>
            <Text><b>Categoría:</b> {selectedItem?.categoria}</Text>
            <Text><b>Estado:</b> {selectedItem?.estado}</Text>
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
