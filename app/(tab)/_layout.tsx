import { TabBar } from "@/shared/components/ui/Bottom-React/TabBar";
import { Tabs } from "expo-router";
import React from 'react';

export default function TabLayout() {
    return(
        <Tabs screenOptions={{ headerShown: false}} tabBar={(props) => <TabBar {...props} />}
        >
            <Tabs.Screen
                name="index" 
                options={{
                title: 'Home',
                }}
            />
            <Tabs.Screen
                name="repairs"
                options={{
                title: 'Repairs',
                }}
            />
            <Tabs.Screen
                name="inventory"
                options={{
                title: 'Inventory',
                }}
            />
        </Tabs>
    );
}
