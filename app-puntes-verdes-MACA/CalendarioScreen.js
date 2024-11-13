import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarioScreen = () => {
  //Estado para almacenar la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState('');

  //Función que maneja la selección de una fecha
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString); 
  };

  //Función para mostrar el texto personalizado para fechas especiales
  const getCustomTextForDate = (dateString) => {
    switch (dateString) {
      case '2024-11-15':
        return 'Evento Especial';
      case '2024-11-20':
        return 'Día de Reunión';
      case '2024-11-25':
        return 'Vacaciones';
      default:
        return ''; //Si no es una fecha especial, no muestra nada
    }
  };

  //Función para personalizar el texto de los días
  const renderDay = (day) => {
    const customText = getCustomTextForDate(day.dateString);
    
    if (customText) {
      //Si el día tiene un evento especial, lo pintamos con un color verde
      return (
        <View style={[styles.customDayContainer, { backgroundColor: '#2de414' }]}>
          <Text style={styles.customDayText}>{customText}</Text>
        </View>
      );
    } else {
      //Para el resto de los días, muestra el número normal
      return (
        <View style={styles.dayContainer}>
          <Text style={styles.dayText}>{day.day}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario Dinámico</Text>
   
      <Calendar
        //Función para personalizar los días
        renderDay={renderDay}
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: 'blue', // Color de fondo de la fecha seleccionada
            selectedTextColor: 'white', // Color del texto de la fecha seleccionada
          },
        }}
        monthFormat={'yyyy MM'}
      />

      {selectedDate ? (
        <Text style={styles.selectedDateText}>
          {getCustomTextForDate(selectedDate) || `Fecha seleccionada: ${selectedDate}`}
        </Text>
      ) : (
        <Text style={styles.selectedDateText}>Selecciona una fecha</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectedDateText: {
    marginTop: 20,
    fontSize: 18,
  },
  customDayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: 30,
    height: 30,
  },
  customDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: 'black',
  },
});

export default CalendarioScreen;
