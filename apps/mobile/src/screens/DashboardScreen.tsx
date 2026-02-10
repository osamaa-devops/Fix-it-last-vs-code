import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/auth';
import { Button, colors } from '../components/UI';

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          await logout();
        },
        style: 'destructive',
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No user data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          {user.avatar && (
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.userTypeBadge}>
              <Text style={styles.userTypeBadgeText}>
                {user.userType === 'customer' ? 'Customer' : 'Handyman'}
              </Text>
            </View>
          </View>
        </View>

        {/* User Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.detailsCard}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>User ID</Text>
              <Text style={styles.detailValue}>{user.id}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email Address</Text>
              <Text style={styles.detailValue}>{user.email}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>{user.fullName}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Account Type</Text>
              <Text style={styles.detailValue}>
                {user.userType === 'customer' ? 'Customer' : 'Service Provider (Handyman)'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Member Since</Text>
              <Text style={styles.detailValue}>
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Type specific info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {user.userType === 'customer' ? 'Customer Dashboard' : 'Handyman Dashboard'}
          </Text>

          <View style={styles.infoCard}>
            {user.userType === 'customer' ? (
              <>
                <InfoItem label="Active Requests" value="0" />
                <InfoItem label="Completed Services" value="0" />
                <InfoItem label="Total Spent" value="$0.00" />
                <InfoItem label="Ratings" value="★★★★★" />
              </>
            ) : (
              <>
                <InfoItem label="Jobs Completed" value="0" />
                <InfoItem label="Current Jobs" value="0" />
                <InfoItem label="Total Earned" value="$0.00" />
                <InfoItem label="Rating" value="★★★★★" />
              </>
            )}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Edit Profile</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Change Password</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notification Settings</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Privacy & Security</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            loading={isLoading}
            disabled={isLoading}
            variant="danger"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Fix It Mobile v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <>
    <View style={styles.infoItemRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
    <View style={styles.divider} />
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.darkGray,
  },

  // User Card
  userCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: colors.lightGray,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  userTypeBadge: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  userTypeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 12,
  },

  // Details Card
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGray,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },

  // Settings
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
  },
  settingArrow: {
    fontSize: 20,
    color: colors.gray,
  },

  // Logout Section
  logoutSection: {
    marginVertical: 24,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: colors.gray,
  },
});

export default DashboardScreen;
