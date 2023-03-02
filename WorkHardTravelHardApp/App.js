import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./colors";
const STORAGE_KEY = "@toDos";
const TAB_STATUS_KEY = "@tabStatus";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  useEffect(() => {
    loadTabStatus();
    loadToDos();
  }, []);

  useEffect(() => {
    saveTabStatus();
  }, [working]);

  const onChangeText = (payload) => {
    setText(payload);
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, checked: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = async (key) => {
    Alert.alert("DELETE TO DO", "ARE YOU SURE?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
  };

  const checkedToDo = async (key) => {
    const newToDos = { ...toDos };
    newToDos[key].checked = true;
    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  const loadTabStatus = async () => {
    const s = await AsyncStorage.getItem(TAB_STATUS_KEY);
    setWorking(JSON.parse(s)["tabStatus"]);
  };

  const saveTabStatus = async () => {
    const tabStatus = { tabStatus: working };
    await AsyncStorage.setItem(TAB_STATUS_KEY, JSON.stringify(tabStatus));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : "white" }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder={working ? "Add a to do" : "Where do you want to go?"}
        style={styles.input}
        value={text}
        onChangeText={onChangeText}
        onSubmitEditing={addToDo}
        returnKeyType="done"
      ></TextInput>
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View key={key} style={styles.toDo}>
              <Text
                style={{
                  ...styles.toDoText,
                  textDecorationLine: toDos[key].checked
                    ? "line-through"
                    : null,
                }}
              >
                {toDos[key].text}
              </Text>
              <View style={styles.btnArea}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => checkedToDo(key)}
                >
                  <Fontisto name="checkbox-active" size={18} color="gray" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => deleteToDo(key)}
                >
                  <Fontisto name="trash" size={18} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 100,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 10,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  btnArea: {
    flexDirection: "row",
  },
  btn: {
    paddingHorizontal: 3,
  },
});
