import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useHandymen } from '@/hooks/useCustomer';
import { LoadingSpinner, ErrorMessage, EmptyState, RatingStar, Button } from '@/components/UI';
import { Handyman } from '@/types/customer';

interface HandymenScreenProps {
  navigation: any;
  route: any;
}

export const HandymenScreen: React.FC<HandymenScreenProps> = ({ navigation, route }) => {
  const [page, setPage] = useState(1);
  const category = route.params?.category || '';
  const limit = 10;

  const { data, isLoading, error } = useHandymen(page, limit, category);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }

  const handymen = data?.data || [];
  const pagination = data?.pagination;

  if (!handymen.length) {
    return <EmptyState icon="👷" title="No Handymen Found" />;
  }

  const renderHandyman = ({ item }: { item: Handyman }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HandymanProfile', { id: item.id })}
    >
      <View style={styles.cardContent}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />

        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{item.fullName}</Text>
            {item.verified && <Text style={styles.badge}>✓ Verified</Text>}
          </View>

          <RatingStar rating={item.rating} reviews={item.reviews} />

          <Text style={styles.rate}>${item.hourlyRate}/hour</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{item.completedJobs}</Text>
              <Text style={styles.statLabel}>jobs</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{item.responseTime}h</Text>
              <Text style={styles.statLabel}>response</Text>
            </View>
          </View>

          <View style={styles.skills}>
            {item.skills.slice(0, 2).map((skill, i) => (
              <View key={i} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Available Handymen</Text>
        {category && <Text style={styles.subtitle}>Category: {category}</Text>}
      </View>

      <FlatList
        data={handymen}
        keyExtractor={(item) => item.id}
        renderItem={renderHandyman}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {pagination && pagination.pages > 1 && (
        <View style={styles.pagination}>
          <Button
            onPress={() => setPage(Math.max(1, page - 1))}
            label="← Previous"
            variant={page === 1 ? 'outline' : 'primary'}
            disabled={page === 1}
          />
          <Text style={styles.pageInfo}>
            Page {page} of {pagination.pages}
          </Text>
          <Button
            onPress={() => setPage(Math.min(pagination.pages, page + 1))}
            label="Next →"
            variant={page === pagination.pages ? 'outline' : 'primary'}
            disabled={page === pagination.pages}
          />
        </View>
      )}
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
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  badge: {
    fontSize: 11,
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },
  rate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
    marginTop: 4,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  skills: {
    flexDirection: 'row',
    gap: 4,
  },
  skillTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  skillText: {
    fontSize: 11,
    color: '#4b5563',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  pageInfo: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
    textAlign: 'center',
  },
});
