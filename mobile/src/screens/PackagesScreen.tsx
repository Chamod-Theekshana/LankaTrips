import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Modal,
  Animated,
} from 'react-native';
import {
  Searchbar,
  Text,
  ActivityIndicator,
  Button,
  TextInput,
  Card,
  Title,
  IconButton,
  FAB,
  Chip,
} from 'react-native-paper';
import { PackageCard } from '../components/Cards';
import { api } from '../api/axios';
import { Package, ApiResponse } from '../types';
import { colors } from '../theme/theme';
import Toast from 'react-native-toast-message';

interface PackagesScreenProps {
  navigation: any;
}

interface Filters {
  q: string;
  category: string;
  region: string;
  priceMin: string;
  priceMax: string;
  durationMin: string;
  durationMax: string;
}

const PackagesScreen: React.FC<PackagesScreenProps> = ({ navigation }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(300);

  const [filters, setFilters] = useState<Filters>({
    q: '',
    category: '',
    region: '',
    priceMin: '',
    priceMax: '',
    durationMin: '',
    durationMax: '',
  });

  const loadPackages = async (pageNum = 1, currentFilters = filters, refresh = false) => {
    try {
      if (pageNum === 1) {
        refresh ? setRefreshing(true) : setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const { data }: { data: ApiResponse<Package[]> } = await api.get('/api/packages', {
        params: {
          page: pageNum,
          limit: 10,
          ...currentFilters,
        },
      });

      if (pageNum === 1) {
        setPackages(data.data);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        setPackages(prev => [...prev, ...data.data]);
      }

      setHasMore(data.meta?.totalPages ? pageNum < data.meta.totalPages : false);
      setPage(pageNum);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to load packages',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    const count = Object.values(filters).filter(value => value !== '').length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleSearch = () => {
    setPage(1);
    loadPackages(1, filters);
  };

  const handleRefresh = () => {
    setPage(1);
    loadPackages(1, filters, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      loadPackages(page + 1, filters);
    }
  };

  const openFilters = () => {
    setShowFilters(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFilters = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowFilters(false));
  };

  const applyFilters = () => {
    closeFilters();
    setPage(1);
    loadPackages(1, filters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      q: '',
      category: '',
      region: '',
      priceMin: '',
      priceMax: '',
      durationMin: '',
      durationMax: '',
    };
    setFilters(clearedFilters);
    setPage(1);
    loadPackages(1, clearedFilters);
    closeFilters();
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderPackage = ({ item, index }: { item: Package; index: number }) => (
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
      <PackageCard
        package={item}
        onPress={() => navigation.navigate('PackageDetail', { packageId: item._id })}
      />
    </Animated.View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Loading more packages...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          No packages found
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
        <Text style={styles.loadingText}>Finding perfect packages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <Searchbar
            placeholder="Search packages..."
            onChangeText={(text) => updateFilter('q', text)}
            value={filters.q}
            onSubmitEditing={handleSearch}
            style={styles.searchbar}
            iconColor={colors.primary}
          />
          <IconButton
            icon="filter-variant"
            size={24}
            onPress={openFilters}
            style={[styles.filterButton, activeFiltersCount > 0 && styles.activeFilterButton]}
            iconColor={activeFiltersCount > 0 ? '#fff' : colors.primary}
          />
        </View>
        {activeFiltersCount > 0 && (
          <View style={styles.activeFiltersContainer}>
            <Chip
              mode="flat"
              style={styles.activeFiltersChip}
              textStyle={styles.activeFiltersText}
            >
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
            </Chip>
          </View>
        )}
      </View>

      <FlatList
        data={packages}
        renderItem={renderPackage}
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

      <Modal
        visible={showFilters}
        animationType="fade"
        transparent
        onRequestClose={closeFilters}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modal,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Title>Filters</Title>
              <IconButton
                icon="close"
                onPress={closeFilters}
              />
            </View>

            <Card style={styles.filterCard}>
              <Card.Content>
                <TextInput
                  label="Category"
                  value={filters.category}
                  onChangeText={(text) => updateFilter('category', text)}
                  style={styles.filterInput}
                  mode="outlined"
                />
                <TextInput
                  label="Region"
                  value={filters.region}
                  onChangeText={(text) => updateFilter('region', text)}
                  style={styles.filterInput}
                  mode="outlined"
                />
                <View style={styles.row}>
                  <TextInput
                    label="Min Price (LKR)"
                    value={filters.priceMin}
                    onChangeText={(text) => updateFilter('priceMin', text)}
                    keyboardType="numeric"
                    style={[styles.filterInput, styles.halfWidth]}
                    mode="outlined"
                  />
                  <TextInput
                    label="Max Price (LKR)"
                    value={filters.priceMax}
                    onChangeText={(text) => updateFilter('priceMax', text)}
                    keyboardType="numeric"
                    style={[styles.filterInput, styles.halfWidth]}
                    mode="outlined"
                  />
                </View>
                <View style={styles.row}>
                  <TextInput
                    label="Min Duration (days)"
                    value={filters.durationMin}
                    onChangeText={(text) => updateFilter('durationMin', text)}
                    keyboardType="numeric"
                    style={[styles.filterInput, styles.halfWidth]}
                    mode="outlined"
                  />
                  <TextInput
                    label="Max Duration (days)"
                    value={filters.durationMax}
                    onChangeText={(text) => updateFilter('durationMax', text)}
                    keyboardType="numeric"
                    style={[styles.filterInput, styles.halfWidth]}
                    mode="outlined"
                  />
                </View>
              </Card.Content>
            </Card>

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={clearFilters}
                style={styles.modalButton}
              >
                Clear All
              </Button>
              <Button
                mode="contained"
                onPress={applyFilters}
                style={styles.modalButton}
              >
                Apply Filters
              </Button>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    elevation: 0,
    backgroundColor: colors.background,
  },
  filterButton: {
    marginLeft: 8,
    backgroundColor: colors.background,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  activeFiltersContainer: {
    marginTop: 8,
  },
  activeFiltersChip: {
    backgroundColor: colors.primary + '20',
    alignSelf: 'flex-start',
  },
  activeFiltersText: {
    color: colors.primary,
    fontSize: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 2,
  },
  filterCard: {
    margin: 16,
    elevation: 2,
  },
  filterInput: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default PackagesScreen;