import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Title,
  Paragraph,
  Chip,
  ActivityIndicator,
  Card,
  Button,
} from 'react-native-paper';
import FastImage from '@d11/react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { api, API_BASE_URL } from '../api/axios';
import { Package, ApiResponse } from '../types';
import { colors } from '../theme/theme';
import { getImageUri } from '../utils/helpers';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

interface PackageDetailScreenProps {
  route: {
    params: {
      packageId: string;
    };
  };
  navigation: any;
}

const PackageDetailScreen: React.FC<PackageDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { packageId } = route.params;
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigation.navigate('BookingCheckout', { packageId });
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

  const images = pkg.images?.map(img => getImageUri(img, API_BASE_URL)).filter(Boolean) || [];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {images.length > 0 && (
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width
                );
                setCurrentImageIndex(index);
              }}
            >
              {images.map((image, index) => (
                <FastImage
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ))}
            </ScrollView>
            {images.length > 1 && (
              <View style={styles.pagination}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <Title style={styles.title}>{pkg.title}</Title>
            <View style={styles.chips}>
              <Chip mode="outlined" style={styles.chip}>
                <Icon name="category" size={14} />
                {' ' + pkg.category}
              </Chip>
              <Chip mode="outlined" style={styles.chip}>
                <Icon name="schedule" size={14} />
                {' ' + pkg.duration} days
              </Chip>
              <Chip mode="outlined" style={styles.chip}>
                <Icon name="location-on" size={14} />
                {' ' + pkg.region}
              </Chip>
            </View>
          </View>

          <Card style={styles.priceCard}>
            <Card.Content>
              <View style={styles.priceRow}>
                <View>
                  <Paragraph style={styles.priceLabel}>Starting from</Paragraph>
                  <Title style={styles.price}>
                    LKR {pkg.price.toLocaleString()}
                  </Title>
                  <Paragraph style={styles.priceNote}>per person</Paragraph>
                </View>
                <Icon name="attach-money" size={32} color={colors.success} />
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.descriptionCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>About This Package</Title>
              <Paragraph style={styles.description}>
                {pkg.description}
              </Paragraph>
            </Card.Content>
          </Card>

          {pkg.highlights && pkg.highlights.length > 0 && (
            <Card style={styles.highlightsCard}>
              <Card.Content>
                <Title style={styles.sectionTitle}>Highlights</Title>
                {pkg.highlights.map((highlight, index) => (
                  <View key={index} style={styles.highlightItem}>
                    <Icon
                      name="check-circle"
                      size={16}
                      color={colors.success}
                      style={styles.highlightIcon}
                    />
                    <Paragraph style={styles.highlightText}>
                      {highlight}
                    </Paragraph>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <Card style={styles.itineraryCard}>
              <Card.Content>
                <Title style={styles.sectionTitle}>Itinerary</Title>
                {pkg.itinerary.map((day, index) => (
                  <View key={index} style={styles.dayItem}>
                    <View style={styles.dayHeader}>
                      <Title style={styles.dayTitle}>Day {day.day}</Title>
                      <Title style={styles.daySubtitle}>{day.title}</Title>
                    </View>
                    <Paragraph style={styles.dayDescription}>
                      {day.description}
                    </Paragraph>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleBookNow}
          style={styles.bookButton}
          contentStyle={styles.bookButtonContent}
          icon="flight-takeoff"
        >
          Book Now
        </Button>
      </View>
    </View>
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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width,
    height: 250,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  priceCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: colors.success + '10',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.success,
  },
  priceNote: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  descriptionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  highlightsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  itineraryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  description: {
    lineHeight: 24,
    color: colors.textSecondary,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  highlightIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  highlightText: {
    flex: 1,
    color: colors.textSecondary,
  },
  dayItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayHeader: {
    marginBottom: 8,
  },
  dayTitle: {
    fontSize: 16,
    color: colors.primary,
  },
  daySubtitle: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  dayDescription: {
    color: colors.textSecondary,
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
  bookButton: {
    borderRadius: 8,
  },
  bookButtonContent: {
    paddingVertical: 8,
  },
});

export default PackageDetailScreen;