import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  Card,
  Title,
  Paragraph,
  Chip,
} from 'react-native-paper';
import FastImage from '@d11/react-native-fast-image';
import { api, API_BASE_URL } from '../api/axios';
import { Booking, ApiResponse } from '../types';
import { colors } from '../theme/theme';
import { getImageUri } from '../utils/helpers';
import Toast from 'react-native-toast-message';

const MyBookingsScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      const { data }: { data: ApiResponse<Booking[]> } = await api.get('/api/bookings/me');
      setBookings(data.data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to load bookings',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadBookings(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => {
    const pkg = item.packageRef;
    const isPackageObject = typeof pkg === 'object' && pkg !== null;
    const imageUri = isPackageObject && pkg.images?.[0] ? getImageUri(pkg.images[0], API_BASE_URL) : null;

    return (
      <Card style={styles.bookingCard}>
        <Card.Content>
          <View style={styles.bookingHeader}>
            <View style={styles.bookingInfo}>
              <Title style={styles.packageTitle} numberOfLines={2}>
                {isPackageObject ? pkg.title : 'Package'}
              </Title>
              <Chip
                mode="flat"
                textStyle={{ color: getStatusColor(item.status) }}
                style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
              >
                {item.status.toUpperCase()}
              </Chip>
            </View>
            {imageUri && (
              <FastImage
                source={{ uri: imageUri }}
                style={styles.packageImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
          </View>

          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Travel Date:</Text>
              <Text style={styles.detailValue}>
                {new Date(item.date).toDateString()}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Travelers:</Text>
              <Text style={styles.detailValue}>{item.travelers}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pickup:</Text>
              <Text style={styles.detailValue}>{item.pickupCity}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{item.phone}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total:</Text>
              <Text style={[styles.detailValue, styles.totalPrice]}>
                LKR {item.totalPrice.toLocaleString()}
              </Text>
            </View>
          </View>

          <Paragraph style={styles.bookingDate}>
            Booked on {new Date(item.createdAt).toLocaleDateString()}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No bookings yet.</Text>
        <Paragraph style={styles.emptySubtext}>
          Start exploring packages to make your first booking!
        </Paragraph>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  bookingCard: {
    marginBottom: 16,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bookingInfo: {
    flex: 1,
    marginRight: 12,
  },
  packageTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  packageImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  detailValue: {
    fontWeight: '500',
    fontSize: 14,
  },
  totalPrice: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  bookingDate: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.textSecondary,
  },
  emptySubtext: {
    textAlign: 'center',
    color: colors.textSecondary,
  },
});

export default MyBookingsScreen;