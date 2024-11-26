import React from 'react';//Botón debajo del logo
import { View, Text, StyleSheet, Alert, FlatList, Pressable, Linking } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';


const ContactoScreen = () => {
  //Enlaces guardados en una constante
  const contactData = [ 
    {
      id: '1',
      title: 'Página Municipal',
      description: 'Visita nuestra página oficial para más información.',
      link: 'https://www.municipalidad.cl',
      icon: 'globe',
    },
    {
      id: '2',
      title: 'Correo Electrónico',
      description: 'Escríbenos a nuestro correo de contacto para preguntas o problemas.',
      link: 'mailto:contacto@municipalidad.cl',
      icon: 'envelope',
    },
    {
      id: '3',
      title: 'Número de Teléfono',
      description: 'Llámanos para consultas.',
      link: 'tel:+56-652661211',
      icon: 'phone',
    },
    {
      id: '4',
      title: 'Facebook',
      description: 'Síguenos en nuestra página oficial de Facebook para mantenerte actualizado.',
      link: 'https://www.facebook.com/MuniQuinchao',
      icon: 'facebook',
    },
    {
      id: '5',
      title: 'Instagram',
      description: 'Síguenos en nuestra página oficial de Instagram para más imágenes.',
      link: 'https://www.instagram.com/muniquinchao/',
      icon: 'instagram',
    },
  ];
//Marca error en caso de haber algún problema con el enlace
  const handlePress = (link) => {
    Linking.openURL(link).catch(() => {
      Alert.alert('Error', 'No se pudo abrir el enlace.');
    });
  };
  //Iconos de los enlaces, tamaño y color
  const renderContactoItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Icon name={item.icon} size={46} color="#4caf50" style={styles.icon} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
         {/* Botón para dirigirse al enlace o número de contacto y correo */}
        <Pressable onPress={() => handlePress(item.link)} style={styles.button}>
          <Text style={styles.buttonText}>Abrir</Text>
        </Pressable>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contacto</Text>
      <FlatList
        data={contactData}
        renderItem={renderContactoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 10,
    margin: 8,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginVertical: 8,
    elevation: 4,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    margin: 6,
  },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ContactoScreen;