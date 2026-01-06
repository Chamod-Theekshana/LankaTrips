import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Animated,
} from 'react-native';
import {
  Searchbar,
  Text,
  ActivityIndicator,
  FAB,
  Chip,
} from 'react-native-paper';
import { LocationCard } from '../components/Cards';
import { api } from '../api/axios';
import { Location, ApiResponse } from '../types';
import { colors } from '../theme/theme';
import Toast from 'react-native-toast-message';

interface LocationsScreenProps {
  navigation: any;
}

const LocationsScreen: React.FC<LocationsScreenProps> = ({ navigation }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [regions] = useState(['All', 'Western', 'Southern', 'Central', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa']);
  
  const fadeAnim = new Animated.Value(0);

  const loadLocations = async (pageNum = 1, query = '', region = '', refresh = false) => {
    try {
      if (pageNum === 1) {
        refresh ? setRefreshing(true) : setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params: any = {
        page: pageNum,
        q: query,
        limit: 10,
      };
      
      if (region && region !== 'All') {
        params.region = region;
      }

      const { data }: { data: ApiResponse<Location[]> } = await api.get('/api/locations', { params });

      if (pageNum === 1) {
        setLocations(data.data);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        setLocations(prev => [...prev, ...data.data]);
      }

      setHasMore(data.meta?.totalPages ? pageNum < data.meta.totalPages : false);
      setPage(pageNum);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to load locations',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleSearch = () => {
    setPage(1);
    loadLocations(1, searchQuery, selectedRegion);
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setPage(1);
    loadLocations(1, searchQuery, region);
  };

  const handleRefresh = () => {
    setPage(1);
    loadLocations(1, searchQuery, selectedRegion, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      loadLocations(page + 1, searchQuery, selectedRegion);
    }
  };

  const renderLocation = ({ item, index }: { item: Location; index: number }) => (
    <Animated.View
      style={[
        { opacity: fadeAnim },
        {
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        },
      ]}
    >
      <LocationCard
        location={item}
        onPress={() => navigation.navigate('LocationDetail', { locationId: item._id })}
      />
    </Animated.View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Loading more locations...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          {searchQuery || selectedRegion !== 'All' 
            ? 'No locations found for your search' 
            : 'No locations available'}
        </Text>
        <Text style={styles.emptySubtext}>
          Try adjusting your search or filters
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Discovering amazing places...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search locations..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchbar}
          iconColor={colors.primary}
        />
        
        <FlatList
          horizontal
          data={regions}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.regionsContainer}
          renderItem={({ item }) => (
            <Chip
              mode={selectedRegion === item || (selectedRegion === '' && item === 'All') ? 'flat' : 'outlined'}
              onPress={() => handleRegionSelect(item)}
              style={[
                styles.regionChip,
                (selectedRegion === item || (selectedRegion === '' && item === 'All')) && styles.selectedChip
              ]}
              textStyle={[
                styles.chipText,
                (selectedRegion === item || (selectedRegion === '' && item === 'All')) && styles.selectedChipText
              ]}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      <FlatList
        data={locations}
        renderItem={renderLocation}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={handleRefresh}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: colors.background,
    marginBottom: 12,
  },
  regionsContainer: {
    paddingVertical: 4,
  },
  regionChip: {
    marginRight: 8,
    borderColor: colors.border,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
  },
  selectedChipText: {
    color: '#fff',
  },
  list: {
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
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
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default LocationsScreen;