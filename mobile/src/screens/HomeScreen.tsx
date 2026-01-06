import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  Title,
  Paragraph,
  Button,
  Card,
  Surface,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Browse Packages',
      subtitle: 'Discover amazing travel packages',
      icon: 'card-travel',
      color: '#FF6B6B',
      onPress: () => navigation.navigate('Packages'),
    },
    {
      title: 'Explore Locations',
      subtitle: 'Find beautiful destinations',
      icon: 'place',
      color: '#4ECDC4',
      onPress: () => navigation.navigate('Locations'),
    },
    {
      title: 'My Bookings',
      subtitle: 'View your travel bookings',
      icon: 'book',
      color: '#45B7D1',
      onPress: () => navigation.navigate('MyBookings'),
    },
    {
      title: 'My Receipts',
      subtitle: 'Download receipts and invoices',
      icon: 'receipt',
      color: '#96CEB4',
      onPress: () => navigation.navigate('MyReceipts'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[colors.primary, '#334155', colors.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Icon name="waving-hand" size={32} color="#FFD700" />
          <Title style={styles.welcomeTitle}>
            Welcome back, {user?.name}!
          </Title>
          <Paragraph style={styles.welcomeSubtitle}>
            Explore the pearl of the Indian Ocean
          </Paragraph>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Card style={styles.heroCard}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Card.Content style={styles.heroContent}>
              <Icon name="explore" size={48} color="#fff" style={styles.heroIcon} />
              <Title style={styles.heroTitle}>
                Discover Sri Lanka
              </Title>
              <Paragraph style={styles.heroDescription}>
                From ancient temples to pristine beaches, create unforgettable memories
              </Paragraph>
              <View style={styles.heroButtons}>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Packages')}
                  style={[styles.heroButton, styles.primaryButton]}
                  labelStyle={styles.buttonLabel}
                >
                  Browse Packages
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Locations')}
                  style={[styles.heroButton, styles.secondaryButton]}
                  labelStyle={styles.outlineButtonLabel}
                >
                  Explore Places
                </Button>
              </View>
            </Card.Content>
          </LinearGradient>
        </Card>

        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <Paragraph style={styles.sectionSubtitle}>
            Everything you need at your fingertips
          </Paragraph>
        </View>
        
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <Card key={index} style={styles.actionCard} onPress={action.onPress}>
              <Card.Content style={styles.actionContent}>
                <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
                  <Icon
                    name={action.icon}
                    size={28}
                    color="#fff"
                  />
                </View>
                <Title style={styles.actionTitle}>{action.title}</Title>
                <Paragraph style={styles.actionSubtitle}>
                  {action.subtitle}
                </Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.statsTitle}>Your Journey</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="flight-takeoff" size={24} color={colors.primary} />
                <Title style={styles.statNumber}>0</Title>
                <Paragraph style={styles.statLabel}>Trips Booked</Paragraph>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="favorite" size={24} color={colors.error} />
                <Title style={styles.statNumber}>0</Title>
                <Paragraph style={styles.statLabel}>Favorites</Paragraph>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="star" size={24} color={colors.warning} />
                <Title style={styles.statNumber}>5.0</Title>
                <Paragraph style={styles.statLabel}>Rating</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  heroCard: {
    marginBottom: 32,
    elevation: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 0,
  },
  heroContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  heroIcon: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  heroButton: {
    flex: 1,
    borderRadius: 25,
  },
  primaryButton: {
    backgroundColor: '#fff',
  },
  secondaryButton: {
    borderColor: '#fff',
    borderWidth: 2,
  },
  buttonLabel: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  outlineButtonLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    width: (width - 52) / 2,
    elevation: 3,
    borderRadius: 12,
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsCard: {
    elevation: 3,
    borderRadius: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
});

export default HomeScreen;