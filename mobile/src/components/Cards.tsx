import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import FastImage from '@d11/react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Location, Package } from '../types';
import { colors } from '../theme/theme';
import { getImageUri } from '../utils/helpers';
import { API_BASE_URL } from '../api/axios';

interface LocationCardProps {
  location: Location;
  onPress: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location, onPress }) => {
  const scaleValue = new Animated.Value(1);
  const imageUri = getImageUri(location.images?.[0] || '', API_BASE_URL);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
        <Card style={styles.card}>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <FastImage
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={[styles.image, styles.placeholderImage]}>
                <Icon name="place" size={40} color={colors.textSecondary} />
              </View>
            )}
            <View style={styles.overlay}>
              <Chip mode="flat" style={styles.regionChip} textStyle={styles.chipText}>
                <Icon name="location-on" size={14} color="#fff" />
                {' ' + location.region}
              </Chip>
            </View>
          </View>
          <Card.Content style={styles.content}>
            <Title style={styles.title} numberOfLines={2}>
              {location.name}
            </Title>
            <Paragraph style={styles.description} numberOfLines={3}>
              {location.description}
            </Paragraph>
            <View style={styles.footer}>
              <Icon name="explore" size={16} color={colors.primary} />
              <Paragraph style={styles.exploreText}>Explore Location</Paragraph>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
};

interface PackageCardProps {
  package: Package;
  onPress: () => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ package: pkg, onPress }) => {
  const scaleValue = new Animated.Value(1);
  const imageUri = getImageUri(pkg.images?.[0] || '', API_BASE_URL);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
        <Card style={styles.card}>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <FastImage
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={[styles.image, styles.placeholderImage]}>
                <Icon name="card-travel" size={40} color={colors.textSecondary} />
              </View>
            )}
            <View style={styles.overlay}>
              <View style={styles.priceTag}>
                <Title style={styles.priceText}>LKR {pkg.price.toLocaleString()}</Title>
              </View>
            </View>
          </View>
          <Card.Content style={styles.content}>
            <Title style={styles.title} numberOfLines={2}>
              {pkg.title}
            </Title>
            <View style={styles.chips}>
              <Chip mode="outlined" style={styles.chip} textStyle={styles.chipTextSmall}>
                <Icon name="category" size={12} />
                {' ' + pkg.category}
              </Chip>
              <Chip mode="outlined" style={styles.chip} textStyle={styles.chipTextSmall}>
                <Icon name="schedule" size={12} />
                {' ' + pkg.duration} days
              </Chip>
            </View>
            <Paragraph style={styles.description} numberOfLines={3}>
              {pkg.description}
            </Paragraph>
            <View style={styles.footer}>
              <Icon name="flight-takeoff" size={16} color={colors.primary} />
              <Paragraph style={styles.exploreText}>Book Now</Paragraph>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    height: 200,
    width: '100%',
  },
  placeholderImage: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  regionChip: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
  },
  priceTag: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  chip: {
    height: 28,
    borderColor: colors.border,
  },
  chipTextSmall: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  exploreText: {
    marginLeft: 8,
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
});