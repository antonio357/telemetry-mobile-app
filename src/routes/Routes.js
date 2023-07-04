import { createDrawerNavigator } from '@react-navigation/drawer';
import RegisteredSniffers from '../screens/sniffers/RegisteredSniffers';
import Sensores from '../screens/sensores/Sensores';
import Videos from '../screens/videos/Videos';
import Recording from '../screens/recording/Recording';
import ExecutionScreen from '../screens/videos/ExecutionScreen';
import PreviewScreen from '../screens/recording/PreviewScreen';
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
        /* unmountOnBlur: true, faz com que as telas sejam que não estão sendo utilizadas sejam destruídas, 
         * economiza recursos mem e cpu, além de ser necessário para garantir o refresh das telas cada vez que forem acessadas */
        unmountOnBlur: true,
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
        /* drawerItemStyle: { display: 'none' } esconde o ícone de seleção no drawer, isso serve para as telas que só devem ser acessadas a partir de outras telas */
        options={{ drawerItemStyle: { display: 'none' } }}
        component={ExecutionScreen}
      />
      <Screen
        name="execution-preview"
        options={{ drawerItemStyle: { display: 'none' } }}
        component={PreviewScreen}
      />
    </Navigator >
  )
}