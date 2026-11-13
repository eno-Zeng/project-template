import React from 'react';
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import type { TabKey } from '@/types/user';
import styles from './index.module.scss';

interface CustomTabBarProps {
  active: TabKey;
}

interface TabItem {
  key: TabKey;
  label: string;
  url: string;
}

const tabs: TabItem[] = [
  { key: 'home', label: '首页', url: '/pages/index/index' },
  { key: 'mine', label: '我的', url: '/pages/mine/index' },
];

const CustomTabBar: React.FC<CustomTabBarProps> = ({ active }) => {
  const handleSwitch = (tab: TabItem) => {
    if (tab.key === active) return;

    Taro.redirectTo({ url: tab.url }).catch((error) => {
      console.error('[TabBar] 页面切换失败', error);
      Taro.showToast({ title: '页面切换失败，请重试', icon: 'none' });
    });
  };

  return (
    <View className={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;

        return (
          <View
            key={tab.key}
            className={styles.tabItem}
            onClick={() => handleSwitch(tab)}
          >
            <View className={styles.tabIcon}>
              {tab.key === 'home' ? (
                <View className={styles.homeIcon}>
                  <View className={classnames(styles.homeRoof, isActive && styles.iconActive)} />
                  <View className={classnames(styles.homeBody, isActive && styles.iconActive)} />
                </View>
              ) : (
                <View className={styles.userIcon}>
                  <View className={classnames(styles.userHead, isActive && styles.iconActive)} />
                  <View className={classnames(styles.userBody, isActive && styles.iconActive)} />
                </View>
              )}
            </View>
            <Text className={classnames(styles.tabLabel, isActive && styles.tabLabelActive)}>
              {tab.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
