import {
  Alert,
  Modal,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  addPlantToAllotment,
  getPlantByName,
  deletePlantFromAllotment,
} from "../../firebase/database";
import { PlantType } from "../../types/Plants.types";
import CalendarSinglePlant from "../Calendar";
import theme from "../../styles/theme.style";
import { color } from "react-native-reanimated";
import DateModal from "./components/DateModal";

//--------------------------------need to change any----------------------------------------
const SinglePlantScreen = ({ route }: any) => {
  const [plant, setPlant] = useState<PlantType | undefined>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [error, setError] = useState<any>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { plantName, currentUser } = route.params;

console.log(plantName)

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    getPlantByName(plantName)
      .then((response) => {
        //response type needs to be changed
        setPlant(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        const { message, code } = error;
        setIsLoading(false);
        setError({ message, code });
      });
  }, [plantName]);

  console.log(plant?.sowingInstructions)


  const handleOnPressDelete = () => {
    deletePlantFromAllotment("Rh2gty20wdtiEItYtcz2", plant);
  };

  const addPlant = () => {
    setModalVisible(true);
  };

  return (
    <ScrollView>
      <TouchableOpacity onPress={handleOnPressDelete}>
        <Text>Delete this from your allotment</Text>
      </TouchableOpacity>
      <View style={SinglePlantStyles.container}>
        <DateModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          plantName={plantName}
          plant={plant}
        />
        <Text style={SinglePlantStyles.header}>{plantName}</Text>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : plant && !error ? (
          <>
            <Text>{plant.scientificName}</Text>
            <Image
              style={SinglePlantStyles.plantImage}
              source={{ uri: plant.img }}
            ></Image>
            <Pressable style={SinglePlantStyles.button} onPress={addPlant}>
              <Text style={SinglePlantStyles.buttonText}>+</Text>
            </Pressable>
            <Text>
              Minimum Temperature in Celcius: {plant.minTempCelcius}
              {"\u00B0"}C{/*  "\u00B0" is the symbol for degrees */}
            </Text>
            <Text>Sunlight needed: {plant.sunLight}</Text>
            <Text>Watering needed: {plant.wateringFrequencyInDays}</Text>
            <CalendarSinglePlant plant={plant} />
            {plant.sowingInstructions.map((instruction) => {
              <Text>{instruction}</Text>;
            })}
            {/* <Text>{plant.sowingInstructions.split(".").join("\n\n")}</Text> */}
          </>
        ) : (
          <>
            <Text>{error.code}</Text>
            <Text>{error.message}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default SinglePlantScreen;

export const SinglePlantStyles = StyleSheet.create({
  header: {
    fontSize: theme.mainheader,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 20,
  },
  plantImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.lightcream,
    // padding: 50,
  },
  button: {
    backgroundColor: theme.green, // chose green as original was feature which doesnt exist
    width: 40,
    height: 40,
    justifyContent: "center",
    borderRadius: 20,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "80%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  // buttonClose: {
  //   backgroundColor: "#2196F3",
  // },
});
