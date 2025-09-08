import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable, Text } from '@react-navigation/elements';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { House, Package, Wrench } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import "../../../../shared/styles/globals.css";



export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const icon = {
    index: (props: any) => <House name="Home" size={24} {...props}/>,
    inventory: (props: any) => <Package name="Inventory" size={24} {...props}/>,
    repairs: (props: any) => <Wrench name="Repairs" size={24} {...props}/>

  }


  return (
    <View style={ styles.tabbar }>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.name}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {icon[route.name]({
                color: isFocused ? colors.primary : colors.text
            })}
            <Text style={{ color: isFocused ? colors.primary : colors.text }}>
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: '30',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: '80',
        paddingVertical: '15',
        borderRadius: 30,
        shadowColor: '#fff',
        shadowOffset: {width:0, height:0},
        shadowRadius: 10,
        shadowOpacity: 0.3
    },
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    }
})