import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useCategories } from '@/hooks/useCustomer';
import { LoadingSpinner, ErrorMessage, EmptyState, Card } from '@/components/UI';
import { Category } from '@/types/customer';

const { width } = Dimensions.get('window');

interface CategoriesScreenProps {
  navigation: any;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ navigation }) => {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }

  if (!categories || categories.length === 0) {
    return <EmptyState icon="📂" title="No Categories Found" />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Services</Text>
        <Text style={styles.headerSubtitle}>Find trusted handymen for all your needs</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContainer}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Handymen', { category: item.id })}
          >
            <Card>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryCount}>{item.count} available</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  gridContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    gap: 8,
  },
  categoryCard: {
    width: (width - 32) / 2,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#0ea5e9',
    fontWeight: '500',
  },
});
