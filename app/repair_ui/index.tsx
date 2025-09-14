import { Box } from '@/shared/components/ui/box';
import { Button, ButtonText } from '@/shared/components/ui/button';
import { Image } from '@/shared/components/ui/image';
import { Input, InputField } from '@/shared/components/ui/input';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';

type Repair = {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deviceModel: string;
    issueDescription: string;
    status:
    | "in_review"
    | "repairing"
    | "waiting_parts"
    | "done"
    | "not_repaired"
    | "delivered";
    createdAt: Date;
    updatedAt: Date;
    assignedTo: string;
    estimatedCost: number;
    finalCost: number;
    deliveryDate: Date;
    folio: string;
}; //datos de la reparación

type Attachment = {
    uri: string;
    name: string;
    size?: number | null;
    mimeType?: string | null;
}; //datos de los archivos


const RepairDetails: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<Repair | null>(null);
    const [noteText, setNoteText] = useState('');
    const [notes, setNotes] = useState<string[]>([
        'Se necesita reemplazar la pantalla.',
        'El cliente prefiere que se cambie la batería también.',
        'A la espera de piezas para la reparación.',
    ]);//notas ejemplo

    const [files, setFiles] = useState<Attachment[]>([]);

    const handleAddNote = () => {
        if (noteText.trim() !== '') {
            setNotes((prev) => [...prev, noteText.trim()]);
            setNoteText('');
        }
    }; //maneja la inserción de notas

    const mockRepairs: Repair[] = [
        {
            id: 1,
            customerName: "Michelle Garza",
            customerEmail: "michelle@email.com",
            customerPhone: "555-1234",
            deviceModel: "iPhone 14 Pro",
            issueDescription: "Pantalla rota, no responde al tacto",
            status: "repairing",
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date(),
            assignedTo: "tech-1",
            estimatedCost: 2500,
            finalCost: 0,
            deliveryDate: new Date("2024-01-20"),
            folio: "FT-2024-001",
        }
    ] //simular una reparación

    const getStatusText = (status: Repair["status"]) => {
        const statusMap = {
            in_review: "En Revisión",
            repairing: "Reparando",
            waiting_parts: "Esperando Piezas",
            done: "Terminado",
            not_repaired: "No Reparado",
            delivered: "Entregado",
        };
        return statusMap[status];
    }; //establecer nombre de estados

    const current = selectedItem ?? mockRepairs[0]; //guarda el item seleccionado en current

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newFile = result.assets.map(asset => ({
                    uri: asset.uri,
                    name: asset.name ?? '',
                    size: asset.size,
                    mimeType: asset.mimeType,
                }));
                setFiles(prev => [...prev, ...newFile]);
            }
        } catch (error) {
            alert('Error al seleccionar el archivo.');
        }
    }; //para subir un archivo

    const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));
    const openFile = async (uri: string) => {
        try {
            await Linking.openURL(uri);
        } catch (error) {
            alert('Error al abrir el archivo');
        }
    }; //para eliminar un archivo

    return (
        <ScrollView className="bg-background-50">
            <View className="flex-1 p-5 mb-8 items-start">

                <Box className="mt-10 p-5 w-full h-auto bg-background-50 border-2 border-background-200">
                    <Box className="w-full h-auto items-center">
                        <Image source={require('assets/images/smartphone-cartoon.png')} className="w-44 h-44" alt='imagen dispositivo' />
                    </Box>

                    <Text className="text-center mb-4 text-xl font-extrabold text-typography-900">{current.deviceModel}</Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Folio:
                        <Text className="font-normal"> {current.folio}</Text>
                    </Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Descripción:
                        <Text className="font-normal"> {current.issueDescription}</Text>
                    </Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Cliente:
                        <Text className="font-normal"> {current.customerName}</Text>
                    </Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Técnico:
                        <Text className="font-normal"> {current.assignedTo}</Text>
                    </Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Fecha de entrada:
                        <Text className="font-normal"> {current.createdAt.toLocaleDateString()}</Text>
                    </Text>
                    <Text className="text-start text-md m-3 font-bold text-typography-900">Fecha de salida:
                        <Text className="font-normal"> {current.deliveryDate.toLocaleDateString()}</Text>
                    </Text>

                    <Text className="text-start text-md mt-5 ms-3 font-bold text-typography-900">Notas: </Text>
                    <Box className="m-3">
                        {notes.map((note, index) => (
                            <Text key={index} className="text-typography-700 text-md mb-2">• {note}</Text>
                        ))}
                    </Box>
                    <View className= "flex-row items-center justify-between m-3 gap-2">
                        <Input className="flex-1">
                            <InputField value={noteText} onChangeText={setNoteText} placeholder="Agregar una nota" multiline={true} />
                        </Input>
                        <Button onPress={handleAddNote} className="">
                            <ButtonText>Agregar</ButtonText>
                        </Button>
                    </View>

                    <Box className="m-3">
                        <Text className="text-start text-md mb-3 font-bold text-typography-900">Archivos Adjuntos</Text>
                        {files.length === 0 ? (
                            <Text className="text-typography-700 text-md">Sin archivos adjuntos.</Text>
                        ) : (
                            files.map((f, idx) => (
                                <View
                                    key={`${f.uri}-${idx}`}
                                    className="flex-row items-center justify-between bg-background-100 border border-background-200 rounded-md px-3 py-2 mb-2"
                                >
                                    <View className="flex-1 pr-2">
                                        <Text className="text-typography-900" numberOfLines={1}>
                                            {f.name}
                                        </Text>
                                        {!!f.size && (
                                            <Text className="text-typography-600 text-xs">
                                                {(f.size / 1024).toFixed(1)} KB {f.mimeType ? `· ${f.mimeType}` : ''}
                                            </Text>
                                        )}
                                    </View>

                                    <View className="flex-row gap-2">
                                        <Button onPress={() => openFile(f.uri)} className="mr-2">
                                            <ButtonText>Abrir</ButtonText>
                                        </Button>

                                        <Button onPress={() => removeFile(idx)} action="negative" variant="solid" className="mr-2">
                                            <ButtonText className="text-white">Eliminar</ButtonText>
                                        </Button>
                                    </View>
                                </View>
                            ))
                        )}
                    </Box>

                    <Button onPress={pickFile} className="m-3">
                        <ButtonText>Adjuntar archivos</ButtonText>
                    </Button>
                </Box>
            </View>
        </ScrollView >
    );
}

export default RepairDetails;