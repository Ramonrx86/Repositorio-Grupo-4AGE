import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, FlatList, Alert, TouchableOpacity, Modal } from 'react-native';
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
    <View style={styles.container}>
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
              <Text style={styles.modalTitle}>Medio Ambiente</Text>
              <Text style={styles.marginBottom}>Selecciona el motivo de la denuncia:</Text>

              <TouchableOpacity onPress={() => selectMotivo('Basura en la vía pública')}>
                <View style={styles.motivoButton}>
                  <Text><Text style={styles.bold}>Basura en la vía pública: </Text>Basura acumulada en espacios públicos.</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectMotivo('Uso de plásticos prohibidos')}>
                <View style={styles.motivoButton}>
                  <Text><Text style={styles.bold}>Uso de plásticos prohibidos: </Text>Plásticos que están prohibidos por regulaciones ambientales locales.</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectMotivo('Contenedor dañado')}>
                <View style={styles.motivoButton}>
                  <Text><Text style={styles.bold}>Contenedor dañado: </Text>Contenedores de reciclaje rotos o inutilizables.</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectMotivo('Botellas fuera del contenedor')}>
                <View style={styles.motivoButton}>
                  <Text><Text style={styles.bold}>Botellas fuera del contenedor: </Text>Botellas fuera de los contenedores, creando desorden.</Text>
                </View>
              </TouchableOpacity>

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
            <View style={{ padding: 10, margin: 5, backgroundColor: reciclablesSeleccionados.includes(elemento) ? 'green' : 'gray' }}>
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


      {/* Recuadro fijo para las imágenes */}
      <View style={styles.imageContainer}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image
              source={{ uri }}
              style={styles.selectedImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => deleteImage(index)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Botón para enviar la denuncia */}
      <Button title="Enviar Denuncia" onPress={handleSubmit} />

      {/* Lista de denuncias 
      <FlatList
        data={denunciasList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text><Text style={styles.bold}>Denuncia #{item.id}: </Text>{item.texto}</Text>
            <Text><Text style={styles.bold}>Motivo: </Text>{item.motivo}</Text>
            <Text><Text style={styles.bold}>Reciclables: </Text>{item.reciclables.join(', ')}</Text>
            {item.imagenes && item.imagenes.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.cardImage}
                resizeMode="contain" // Asegura que la imagen se ajuste sin recortarse
              />
            ))}
          </Card>
        )}
      />     */}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  marginBottom: {
    marginBottom: 20,
  },
  selectMotivo: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  motivoButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  closeModal: {
    marginTop: 20,
  },
  closeModalButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  closeModalText: {
    color: 'white',
    textAlign: 'center',
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    textAlignVertical: 'top',
  },
  selectImageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginBottom: 20,
    margin: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
    cameraButton: {
    backgroundColor: '#2196F3',
    width: 140,
    height: 40,
    padding: 10,
    marginBottom: 20,
    margin: 15,
    padding: 10,
    borderRadius: 6,
  },
  selectImageButtonText: {
    color: 'white',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    height: 180, //Fijar el tamaño del recuadro
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    position: 'relative',
    margin: 5,
  },
  selectedImage: {
    width: 100,
    height: 80,
    margin: 5,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 50,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  card: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  textInputphone: {
    height: 40, // Ajusta la altura del cuadro
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 6, // Opcional, para esquinas redondeadas
    fontSize: 16, // Ajusta el tamaño de la fuente
  },
  asterisco: {
    color: 'red',
  },
};