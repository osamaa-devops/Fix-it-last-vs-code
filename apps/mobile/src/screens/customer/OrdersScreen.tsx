import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useServiceRequests, useUpdateServiceRequest } from '@/hooks/useCustomer';
import { LoadingSpinner, ErrorMessage, Button, Card, EmptyState } from '@/components/UI';
import { ServiceRequest } from '@/types/customer';

interface OrdersScreenProps {
  navigation: any;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const limit = 5;

  const { data, isLoading, error, refetch } = useServiceRequests(page, limit);
  const { mutate: updateRequest } = useUpdateServiceRequest();

  const filteredRequests = statusFilter
    ? data?.data.filter((r) => r.status === statusFilter) || []
    : data?.data || [];

  const handleCancelRequest = (id: string) => {
    Alert.alert('Cancel Request', 'Are you sure you want to cancel this service request?', [
      { text: 'No', onPress: () => {} },
      {
        text: 'Yes',
        onPress: () => {
          updateRequest({ id, data: { status: 'cancelled' } });
        },
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#92400e' },
      accepted: { bg: '#dbeafe', text: '#1e40af' },
      'in-progress': { bg: '#e9d5ff', text: '#6b21a8' },
      completed: { bg: '#dcfce7', text: '#166534' },
      cancelled: { bg: '#fee2e2', text: '#991b1b' },
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: '⏳',
      accepted: '✓',
      'in-progress': '⚙️',
      completed: '✅',
      cancelled: '❌',
    };
    return icons[status as keyof typeof icons] || '📝';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={(error as Error).message} onRetry={() => refetch()} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Service Requests</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === '' && styles.filterButtonActive]}
          onPress={() => {
            setStatusFilter('');
            setPage(1);
          }}
        >
          <Text
            style={[styles.filterButtonText, statusFilter === '' && styles.filterButtonTextActive]}
          >
            All
          </Text>
        </TouchableOpacity>
        {['pending', 'accepted', 'in-progress', 'completed'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              statusFilter === status && styles.filterButtonActive,
            ]}
            onPress={() => {
              setStatusFilter(status);
              setPage(1);
            }}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === status && styles.filterButtonTextActive,
              ]}
            >
              {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState icon="📭" title="No Requests Found" />
        </View>
      ) : (
        <>
          <FlatList
            data={filteredRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const statusColor = getStatusColor(item.status);
              return (
                <Card
                  style={[
                    styles.requestCard,
                    { backgroundColor: statusColor.bg },
                  ]}
                >
                  <View style={styles.requestHeader}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Text style={{ fontSize: 14 }}>{getStatusIcon(item.status)}</Text>
                        <Text style={[styles.requestTitle, { color: statusColor.text }]}>
                          {item.title}
                        </Text>
                      </View>
                      <Text style={[styles.requestId, { color: statusColor.text, opacity: 0.7 }]}>
                        Request #{item.id.slice(0, 8)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: 'rgba(255,255,255,0.5)' },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '600',
                          color: statusColor.text,
                        }}
                      >
                        {item.status === 'in-progress' ? 'In Progress' : item.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.description, { color: statusColor.text, opacity: 0.8 }]}>
                    {item.description}
                  </Text>

                  <View style={styles.details}>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: statusColor.text, opacity: 0.7 }]}>
                        Category
                      </Text>
                      <Text
                        style={[
                          styles.detailValue,
                          { color: statusColor.text },
                        ]}
                      >
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: statusColor.text, opacity: 0.7 }]}>
                        Date
                      </Text>
                      <Text
                        style={[
                          styles.detailValue,
                          { color: statusColor.text },
                        ]}
                      >
                        {new Date(item.scheduledDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  {item.estimatedPrice && (
                    <Text
                      style={[
                        styles.priceText,
                        { color: statusColor.text },
                      ]}
                    >
                      Estimated: ${item.estimatedPrice}
                    </Text>
                  )}

                  {item.status === 'pending' && (
                    <View style={styles.actions}>
                      <Button
                        onPress={() => handleCancelRequest(item.id)}
                        label="Cancel"
                        variant="outline"
                        size="small"
                      />
                    </View>
                  )}
                </Card>
              );
            }}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />

          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <View style={styles.pagination}>
              <Button
                onPress={() => setPage(Math.max(1, page - 1))}
                label="← Previous"
                variant={page === 1 ? 'outline' : 'primary'}
                disabled={page === 1}
              />
              <Text style={styles.pageInfo}>
                Page {page} of {data.pagination.pages}
              </Text>
              <Button
                onPress={() => setPage(Math.min(data.pagination.pages, page + 1))}
                label="Next →"
                variant={page === data.pagination.pages ? 'outline' : 'primary'}
                disabled={page === data.pagination.pages}
              />
            </View>
          )}
        </>
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
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  filtersScroll: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  filterButtonActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  requestCard: {
    borderRadius: 12,
    borderWidth: 1,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  requestId: {
    fontSize: 11,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  actions: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  pageInfo: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
    textAlign: 'center',
  },
});
