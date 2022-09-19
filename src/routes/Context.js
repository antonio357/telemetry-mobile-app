import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from './Routes'


export function Routes() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  )
}