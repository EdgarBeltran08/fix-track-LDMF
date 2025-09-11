import { Box } from '@/shared/components/ui/box';
import React, { useState } from 'react';
import { Text } from 'react-native';
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';

const RepairDetails: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  {/*se simula los detalle de la reparación*/}
  const repairData = [
    { id: 1,
    customerName: 'Michelle Garza',
    customerEmail: 'michelle@email.com',
    customerPhone: '555-1234',
    deviceModel: 'iPhone 14',
    issueDescription: 'Pantalla rota, no responde al racto',
    status: 'repairing',
    createdAt: new Date('2024-01-15'), 
    updatedAt: new Date(), 
    assignedTo: "tech-1",
    estimatedCost: 2500,
    finalCost: 0, 
    deliveryDate: new Date("2024-01-20"),
    folio: "FT-2024-001"},
  ];

  {/*se simulan los estados*/}
  const statusTimeline = [
    { status: 'Recibido', date: '2024-01-15' },
    { status: 'En reparación', date: '2024-01-16' },
    { status: 'Esperando piezas', date: '2024-01-17' },
    { status: 'Reparado', date: '2024-01-19' },
    { status: 'Listo para entrega', date: '2024-01-20' },
  ];

  {/*se simulan las notas adicionales*/}
  const notes = [
    'Se necesita reemplazar la pantalla.',
    'El cliente prefiere que se cambie la batería también.',
    'A la espera de piezas para la reparación.',
  ];

  {/*se simulan los archivos adjuntos*/}
  const attachedFiles = [
    { name: 'foto1.jpg', url: '#' },
    { name: 'factura.pdf', url: '#' },
  ];

  const handleClickVer = (item: any) => {
    setSelectedItem(item);
  };

  return (
    <ScrollView className="flex-1 p-5 mb-8 items-start bg-background-50">
        <Text className="text-xl font-bold text-primary-500">Detalles de Reparación</Text>
        <Box className="pt-10 items-center w-full h-full">
            <Text className="text-center text-xl text-white">deviceModel</Text>
        </Box> 
    </ScrollView>
  );
}

export default RepairDetails;