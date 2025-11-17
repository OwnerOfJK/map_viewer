import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing } from '../styles/theme';

interface Tab {
  key: string;
  title: string;
  component: React.ComponentType<any>;
}

interface CustomTabViewProps {
  tabs: Tab[];
}

export const CustomTabView: React.FC<CustomTabViewProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const ActiveComponent = tabs[activeTab].component;

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabButton}
            onPress={() => setActiveTab(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.tabTextActive,
              ]}
            >
              {tab.title}
            </Text>
            {activeTab === index && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        <ActiveComponent />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBlue,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primaryBlue,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primaryBlue,
  },
  contentContainer: {
    flex: 1,
  },
});
