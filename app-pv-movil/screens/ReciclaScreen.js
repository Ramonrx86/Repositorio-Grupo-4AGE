import React from 'react';
import Colors from './Colorstyle';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ReciclaScreen() {
  const tips = [
    {
      icon: 'paper-plane', // Icono para reciclaje de papel
      title: 'Reciclaje de Papel',
      content: 'Asegúrate de separar el papel limpio. No se debe reciclar papel sucio o con grasa (como cartones de pizza).',
    },
    {
      icon: 'recycle', // Icono para reciclaje de botellas plásticas
      title: 'Botellas Plásticas',
      content: 'Limpia las botellas plásticas antes de reciclarlas. Asegúrate de quitar la tapa y reciclarla por separado.',
    },
    {
      icon: 'trash',
      title: 'Papel Húmedo',
      content: 'No se debe reciclar papel que esté mojado o utilizado para higiene, ya que no se puede procesar adecuadamente.',
    },
    {
      icon: 'glass', // Icono para envases de vidrio
      title: 'Envases de Vidrio',
      content: 'Recicla botellas y frascos de vidrio, pero asegúrate de que estén vacíos y limpios. No reciclar cristales rotos o cerámica.',
    },
    {
      icon: 'recycle', // Icono para botellas PET (reciclaje en general)
      title: 'Botellas de Plástico PET',
      content: 'Las botellas de PET (como las de bebidas) deben ser recicladas correctamente. Aplástalas para ahorrar espacio.',
    },
  ];

  return (
    <ScrollView style={estilos.contenedor}>
      <Text style={estilos.encabezado}>Consejos para Reciclar</Text>
      {tips.map((item, index) => (
        <TouchableOpacity key={index} activeOpacity={0.8}>
          <View style={estilos.tarjeta}>
            <View style={estilos.encabezadoTarjeta}>
              <FontAwesome name={item.icon} size={24} color={Colors.primary} />
              <Text style={estilos.titulo}>{item.title}</Text>
            </View>
            <Text style={estilos.contenido}>{item.content}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },
  encabezado: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: Colors.primary,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  encabezadoTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: Colors.primary,
  },
  contenido: {
    fontSize: 16,
    color: '#666',
  },
});
