import React from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useHandymanProfile } from '@/hooks/useCustomer';
import { LoadingSpinner, ErrorMessage, Button, RatingStar, Card } from '@/components/UI';

interface HandymanProfileScreenProps {
  navigation: any;
  route: any;
}

export const HandymanProfileScreen: React.FC<HandymanProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const id = route.params?.id;
  const { data: handyman, isLoading, error } = useHandymanProfile(id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !handyman) {
    return <ErrorMessage message={(error as Error)?.message || 'Handyman not found'} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <Image source={{ uri: handyman.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{handyman.fullName}</Text>
              {handyman.verified && <Text style={styles.verifiedBadge}>✓ Verified</Text>}
            </View>

            <View style={styles.ratingContainer}>
              <RatingStar rating={handyman.rating} reviews={handyman.reviews} />
            </View>

            <View style={styles.statGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>${handyman.hourlyRate}</Text>
                <Text style={styles.statLabel}>per hour</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{handyman.completedJobs}</Text>
                <Text style={styles.statLabel}>jobs completed</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{handyman.responseTime}h</Text>
                <Text style={styles.statLabel}>avg response</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* About Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionContent}>{handyman.about}</Text>
        </Card>

        {/* Skills Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Expertise</Text>
          <View style={styles.skillsGrid}>
            {handyman.skills.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillBadgeText}>{skill}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Info Cards */}
        <View style={styles.infoCardsRow}>
          <Card style={styles.infoCard}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <Text style={styles.infoTitle}>Response Time</Text>
            <Text style={styles.infoValue}>{handyman.responseTime} hours</Text>
          </Card>

          <Card style={styles.infoCard}>
            <Text style={styles.infoIcon}>✅</Text>
            <Text style={styles.infoTitle}>Verified</Text>
            <Text style={styles.infoValue}>
              {handyman.verified ? 'Yes' : 'No'}
            </Text>
          </Card>
        </View>

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <Button
            onPress={() => navigation.navigate('CreateRequest', { handymanId: id })}
            label="Request Service"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileInfo: {
    width: '100%',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  verifiedBadge: {
    fontSize: 12,
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '600',
  },
  ratingContainer: {
    marginVertical: 8,
  },
  statGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  ctaContainer: {
    marginBottom: 20,
  },
});
