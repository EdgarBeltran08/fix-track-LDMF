import { Box } from '@/shared/components/ui/box';
import { Input, InputField } from '@/shared/components/ui/input';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

const RepairDetails: React.FC = () => {
    const [noteText, setNoteText] = useState('');
    const [notes, setNotes] = useState([
        'Se necesita reemplazar la pantalla.',
        'El cliente prefiere que se cambie la batería también.',
        'A la espera de piezas para la reparación.',
    ]);

    const [selectedItem, setSelectedItem] = useState<any>(null);

    {/*se simula los detalle de la reparación*/ }
    const repairData = [
        {
            id: 1,
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
            folio: "FT-2024-001"
        },
    ];

    {/*se simulan los estados*/ }
    const statusTimeline = [
        { status: 'Recibido', date: '2024-01-15' },
        { status: 'En reparación', date: '2024-01-16' },
        { status: 'Esperando piezas', date: '2024-01-17' },
        { status: 'Reparado', date: '2024-01-19' },
        { status: 'Listo para entrega', date: '2024-01-20' },
    ];

    {/*se simulan los archivos adjuntos*/ }
    const attachedFiles = [
        { name: 'foto1.jpg', url: '#' },
        { name: 'factura.pdf', url: '#' },
    ];

    const handleClickVer = (item: any) => {
        setSelectedItem(item);
    };

    {/*maneja la inserción de notas*/ }
    const handleAddNote = () => {
        if (noteText.trim() !== '') {
            setNotes([...notes, noteText]);
            setNoteText('');
        }
    };

    return (
        <View className="flex-1 p-5 mb-8 items-start bg-background-50">
            {/*poner línea de estados al inicio*/}

            <Text className="text-xl font-bold text-primary-500">Detalles de Reparación</Text>
            <Box className="mt-10 p-5 w-full h-auto bg-background-50 border-2 border-background-200">
                {/*<Image source={require('assets/images/phone2.jpg')} className="size-30 justify-center text-md m-3"/>*/}
                <Text className="text-center mb-2 text-xl font-extrabold text-typography-900">deviceModel</Text>
                <Text className="text-start text-md m-3 font-bold text-typography-900">Folio: </Text>
                <Text className="text-start text-md m-3 font-bold text-typography-900">Descripción: </Text>
                <Text className="text-start text-md m-3 font-bold text-typography-900">Cliente: </Text>
                <Text className="text-start text-md m-3 font-bold text-typography-900">Técnico: </Text>
                <Text className="text-start text-md m-3 font-bold text-typography-900">Fecha de entrada: </Text>
                <Text className="text-start text-md m-3 font-bold text-typography-900">Fecha de salida: </Text>

                <Text className="text-start text-md m-3 font-bold text-typography-900">Notas: </Text>
                <Input>
                    <InputField className="border border-secondary-300 rounded-xl" placeholder="Agregar una nota."/>
                </Input>
                <Button title="Agregar" onPress={handleAddNote} />
            </Box>
        </View>
    );
}

export default RepairDetails;