import React, { useState } from 'react';
import Colors from './Colorstyle';
import { View, Text, TextInput, Button, Image, Alert, TouchableOpacity, Modal, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function DenunciaForm() {
  const [denuncia, setDenuncia] = useState('');
  const [images, setImages] = useState([]);
  const [motivo, setMotivo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [reciclablesSeleccionados, setReciclablesSeleccionados] = useState([]);

  const handleSubmit = () => {
    if (!denuncia || !motivo || reciclablesSeleccionados.length === 0 || !telefono || !/^\+569\d{8}$/.test(telefono)) {
      Alert.alert('Error', 'Por favor ingresa una denuncia, selecciona un motivo, al menos un reciclable y un teléfono válido.');
      return;
    }

    const newDenuncia = { id: Date.now(), texto: denuncia, motivo, reciclables: reciclablesSeleccionados, imagenes: images, telefono };
    setDenuncia(''); setMotivo(''); setImages([]); setReciclablesSeleccionados([]); setTelefono('');
    Alert.alert('Denuncia enviada', 'Gracias por ayudarnos a mejorar la ciudad.');
  };

  const pickImage = async (fromCamera = false) => {
    if (images.length >= 6) {
      Alert.alert('Límite alcanzado', 'Solo puedes subir un máximo de 6 imágenes.');
      return;
    }

    const result = fromCamera 
      ? await ImagePicker.launchCameraAsync({ quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, quality: 1 });

    if (!result.canceled) {
      const newImages = result.assets ? result.assets.map((asset) => asset.uri) : [result.assets[0].uri];
      setImages((prevImages) => [...prevImages, ...newImages].slice(0, 6));
    } else {
      Alert.alert('Error', 'No se pudo acceder a la cámara o galería.');
    }
  };

  const toggleReciclable = (elemento) => {
    setReciclablesSeleccionados(prev => prev.includes(elemento) ? prev.filter(item => item !== elemento) : [...prev, elemento]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Formulario de Denuncia</Text>

      {/* Tarjeta que envuelve el formulario */}
      <View style={styles.card}>
        <View style={styles.marginBottom}>
          <Text>Número de Teléfono: <Text style={styles.asterisco}>*</Text></Text>
          <TextInput style={styles.textInputTelefono} keyboardType="phone-pad" placeholder="+56912345678" value={telefono} onChangeText={setTelefono} />
        </View>

        <View style={styles.marginBottom}>
          <Text>Motivo de la denuncia: <Text style={styles.asterisco}>*</Text></Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.selectMotivo}><Text>{motivo || 'Seleccione un motivo'}</Text></View>
          </TouchableOpacity>
          <Modal transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Tipo de denuncia</Text>
                {['Contenedor con residuos no permitidos', 'Contenedor con mezcla de reciclables y no reciclables', 'Contenedor con residuos peligrosos'].map(motivoText => (
                  <TouchableOpacity key={motivoText} onPress={() => { setMotivo(motivoText); setModalVisible(false); }}>
                    <View style={styles.motivoButton}><Text>{motivoText}</Text></View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModal}><Text style={styles.closeModalText}>Cerrar</Text></TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        <Text>Descripción de la denuncia: <Text style={styles.asterisco}>*</Text></Text>
        <TextInput style={styles.textInput} multiline numberOfLines={4} onChangeText={setDenuncia} value={denuncia} placeholder="Describe el problema que has encontrado..." />

        <Text>Seleccione los elementos reciclables: <Text style={styles.asterisco}>*</Text></Text>
        {/* Tarjeta para los elementos reciclables */}
        <View style={styles.card}>
          <View style={styles.reciclablesContainer}>
            {['Papel', 'Vidrio', 'Cartón', 'Plástico', 'Otros'].map((elemento) => (
              <TouchableOpacity key={elemento} onPress={() => toggleReciclable(elemento)}>
                <View style={{ padding: 10, margin: 5, backgroundColor: reciclablesSeleccionados.includes(elemento) ? '#388E3C' : '#B0BEC5', borderRadius: 5 }}>
                  <Text style={{ color: 'white' }}>{elemento}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text>Agregar imagenes:</Text>
        <View
          style={styles.dropArea}
          onTouchEnd={() => Alert.alert('Seleccionar Imagen', '¿Quieres tomar la foto con la cámara o seleccionar desde la galería?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Cámara', onPress: () => pickImage(true) },
            { text: 'Galería', onPress: () => pickImage(false) }
          ])}
        >
          <Text style={styles.dropAreaText}>Haz clic para seleccionar o tomar una foto</Text>
        </View>

        <View style={styles.imagePreview}>
          {images.map((imageUri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity onPress={() => setImages(images.filter((_, i) => i !== index))} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Button title="Enviar Denuncia" onPress={handleSubmit} color={Colors.primary} />
        <Text style={styles.marginTop}><Text style={styles.asterisco}>*</Text> Campos obligatorios</Text>
      </View>
    </ScrollView>
  );
}

const styles = {
  scrollContainer: { 
    flexGrow: 1, 
    paddingBottom: 20, 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: Colors.primary, 
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 20,
  },
  asterisco: { 
    color: 'red' 
  },
  textInput: { 
    height: 120, 
    borderColor: Colors.primary, 
    borderWidth: 1, 
    borderRadius: 5, 
    padding: 10 
  },
  textInputTelefono: { 
    height: 40, 
    borderColor: Colors.primary, 
    borderWidth: 1, 
    borderRadius: 5, 
    padding: 10 
  },
  selectMotivo: { 
    padding: 10, 
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: Colors.primary, 
    marginTop: 10 
  },
  dropArea: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  dropAreaText: {
    color: Colors.primary, 
    fontSize: 16
  },
  reciclablesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 20 
  },
  imagePreview: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 20 
  },
  imageContainer: { 
    position: 'relative', 
    margin: 5 
  },
  image: { 
    width: 100, 
    height: 100, 
    borderRadius: 5 
  },
  deleteButton: { 
    position: 'absolute', 
    top: 5, 
    right: 5, 
    backgroundColor: '#FF6347', 
    borderRadius: 50, 
    padding: 5 
  },
  deleteButtonText: { 
    color: 'white' 
  },
  marginBottom: { 
    marginBottom: 10 
  },
  marginTop: { 
    marginTop: 20 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContent: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 10, 
    width: '80%' 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  motivoButton: { 
    padding: 10, 
    backgroundColor: '#388E3C', 
    borderRadius: 5, 
    marginVertical: 5 
  },
  closeModal: { 
    marginTop: 20, 
    backgroundColor: '#FF6347', 
    borderRadius: 5, 
    padding: 10, 
    alignItems: 'center' 
  },
  closeModalText: { 
    color: 'white', 
    fontSize: 16 
  }
};



