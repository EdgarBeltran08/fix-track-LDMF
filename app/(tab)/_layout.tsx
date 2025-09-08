import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Applayout() {
    return(
        <>
            <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen name="Home"/>
                <Tabs.Screen name="Repairs"/>
                <Tabs.Screen name="Inventory"/>
                <Tabs.Screen name="Profile"/>
            </Tabs>
            <StatusBar style="auto"/>
        </>
    );
}
