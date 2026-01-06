import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Title,
  Paragraph,
  Button,
  Card,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../theme/theme';

interface BookingSuccessScreenProps {
  route: {
    params: {
      bookingId: string;
    };
  };
  navigation: any;
}

const BookingSuccessScreen: React.FC<BookingSuccessScreenProps> = ({
  route,
  navigation,
}) => {
  const { bookingId } = route.params;

  const handleViewBookings = () => {
    navigation.navigate('MainTabs', {
      screen: 'Profile',
    });
    navigation.navigate('MyBookings');
  };

  const handleGoHome = () => {
    navigation.navigate('MainTabs', {
      screen: 'Home',
    });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name="check-circle" size={80} color={colors.success} />
          </View>
          
          <Title style={styles.title}>Booking Confirmed!</Title>
          
          <Paragraph style={styles.message}>
            Your booking has been successfully created. You will receive a confirmation email shortly.
          </Paragraph>
          
          <Paragraph style={styles.bookingId}>
            Booking ID: {bookingId}
          </Paragraph>
          
          <View style={styles.infoBox}>
            <Icon name="info" size={20} color={colors.primary} style={styles.infoIcon} />
            <Paragraph style={styles.infoText}>
              Payment is set to "Pay Later". You can manage your booking and download receipts from your profile.
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={handleViewBookings}
          style={styles.button}
          icon="book"
        >
          View My Bookings
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleGoHome}
          style={styles.button}
          icon="home"
        >
          Back to Home
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
    marginBottom: 32,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: colors.success,
  },
  message: {
    textAlign: 'center',
    marginBottom: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bookingId: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 24,
    color: colors.primary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttons: {
    gap: 12,
  },
  button: {
    borderRadius: 8,
  },
});

export default BookingSuccessScreen;