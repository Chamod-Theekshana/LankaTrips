import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Title,
  Paragraph,
  TextInput,
  Button,
  Card,
  ActivityIndicator,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../api/axios';
import { Package, ApiResponse } from '../types';
import { colors } from '../theme/theme';
import Toast from 'react-native-toast-message';

const schema = z.object({
  date: z.date().min(new Date(), 'Travel date must be in the future'),
  travelers: z.number().min(1, 'At least 1 traveler required').max(50, 'Maximum 50 travelers'),
  pickupCity: z.string().min(2, 'Pickup city is required'),
  phone: z.string().min(5, 'Valid phone number is required'),
});

type FormData = z.infer<typeof schema>;

interface BookingCheckoutScreenProps {
  route: {
    params: {
      packageId: string;
    };
  };
  navigation: any;
}

const BookingCheckoutScreen: React.FC<BookingCheckoutScreenProps> = ({
  route,
  navigation,
}) => {
  const { packageId } = route.params;
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      travelers: 2,
      pickupCity: '',
      phone: '',
    },
  });

  const watchedValues = watch();
  const totalPrice = pkg ? pkg.price * watchedValues.travelers : 0;

  useEffect(() => {
    loadPackage();
  }, [packageId]);

  const loadPackage = async () => {
    try {
      setLoading(true);
      const { data }: { data: ApiResponse<Package> } = await api.get(
        `/api/packages/${packageId}`
      );
      setPkg(data.data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to load package',
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      const payload = {
        packageId,
        date: data.date.toISOString().split('T')[0],
        travelers: data.travelers,
        pickupCity: data.pickupCity,
        phone: data.phone,
      };

      const response = await api.post('/api/bookings', payload);
      
      Toast.show({
        type: 'success',
        text1: 'Booking Confirmed!',
        text2: 'Your booking has been successfully created',
      });

      navigation.navigate('BookingSuccess', {
        bookingId: response.data.data.bookingId,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Booking Failed',
        text2: error.response?.data?.message || 'Failed to create booking',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!pkg) {
    return (
      <View style={styles.error}>
        <Paragraph>Package not found</Paragraph>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <Card style={styles.packageCard}>
          <Card.Content>
            <Title style={styles.packageTitle}>{pkg.title}</Title>
            <Paragraph style={styles.packagePrice}>
              LKR {pkg.price.toLocaleString()} per person
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.formTitle}>Booking Details</Title>

            <View style={styles.inputContainer}>
              <Paragraph style={styles.label}>Travel Date</Paragraph>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                {watchedValues.date.toDateString()}
              </Button>
              {errors.date && (
                <Paragraph style={styles.errorText}>
                  {errors.date.message}
                </Paragraph>
              )}
            </View>

            <Controller
              control={control}
              name="travelers"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Number of Travelers"
                  value={value.toString()}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  keyboardType="numeric"
                  error={!!errors.travelers}
                  style={styles.input}
                />
              )}
            />
            {errors.travelers && (
              <Paragraph style={styles.errorText}>
                {errors.travelers.message}
              </Paragraph>
            )}

            <Controller
              control={control}
              name="pickupCity"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Pickup City"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Colombo / Kandy / Galle..."
                  error={!!errors.pickupCity}
                  style={styles.input}
                />
              )}
            />
            {errors.pickupCity && (
              <Paragraph style={styles.errorText}>
                {errors.pickupCity.message}
              </Paragraph>
            )}

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Phone Number"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="+94..."
                  keyboardType="phone-pad"
                  error={!!errors.phone}
                  style={styles.input}
                />
              )}
            />
            {errors.phone && (
              <Paragraph style={styles.errorText}>
                {errors.phone.message}
              </Paragraph>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Booking Summary</Title>
            <View style={styles.summaryRow}>
              <Paragraph>Package Price:</Paragraph>
              <Paragraph>LKR {pkg.price.toLocaleString()}</Paragraph>
            </View>
            <View style={styles.summaryRow}>
              <Paragraph>Travelers:</Paragraph>
              <Paragraph>{watchedValues.travelers}</Paragraph>
            </View>
            <View style={styles.summaryRow}>
              <Paragraph>Payment Method:</Paragraph>
              <Paragraph>Pay Later</Paragraph>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Title>Total Amount:</Title>
              <Title style={styles.totalAmount}>
                LKR {totalPrice.toLocaleString()}
              </Title>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={submitting}
          disabled={submitting}
          style={styles.confirmButton}
          contentStyle={styles.confirmButtonContent}
        >
          {submitting ? 'Processing...' : 'Confirm Booking'}
        </Button>
      </View>

      <DatePicker
        modal
        open={showDatePicker}
        date={watchedValues.date}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(date) => {
          setShowDatePicker(false);
          setValue('date', date);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageCard: {
    margin: 16,
    elevation: 2,
  },
  packageTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  packagePrice: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  formCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  dateButton: {
    justifyContent: 'flex-start',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 100,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalAmount: {
    color: colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: 16,
    elevation: 8,
  },
  confirmButton: {
    borderRadius: 8,
  },
  confirmButtonContent: {
    paddingVertical: 8,
  },
});

export default BookingCheckoutScreen;