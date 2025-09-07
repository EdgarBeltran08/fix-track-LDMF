import { Input, InputField, InputSlot } from '@/shared/components/ui/input';
import { Table, TableBody, TableData, TableFooter, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

const InventoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda

  // Datos de repuestos (más adelante vendrán de tu base de datos)
  const inventoryData = [
    { id: 1, repuesto: 'Pantalla LCD', cantidad: 15, idRepuesto: '0002', categoria: 'Pantallas', estado: 'Disponible' },
    { id: 2, repuesto: 'Bateria IPhone 15', cantidad: 25, idRepuesto: '0056', categoria: 'Baterias', estado: 'Disponible' },
    { id: 3, repuesto: 'Puerto de Carga Samsung', cantidad: 8, idRepuesto: '0023', categoria: 'Conectores', estado: 'Disponible' },
    { id: 4, repuesto: 'Placa Base Motorola', cantidad: 2, idRepuesto: '0180', categoria: 'Placas Bases', estado: 'Bajo Stock' },
    { id: 5, repuesto: 'Cámara Trasera IPhone 11', cantidad: 5, idRepuesto: '0250', categoria: 'Oficina', estado: 'Disponible' },
    { id: 6, repuesto: 'Mica Cristal Templado Samsung J7-J8', cantidad: 5, idRepuesto: '0279', categoria: 'Micas', estado: 'Disponible' },
  ];

  // Filtrar los datos con base en el texto de búsqueda
  const filteredData = inventoryData.filter(item => 
    item.repuesto.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calcular total de items
  const totalItems = filteredData.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <View style={{ flex: 1, paddingTop: 20, marginBottom: 30, alignItems: 'flex-start' }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 10 }}>Inventario</Text>

      {/* Barra de búsqueda con margen izquierdo */}
      <View style={{ marginVertical: 10, width: '55%', marginLeft: 10 }}>
        <Input>
          <InputSlot className="pl-3">
          </InputSlot>
          <InputField 
            placeholder="Buscar Item..." 
            value={searchText}
            onChangeText={setSearchText}
            style={{ color: 'black' }} 
          />
        </Input>
      </View>

      {/* Tabla con borde y menos separación */}
      <View style={{
        flex: 1, 
        paddingTop: 10, 
        marginHorizontal: 10, 
        width: '95%', 
        height: 300, // Ajusta la altura según lo que necesites
        overflow: 'hidden' // Asegura que los bordes redondeados se apliquen bien
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
              borderWidth: 1, 
              borderColor: '#000000ff',  // Borde de la tabla
              borderRadius: 10,      // Bordes redondeados
              overflow: 'hidden'    // Para que el contenido no se desborde
            }}>
              <TableHeader>
                <TableRow className="bg-primary-200">
                  <TableHead className="text-primary-900" style={{ minWidth: 100, paddingHorizontal: 8 }}>Repuesto</TableHead>
                  <TableHead className="text-primary-900" style={{ minWidth: 90, paddingHorizontal: 8 }}>Cantidad</TableHead>
                  <TableHead className="text-primary-900" style={{ minWidth: 70, paddingHorizontal: 8 }}>ID</TableHead>
                  <TableHead className="text-primary-900" style={{ minWidth: 100, paddingHorizontal: 8 }}>Categoría</TableHead>
                  <TableHead className="text-primary-900" style={{ minWidth: 100, paddingHorizontal: 8 }}>Estado</TableHead>
                  <TableHead className="text-primary-900" style={{ minWidth: 100, paddingHorizontal: 8 }}>Detalle</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} style={{ backgroundColor: '#e5e7eb' }}>
                    <TableData style={{ minWidth: 120, paddingHorizontal: 8, color: '#000000' }}>
                      {item.repuesto}
                    </TableData>
                    <TableData style={{ minWidth: 80, paddingHorizontal: 8, color: '#000000' }}>
                      {item.cantidad}
                    </TableData>
                    <TableData style={{ minWidth: 80, paddingHorizontal: 8, color: '#000000' }}>
                      {item.idRepuesto}
                    </TableData>
                    <TableData style={{ minWidth: 100, paddingHorizontal: 8, color: '#000000' }}>
                      {item.categoria}
                    </TableData>
                    <TableData style={{ minWidth: 100, paddingHorizontal: 8, color: '#000000' }}>
                      {item.estado}
                    </TableData>
                    <TableData style={{ minWidth: 100, paddingHorizontal: 8, color: '#000000' }}>
                      Ver
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
    </View>
  );
};

export default InventoryPage;
