import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  font: {
    fontSize: 18,
  },
  heading: {    
    marginBottom: 13, 
  },
  statusContainer: {
    flexDirection:"row",
    textAlignVertical: 'center',
    marginBottom: 13,
  },
  statusComponent: {
    marginRight: 13,
  },   
  card: {  
    backgroundColor: 'white',  
    borderRadius: 5,  
    padding: 10,
    marginVertical: 10, 
    marginHorizontal: 20, 
  },  
  shadowProp: {  
    shadowOffset: {width: -2, height: 4},  
    shadowColor: '#171717',  
    shadowOpacity: 0.2,  
    shadowRadius: 3,  
  },  
  snifferContainer: {
    borderRadius: '10px',
    background: '#FFFFFF',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  buttons: {
    flexDirection:"row",
    marging: 13,
  },
  button: {
    marginRight: 13,
    marging: 13,
    padding: 13,
  },
});
