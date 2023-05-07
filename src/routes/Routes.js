import { createDrawerNavigator } from '@react-navigation/drawer';
import RegisteredSniffers from '../screens/sniffers/RegisteredSniffers';
import Sensores from '../screens/sensores/Sensores';
import Videos from '../screens/videos/Videos';
import Recording from '../screens/recording/Recording';
import ExecutionScreen from '../screens/videos/ExecutionScreen';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';


const { Screen, Navigator } = createDrawerNavigator();

const defaultIconStyles = {
  size: 24,
  color: 'black',
}

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen
        name="sniffers"
        component={RegisteredSniffers}
        options={{
          drawerIcon: () => <Ionicons name="ios-hardware-chip-sharp" size={defaultIconStyles.size} color={defaultIconStyles.color} />
        }}
      />
      <Screen
        name="sensores"
        component={Sensores}
        options={{
          drawerIcon: () => <MaterialIcons name="insert-chart" size={defaultIconStyles.size} color={defaultIconStyles.color} />
        }}
      />
      <Screen
        name="videos"
        component={Videos}
        options={{
          drawerIcon: () => <MaterialIcons name="video-collection" size={defaultIconStyles.size} color={defaultIconStyles.color} />
        }}
      />
      <Screen
        name="gravar"
        component={Recording}
        options={{
          drawerIcon: () => <MaterialIcons name="photo-camera" size={defaultIconStyles.size} color={defaultIconStyles.color} />
        }}
      />
      <Screen
        name="execution-player"
        options={{ drawerItemStyle: { display: 'none' } }} // telas que não tem icone no drawer so são acessíveis por links de outras telas
        component={ExecutionScreen}
      />
    </Navigator >
  )
}