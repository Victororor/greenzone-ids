import React, { useEffect, useState } from "react";
import AdminBottomBar from "../components/AdminBottomBar";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { getAllPlaces, updatePlace, deletePlace } from "../services/place";
import styles from "../styles/AdminPlacesStyle";

const CATEGORIES = [
  { value: "restaurant", label: "Ristorante" },
  { value: "shop", label: "Negozio" },
  { value: "farm", label: "Fattoria" },
  { value: "market", label: "Mercato" },
  { value: "cafe", label: "Caffetteria" },
  { value: "bakery", label: "Panificio" },
  { value: "other", label: "Altro" },
];

export default function AdminPlacesScreen() {
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("other");
  const [editCity, setEditCity] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editDescription, setEditDescription] = useState("");

  {
    /* Carica i luoghi dall'API */
  }
  async function loadPlaces() {
    try {
      setLoading(true);
      const res = await getAllPlaces();
      setPlaces(res.data.places || res.data || []);
    } catch (err) {
      console.log("LOAD ERROR:", err);
      Alert.alert("Errore", "Impossibile caricare i luoghi.");
    } finally {
      setLoading(false);
    }
  }

  {
    /* Carica i luoghi all'avvio */
  }
  useEffect(() => {
    loadPlaces();
  }, []);

  // Funzione per aprire il modale e riempire i campi
  function openEditModal(item) {
    setSelectedPlace(item);
    setEditName(item.name || "");
    // Se la categoria nel DB non corrisponde a nessuna lista, usa "other"
    setEditCategory(item.category || "other");
    setEditCity(item.location?.city || "");
    setEditAddress(item.location?.address || "");
    setEditDescription(item.description || "");
    setModalVisible(true);
  }

  {
    /* Salva le modifiche al luogo */
  }
  async function handleSave() {
    if (!selectedPlace) return;

    try {
      const updatedData = {
        name: editName,
        category: editCategory, // Valore preso dal Picker
        location: {
          ...selectedPlace.location,
          city: editCity,
          address: editAddress,
        },
      };

      await updatePlace(selectedPlace.id, updatedData);

      Alert.alert("Successo", "Luogo aggiornato correttamente");
      setModalVisible(false);
      loadPlaces();
    } catch (err) {
      console.error(err);
      Alert.alert("Errore", "Impossibile aggiornare il luogo.");
    }
  }

  {
    /* Elimina il luogo */
  }
  async function handleDelete() {
    if (!selectedPlace) return;

    Alert.alert(
      "Elimina Luogo",
      "Sei sicuro di voler eliminare definitivamente questo luogo?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlace(selectedPlace.id);
              setModalVisible(false);
              loadPlaces();
            } catch (err) {
              Alert.alert("Errore", "Impossibile eliminare il luogo.");
            }
          },
        },
      ],
    );
  }

  const renderItem = ({ item }) => (
    <Pressable style={styles.card} onPress={() => openEditModal(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>

      <Text style={styles.cardCategory}>
        {CATEGORIES.find((cat) => cat.value === item.category)?.label ||
          "Altro"}
      </Text>

      <View style={styles.rowInfo}>
        <Ionicons name="location-outline" size={16} color="#6B7280" />
        <Text style={styles.cardSubtitle}>
          {item.location.city} {"\n"} {item.location.address}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Gestione Luoghi</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#14948B"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nessun luogo trovato.</Text>
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView behavior="height" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Modifica Luogo</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Nome Luogo</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
              />

              <Text style={styles.label}>Descrizione</Text>
              <TextInput
                style={styles.input}
                value={editDescription}
                onChangeText={setEditDescription}
              />

              <Text style={styles.label}>Categoria</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editCategory}
                  onValueChange={(itemValue) => setEditCategory(itemValue)}
                  style={styles.picker}
                  mode="dropdown"
                >
                  {CATEGORIES.map((cat) => (
                    <Picker.Item
                      key={cat.value}
                      label={cat.label}
                      value={cat.value}
                    />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Città</Text>
              <TextInput
                style={styles.input}
                value={editCity}
                onChangeText={setEditCity}
              />

              <Text style={styles.label}>Indirizzo</Text>
              <TextInput
                style={styles.input}
                value={editAddress}
                onChangeText={setEditAddress}
              />

              <Pressable style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Salva Modifiche</Text>
              </Pressable>

              <Pressable style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteBtnText}>Elimina Luogo</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <AdminBottomBar />
    </View>
  );
}
