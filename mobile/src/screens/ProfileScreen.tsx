import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Title,
  Paragraph,
  Button,
  Card,
  Avatar,
  List,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: 'My Bookings',
      description: 'View and manage your bookings',
      icon: 'book',
      onPress: () => navigation.navigate('MyBookings'),
    },
    {
      title: 'My Receipts',
      description: 'Download receipts and invoices',
      icon: 'receipt',
      onPress: () => navigation.navigate('MyReceipts'),
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={user?.name?.charAt(0).toUpperCase() || 'U'}
            style={styles.avatar}
          />
          <Title style={styles.name}>{user?.name}</Title>
          <Paragraph style={styles.email}>{user?.email}</Paragraph>
          <Paragraph style={styles.role}>
            {user?.role === 'customer' ? 'Customer' : 'Admin'}
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.menuCard}>
        <Card.Content>
          <Title style={styles.menuTitle}>Account</Title>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <List.Item
                title={item.title}
                description={item.description}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={({ size, color }) => (
                      <Icon name={item.icon} size={size} color={color} />
                    )}
                  />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={item.onPress}
                style={styles.menuItem}
              />
              {index < menuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.menuCard}>
        <Card.Content>
          <Title style={styles.menuTitle}>App Info</Title>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => (
              <List.Icon
                {...props}
                icon={({ size, color }) => (
                  <Icon name="info" size={size} color={color} />
                )}
              />
            )}
            style={styles.menuItem}
          />
          <Divider />
          <List.Item
            title="About LankaTrips"
            description="Discover the beauty of Sri Lanka"
            left={(props) => (
              <List.Icon
                {...props}
                icon={({ size, color }) => (
                  <Icon name="help" size={size} color={color} />
                )}
              />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            style={styles.menuItem}
          />
        </Card.Content>
      </Card>

      <View style={styles.logoutContainer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={colors.error}
          icon="logout"
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileCard: {
    margin: 16,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  role: {
    color: colors.primary,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  menuTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  menuItem: {
    paddingVertical: 8,
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    borderColor: colors.error,
  },
});

export default ProfileScreen;