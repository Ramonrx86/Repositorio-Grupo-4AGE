import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarioScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const scrollViewRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, date: '2024-11-15', text: 'Recolección de residuos reciclables', issuedOn: '2024-11-01' },
    { id: 2, date: '2024-11-16', text: 'Reunión sobre estrategias de reciclaje', issuedOn: '2024-11-02' },
    { id: 3, date: '2024-11-17', text: 'Entrega de reporte de reciclaje', issuedOn: '2024-11-03' },
    { id: 4, date: '2024-11-18', text: 'Limpieza comunitaria y separación de basura', issuedOn: '2024-11-04' },
    { id: 5, date: '2024-11-19', text: 'Revisión de centros de reciclaje', issuedOn: '2024-11-05' },
    { id: 6, date: '2024-11-20', text: 'Día de capacitación sobre reciclaje y recolección', issuedOn: '2024-11-06' },
    { id: 7, date: '2024-11-21', text: 'Recolección de residuos no reciclables', issuedOn: '2024-11-07' },
    { id: 8, date: '2024-11-22', text: 'Revisión de contenedores de reciclaje', issuedOn: '2024-11-08' },
    { id: 9, date: '2024-11-23', text: 'Inspección de puntos de recolección de basura', issuedOn: '2024-11-09' },
    { id: 10, date: '2024-11-24', text: 'Día sin basura: Participa en el reciclaje comunitario', issuedOn: '2024-11-10' },
  ]);
  

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    scrollToNotification(day.dateString);
  };

  const scrollToNotification = (date) => {
    const index = notifications.findIndex(notification => notification.date === date);
    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: index * 80, animated: true });
    }
  };

  const getCustomTextForDate = (dateString) => {
    const notification = notifications.find(
      (notification) => notification.date === dateString
    );
    return notification ? notification.text : '';
  };

  const renderDay = (day) => {
    const customText = getCustomTextForDate(day.dateString);

    if (customText) {
      return (
        <View style={[styles.customDayContainer, { backgroundColor: '#2de414' }]}>
          <Text style={styles.customDayText}>{customText}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.dayContainer}>
          <Text style={styles.dayText}>{day.day}</Text>
        </View>
      );
    }
  };

  const markedDates = notifications.reduce((acc, notification) => {
    acc[notification.date] = {
      marked: true,
      dotColor: 'red',
      selectedColor: '#41a3ff',
    };
    return acc;
  }, {});

  const handleNotificationPress = (date) => {
    setSelectedDate(date);
    scrollToNotification(date);
  };

  return (
    <View style={styles.container}>
      <Calendar
        renderDay={renderDay}
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: '#41a3ff',
            selectedTextColor: 'white',
          },
        }}
        monthFormat={'yyyy MM'}
        style={styles.calendar}
      />

      <Text style={styles.selectedDateText}>
        {selectedDate ? getCustomTextForDate(selectedDate) || `Fecha seleccionada: ${selectedDate}` : 'Selecciona una fecha'}
      </Text>

      <ScrollView
        style={styles.notificationsContainer}
        contentContainerStyle={styles.notificationsContentContainer}
        ref={scrollViewRef}
      >
        {notifications.map((notification) => (
          <View
            key={notification.id}
            style={[styles.notification, notification.date === selectedDate ? styles.selectedNotification : {}]}
          >
            <Text
              style={styles.notificationText}
              onPress={() => handleNotificationPress(notification.date)}
            >
              {notification.text} - Emitido el {notification.issuedOn}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  selectedDateText: {
    marginTop: 20,
    fontSize: 20,  // Tamaño de texto aumentado
    fontWeight: '600',
    color: '#41a3ff',
  },
  customDayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: 50,  // Aumentar tamaño del día
    height: 50,  // Aumentar tamaño del día
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    color: '#333',
    fontSize: 20,  // Aumentar tamaño de texto de los días
  },
  notificationsContainer: {
    marginTop: 20,
    width: '100%',
    padding: 10,
  },
  notificationsContentContainer: {
    alignItems: 'center',
  },
  notification: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '90%',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  selectedNotification: {
    backgroundColor: '#aed6f1',
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  calendar: {
    width: 350,
    marginHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 20,
    height: 350,  // Aumentar altura del calendario
  },
});

export default CalendarioScreen;







