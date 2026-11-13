import React, { useState } from 'react';
import { Button, ScrollView, Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import CustomTabBar from '@/components/CustomTabBar';
import { getCurrentUser, logoutLocally } from '@/services/auth';
import type { UserProfile } from '@/types/user';
import styles from './index.module.scss';

interface MenuItem {
  id: number;
  title: string;
  description: string;
}

const menuItems: MenuItem[] = [
  { id: 1, title: '我的收藏', description: '留住每一份心动灵感' },
  { id: 2, title: '浏览记录', description: '找回最近看过的内容' },
  { id: 3, title: '消息通知', description: '了解互动与平台动态' },
  { id: 4, title: '偏好设置', description: '定制你的内容阅读体验' },
  { id: 5, title: '帮助与反馈', description: '告诉我们你的想法' },
  { id: 6, title: '关于 Moment', description: '认识这个日常灵感空间' },
];

const MinePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useDidShow(() => {
    setUser(getCurrentUser());
  });

  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' }).catch((error) => {
      console.error('[Mine] 打开登录页失败', error);
    });
  };

  const handleLogout = async () => {
    try {
      const { confirm } = await Taro.showModal({
        title: '退出登录',
        content: '确认退出当前演示账号吗？',
        confirmText: '退出',
      });
      if (!confirm) return;

      logoutLocally();
      setUser(null);
      Taro.showToast({ title: '已退出登录', icon: 'none' });
    } catch (error) {
      console.error('[Mine] 退出登录失败', error);
      Taro.showToast({ title: '操作失败，请重试', icon: 'none' });
    }
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.content}>
        <View className={styles.inner}>
          <View className={styles.heading}>
            <Text className={styles.pageTitle}>我的</Text>
            <Text className={styles.pageSubtitle}>管理你的灵感与个人偏好</Text>
          </View>

          <View className={styles.profileCard}>
            <View className={styles.profileMain}>
              <View className={styles.avatar}>
                <Text className={styles.avatarText}>{user ? user.nickname.charAt(0) : '访'}</Text>
              </View>
              <View className={styles.profileInfo}>
                <Text className={styles.nickname}>{user ? user.nickname : '你好，访客'}</Text>
                <Text className={styles.account}>
                  {user ? `${user.account.slice(0, 3)}****${user.account.slice(-4)}` : '登录后开启完整个人空间'}
                </Text>
              </View>
            </View>
            <View className={styles.statusBadge}>
              <View className={classnames(styles.statusDot, user && styles.statusDotActive)} />
              <Text className={styles.statusText}>{user ? '已登录' : '未登录'}</Text>
            </View>
          </View>

          <View className={styles.brandCard}>
            <Text className={styles.brandEyebrow}>MOMENT MEMBER</Text>
            <Text className={styles.brandTitle}>每一个日常，都值得认真收藏</Text>
            <Text className={styles.brandDescription}>在忙碌的世界里，为自己保留一块灵感自留地。</Text>
          </View>

          <Text className={styles.sectionTitle}>常用功能</Text>
          <View className={styles.menuList}>
            {menuItems.map((item, index) => (
              <View
                key={item.id}
                className={classnames(styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast)}
                onClick={() => Taro.showToast({ title: `${item.title}待接入`, icon: 'none' })}
              >
                <View className={styles.menuSymbol}>
                  <Text className={styles.menuSymbolText}>{item.title.charAt(0)}</Text>
                </View>
                <View className={styles.menuContent}>
                  <Text className={styles.menuTitle}>{item.title}</Text>
                  <Text className={styles.menuDescription}>{item.description}</Text>
                </View>
                <Text className={styles.menuArrow}>›</Text>
              </View>
            ))}
          </View>

          {user ? (
            <Button className={classnames(styles.actionButton, styles.logoutButton)} onClick={handleLogout}>
              退出登录
            </Button>
          ) : (
            <Button className={classnames(styles.actionButton, styles.loginButton)} onClick={handleLogin}>
              立即登录
            </Button>
          )}
          <Text className={styles.version}>MOMENT · TARO MULTI-PLATFORM</Text>
        </View>
      </ScrollView>
      <CustomTabBar active="mine" />
    </View>
  );
};

export default MinePage;
