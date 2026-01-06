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
} from 'react-native-paper';
import FastImage from '@d11/react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { api, API_BASE_URL } from '../api/axios';
import { Location, ApiResponse } from '../types';
import { colors } from '../theme/theme';
import { getImageUri } from '../utils/helpers';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

interface LocationDetailScreenProps {
  route: {
    params: {
      locationId: string;
    };
  };
}

const LocationDetailScreen: React.FC<LocationDetailScreenProps> = ({ route }) => {
  const { locationId } = route.params;
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadLocation();
  }, [locationId]);

  const loadLocation = async () => {
    try {
      setLoading(true);
      const { data }: { data: ApiResponse<Location> } = await api.get(
        `/api/locations/${locationId}`
      );
      setLocation(data.data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to load location',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.error}>
        <Paragraph>Location not found</Paragraph>
      </View>
    );
  }

  const images = location.images?.map(img => getImageUri(img, API_BASE_URL)).filter(Boolean) || [];

  return (
    <ScrollView style={styles.container}>
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
          <Title style={styles.title}>{location.name}</Title>
          <Chip mode="outlined" style={styles.regionChip}>
            <Icon name="location-on" size={16} color={colors.primary} />
            {' ' + location.region}
          </Chip>
        </View>

        <Card style={styles.descriptionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>About</Title>
            <Paragraph style={styles.description}>
              {location.description}
            </Paragraph>
          </Card.Content>
        </Card>

        {location.highlights && location.highlights.length > 0 && (
          <Card style={styles.highlightsCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Highlights</Title>
              {location.highlights.map((highlight, index) => (
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
      </View>
    </ScrollView>
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
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  regionChip: {
    alignSelf: 'flex-start',
  },
  descriptionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  highlightsCard: {
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
});

export default LocationDetailScreen;