import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Switch
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [person, setPerson] = useState(true);
  const [idNumber, setIdNumber] = useState('');
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [maxLenght, setMaxLenght] = useState('')

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submit = async () => {
    if ( idNumber.trim().length !== (person? 11 : 10)) {
      alert("Podaj numer dowodu osobistego lub NIP");
      return;
    }
    try {
      setLoading(true);
      fetch("https://localhost:60001/Contractor/Save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          surname,
          person,
          idNumber,
          image
        }),
      }).then(async (response) => {
        if (response.status === 404) {
          alert("Nie znaleziono metody zapisu")
        } else {
          console.log(response);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>Jakub Kasprzyk</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.action}>
            <TextInput
              onChangeText={(value) => setName(value)}
              placeholder="Imie"
              style={styles.textInput}
            />
          </View>
          <View style={styles.action}>
            <TextInput
              onChangeText={(value) => setSurname(value)}
              placeholder="Nazwisko"
              style={styles.textInput}
            />
          </View>
          <View style={styles.action}>
            <Text>Firma</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={person ? "blue" : "blue"}
              onValueChange={() => setPerson(prev => !prev)}
              value={person}
            />
            <Text>Osoba</Text>
            <TextInput
              onChangeText={(value) => setIdNumber(value)}
              placeholder="id"
              keyboardType="numeric"
              maxLength={person? 11 : 10}
              style={styles.textInput}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Dodaj zdjecie</Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 150, height: 150 }}
            />
          )}
          {loading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity style={styles.button} onPress={submit}>
              <Text style={styles.buttonText}>Potwierdz</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009245",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  textHeader: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  button: {
    marginVertical: 10,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    backgroundColor: "lightblue",
    padding: 10,
  },
});
