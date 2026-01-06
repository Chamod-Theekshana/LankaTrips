import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
} from 'react-native-paper';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import Share from 'react-native-share';
import { api } from '../api/axios';
import { Receipt, ApiResponse } from '../types';
import { colors } from '../theme/theme';
import Toast from 'react-native-toast-message';

const MyReceiptsScreen: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      const { data }: { data: ApiResponse<Receipt[]> } = await api.get('/api/receipts/me');
      setReceipts(data.data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to load receipts',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadReceipts(true);
  };

  const downloadPdf = async (receiptId: string, receiptNo: string) => {
    try {
      setDownloadingIds(prev => new Set(prev).add(receiptId));
      
      const response = await api.get(`/api/receipts/${receiptId}/pdf`, {
        responseType: 'blob',
      });

      const fileName = `receipt-${receiptNo}.pdf`;
      const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        try {
          await RNFS.writeFile(downloadPath, base64Data, 'base64');
          
          Alert.alert(
            'Download Complete',
            `Receipt saved to Downloads folder as ${fileName}`,
            [
              {
                text: 'Open',
                onPress: () => FileViewer.open(downloadPath),
              },
              {
                text: 'Share',
                onPress: () => Share.open({ url: `file://${downloadPath}` }),
              },
              { text: 'OK' },
            ]
          );
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Download Failed',
            text2: 'Failed to save PDF file',
          });
        }
      };
      
      reader.readAsDataURL(response.data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Download Failed',
        text2: error.response?.data?.message || 'Failed to download receipt',
      });
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(receiptId);
        return newSet;
      });
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'failed':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderReceipt = ({ item }: { item: Receipt }) => {
    const booking = item.bookingRef;
    const isBookingObject = typeof booking === 'object' && booking !== null;
    const packageTitle = isBookingObject && typeof booking.packageRef === 'object' && booking.packageRef !== null 
      ? booking.packageRef.title 
      : undefined;
    const isDownloading = downloadingIds.has(item._id);

    return (
      <Card style={styles.receiptCard}>
        <Card.Content>
          <View style={styles.receiptHeader}>
            <View style={styles.receiptInfo}>
              <Title style={styles.receiptTitle}>Receipt {item.receiptNo}</Title>
              <Paragraph style={styles.packageTitle}>
                {packageTitle || 'Package Booking'}
              </Paragraph>
            </View>
            <View style={styles.amountContainer}>
              <Title style={styles.amount}>
                {item.currency} {item.amount.toFixed(2)}
              </Title>
              <Chip
                mode="flat"
                textStyle={{ color: getPaymentStatusColor(item.paymentStatus) }}
                style={[
                  styles.statusChip,
                  { backgroundColor: getPaymentStatusColor(item.paymentStatus) + '20' }
                ]}
              >
                {item.paymentStatus.toUpperCase()}
              </Chip>
            </View>
          </View>

          <View style={styles.receiptDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method:</Text>
              <Text style={styles.detailValue}>{item.paymentMethod}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Issued:</Text>
              <Text style={styles.detailValue}>
                {new Date(item.issuedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={() => downloadPdf(item._id, item.receiptNo)}
            loading={isDownloading}
            disabled={isDownloading}
            style={styles.downloadButton}
            icon="download"
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No receipts yet.</Text>
        <Paragraph style={styles.emptySubtext}>
          Receipts will appear here after you make bookings.
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
        data={receipts}
        renderItem={renderReceipt}
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
  receiptCard: {
    marginBottom: 16,
    elevation: 2,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  receiptInfo: {
    flex: 1,
    marginRight: 12,
  },
  receiptTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  packageTitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statusChip: {
    height: 24,
  },
  receiptDetails: {
    marginBottom: 16,
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
  downloadButton: {
    borderRadius: 8,
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

export default MyReceiptsScreen;