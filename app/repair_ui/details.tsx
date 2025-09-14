import { Box } from '@/shared/components/ui/box';
import { Button, ButtonText } from '@/shared/components/ui/button';
import { Image } from '@/shared/components/ui/image';
import { Input, InputField } from '@/shared/components/ui/input';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

const RepairDetails: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleClickVer = (item: any) => {
        setSelectedItem(item);
    };

    const [noteText, setNoteText] = useState('');

    const [notes, setNotes] = useState([
        'Se necesita reemplazar la pantalla.',
        'El cliente prefiere que se cambie la batería también.',
        'A la espera de piezas para la reparación.',
    ]);

    {/*maneja la inserción de notas*/ }
    const handleAddNote = () => {
        if (noteText.trim() !== '') {
            setNotes([...notes, noteText]);
            setNoteText('');
        }
    };

    {/*se simula los detalle de la reparación*/ }
    const repairData = [
        {
            id: 1,
            customerName: 'Michelle Garza',
            customerEmail: 'michelle@email.com',
            customerPhone: '555-1234',
            deviceModel: 'iPhone 14',
            issueDescription: 'Pantalla rota, no responde al tacto',
            status: 'repairing',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date(),
            assignedTo: "tech-1",
            estimatedCost: 2500,
            finalCost: 0,
            deliveryDate: new Date("2024-01-20"),
            folio: "FT-2024-001",
        },
    ];

    return (
        <ScrollView className="bg-background-50">
            <View className="flex-1 p-5 mb-8 items-start">
                <Text className="mt-5 text-xl font-bold text-primary-500">Detalles de Reparación</Text>
                {/*poner línea de estados al inicio*/}
                <Box className="mt-10 p-5 w-full h-auto bg-background-50 border-2 border-background-200">
                    <Box className="w-full h-auto items-center">
                        <Image source={require('assets/images/smartphone-cartoon.png')} className="w-44 h-44" alt='imagen dispositivo' />
                    </Box>

                    <Text className="text-center mb-4 text-xl font-extrabold text-typography-900">{selectedItem ? selectedItem.deviceModel : repairData[0].deviceModel}</Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Folio:
                        <Text className="font-normal"> {selectedItem ? selectedItem.folio : repairData[0].folio}</Text>
                    </Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Descripción:
                        <Text className="font-normal"> {selectedItem ? selectedItem.issueDescription : repairData[0].issueDescription}</Text>
                    </Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Cliente:
                        <Text className="font-normal"> {selectedItem ? selectedItem.customerName : repairData[0].customerName}</Text>
                    </Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Técnico:
                        <Text className="font-normal"> {selectedItem ? selectedItem.assignedTo : repairData[0].assignedTo}</Text>
                    </Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Fecha de entrada:
                        <Text className="font-normal"> {selectedItem ? selectedItem.createdAt.toLocaleDateString() : repairData[0].createdAt.toLocaleDateString()}</Text>
                    </Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Fecha de salida:
                        <Text className="font-normal"> {selectedItem ? selectedItem.deliveryDatetoLocaleDateString() : repairData[0].deliveryDate.toLocaleDateString()}</Text>
                    </Text>

                    <Text className="text-start text-md mt-5 ms-3 font-bold text-typography-900">Notas: </Text>
                    <Box className="m-3">
                        {notes.map((note, index) => (
                            <Text key={index} className="text-typography-700 text-md mb-2">- {note}</Text>
                        ))}
                    </Box>
                    <Input className="m-3 mt-5">
                        <InputField value={noteText} onChangeText={setNoteText} placeholder="Agregar una nota" multiline={true} />
                    </Input>
                    <Button onPress={handleAddNote} className="m-3">
                        <ButtonText>Agregar</ButtonText>
                    </Button>
                </Box>
            </View>
        </ScrollView>
    );
}

export default RepairDetails;