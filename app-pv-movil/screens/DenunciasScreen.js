import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, FlatList, Alert, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function DenunciaForm() {
  const [denuncia, setDenuncia] = useState('');
  const [images, setImages] = useState([]);  // Lista para almacenar las imágenes
  const [denunciasList, setDenunciasList] = useState([]);
  const [motivo, setMotivo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [reciclablesSeleccionados, setReciclablesSeleccionados] = useState([]);

  const handleSubmit = () => {
    if (!denuncia || !motivo || reciclablesSeleccionados.length === 0) {
      Alert.alert('Error', 'Por favor ingresa una denuncia, selecciona un motivo y al menos un elemento reciclable.');
      return;
    }
  
    // Validar el número de teléfono como obligatorio
    if (!telefono) {
      Alert.alert('Error', 'Por favor ingresa un número de teléfono.');
      return;
    }
  
    // Validar el formato del número de teléfono
    const telefonoValido = /^\+569\d{8}$/.test(telefono);
    if (!telefonoValido) {
      Alert.alert('Error', 'Por favor ingresa un número de teléfono válido (formato: +569XXXXXXXX).');
      return;
    }
  
    // Crear la nueva denuncia
    const newDenuncia = {
      id: denunciasList.length + 1,
      texto: denuncia,
      motivo: motivo,
      reciclables: reciclablesSeleccionados,
      imagenes: images,
      telefono: telefono,
    };
  
    // Actualizar la lista de denuncias y reiniciar los valores del formulario
    setDenunciasList([newDenuncia, ...denunciasList]);
    setDenuncia('');
    setMotivo('');
    setImages([]);
    setReciclablesSeleccionados([]);
    setTelefono('');
    Alert.alert('Denuncia enviada', 'Gracias por ayudarnos a mejorar la ciudad.');
  };
  
  const pickImageFromCamera = async () => {
    if (images.length >= 6) {
      Alert.alert('Límite alcanzado', 'Solo puedes subir un máximo de 6 imágenes.');
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false, // Configura si se permite editar la imagen después de capturarla
        quality: 1,
      });
  
      if (!result.canceled) {
        setImages([...images, result.assets[0].uri]); // Agrega la imagen capturada a la lista
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la cámara.');
    }
  };
  
  const pickImageFromLibrary = async () => {
    if (images.length >= 6) {
      Alert.alert('Límite alcanzado', 'Solo puedes subir un máximo de 6 imágenes.');
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Esto debe ser falso para selección múltiple
        allowsMultipleSelection: true, // Habilita la selección múltiple
        quality: 1,
      });
  
      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri); // Obtiene las URIs de las imágenes seleccionadas
        const updatedImages = [...images, ...selectedImages].slice(0, 6); // Asegura que no se superen las 6 imágenes
        setImages(updatedImages); // Actualiza la lista de imágenes
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la galería.');
    }
  };

  const deleteImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const selectMotivo = (motivoSeleccionado) => {
    setMotivo(motivoSeleccionado);
    setModalVisible(false); // Cerrar el modal después de seleccionar
  };

  const toggleReciclable = (elemento) => {
    if (reciclablesSeleccionados.includes(elemento)) {
      setReciclablesSeleccionados(reciclablesSeleccionados.filter((item) => item !== elemento));
    } else {
      setReciclablesSeleccionados([...reciclablesSeleccionados, elemento]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Formulario de Denuncia</Text>

      <View style={styles.marginBottom}>
        <Text>Número de Teléfono : <Text style={styles.asterisco}>*</Text></Text>
        <TextInput
          style={styles.textInputphone}
          keyboardType="phone-pad"
          placeholder="+56912345678"
          value={telefono}
          onChangeText={setTelefono}
        />
      </View>

      {/* Selección de Motivo */}
      <View style={styles.marginBottom}>
        <Text>Motivo de la denuncia: <Text style={styles.asterisco}>*</Text></Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.selectMotivo}>
            <Text>{motivo ? motivo : 'Seleccione un motivo'}</Text>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Tipo de denuncia</Text>
              <Text style={styles.marginBottom}>Selecciona el motivo de la denuncia:</Text>

              {['Contenedor con residuos no permitidos','Contenedor con mezcla de reciclables y no reciclables','Contenedor con residuos peligrosos o no adecuados','Contenedor con alimentos no embalados o material de construcción','Basura fuera del contenedor o desbordada','Contenedor mal ubicado o bloqueado','Contenedor en abandono o fuera del horario','Otros'].map((motivoText) => (
                <TouchableOpacity key={motivoText} onPress={() => selectMotivo(motivoText)}>
                  <View style={styles.motivoButton}>
                    <Text><Text style={styles.bold}>{motivoText}: </Text>Descripción del motivo</Text>
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModal}>
                <View style={styles.closeModalButton}>
                  <Text style={styles.closeModalText}>Cerrar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Descripción de la denuncia */}
      <Text>Descripción de la denuncia: <Text style={styles.asterisco}>*</Text></Text>
      <TextInput
        style={styles.textInput}
        multiline
        numberOfLines={4}
        onChangeText={setDenuncia}
        value={denuncia}
        placeholder="Describe el problema que has encontrado..."
      />

      {/* Selección de elementos reciclables */}
      <Text>Seleccione los elementos reciclables: <Text style={styles.asterisco}>*</Text></Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {['Papel', 'Vidrio', 'Cartón', 'Plástico', 'Otros'].map((elemento) => (
          <TouchableOpacity key={elemento} onPress={() => toggleReciclable(elemento)}>
            <View style={{ padding: 10, margin: 5, backgroundColor: reciclablesSeleccionados.includes(elemento) ? '#388E3C' : '#B0BEC5', borderRadius: 5 }}>
              <Text style={{ color: 'white' }}>{elemento}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
        <TouchableOpacity onPress={pickImageFromLibrary} style={styles.selectImageButton}>
          <Text style={styles.selectImageButtonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImageFromCamera} style={styles.cameraButton}>
          <Text style={styles.selectImageButtonText}>Tomar Foto</Text>
        </TouchableOpacity>
      </View>

      {/* Previsualización de imágenes */}
      <View style={styles.imagePreview}>
        {images.map((imageUri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity onPress={() => deleteImage(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Button title="Enviar Denuncia" onPress={handleSubmit} color="#41a3ff" />

      <Text style={styles.marginTop}>
        <Text style={styles.asterisco}>*</Text> Campos obligatorios
      </Text>
    </ScrollView>
  );
}

const styles = {
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#41a3ff',
  },
  marginBottom: {
    marginBottom: 20,
  },
  marginTop: {
    marginTop: 20,
  },
  textInput: {
    height: 120,
    borderColor: '#41a3ff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  textInputphone: {
    height: 40,
    borderColor: '#41a3ff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  asterisco: {
    color: 'red',
  },
  selectMotivo: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#41a3ff',
    marginTop: 10,
  },
  selectImageButton: {
    backgroundColor: '#41a3ff',
    padding: 10,
    borderRadius: 5,
  },
  cameraButton: {
    backgroundColor: '#41a3ff',
    padding: 10,
    borderRadius: 5,
  },
  imagePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#41a3ff',
    padding: 5,
    borderRadius: 15,
  },
  deleteButtonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#41a3ff',
    marginBottom: 10,
    textAlign: 'center',
  },
  motivoButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#41a3ff',
    borderRadius: 5,
  },
  closeModal: {
    marginTop: 20,
  },
  closeModalButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  closeModalText: {
    color: 'white',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  }
};
