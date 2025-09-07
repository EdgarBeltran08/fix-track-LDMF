import { Box } from "@/shared/components/ui/box";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import "../shared/styles/globals.css";

export default function Index() {
    return (
        <View className="flex-1">
            <TouchableOpacity className="p-4 bg-white rounded-xl shadow-md m-4">
                <Box className="flex-row items-center space-x-4">
                    <Image className="w-16 h-16 rounded-lg" source={{ uri: 'https://i.pinimg.com/736x/d5/80/65/d580658e32c7d4f52cbf02afcc69b3f1.jpg' }} />
                    <View className="flex-1">
                        <Text className="text-lg font-semibold">Dispositivo</Text>
                        <Text className="text-sm text-gray-500">Estado</Text>
                        <Text className="text-sm text-gray-400">Propietario</Text>
                    </View>
                </Box>
            </TouchableOpacity>

            <TouchableOpacity className="p-4 bg-white rounded-xl shadow-md m-4">
                <Box className="flex-row items-center space-x-4">
                    <Image className="w-16 h-16 rounded-lg" source={{ uri: 'https://i.pinimg.com/736x/d5/80/65/d580658e32c7d4f52cbf02afcc69b3f1.jpg' }} />
                    <View className="flex-1">
                        <Text className="text-lg font-semibold">Dispositivo</Text>
                        <Text className="text-sm text-gray-500">Estado</Text>
                        <Text className="text-sm text-gray-400">Propietario</Text>
                    </View>
                </Box>
            </TouchableOpacity>
        </View>
    );
}