import React, { useState } from 'react';
import { Image, ScrollView, Swiper, SwiperItem, Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import CustomTabBar from '@/components/CustomTabBar';
import { articles, banners, navItems } from '@/data/home';
import { getCurrentUser } from '@/services/auth';
import type { UserProfile } from '@/types/user';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [activeBanner, setActiveBanner] = useState(0);
  const [user, setUser] = useState<UserProfile | null>(null);

  useDidShow(() => {
    setUser(getCurrentUser());
  });

  const handleProfile = () => {
    const navigation = user
      ? Taro.redirectTo({ url: '/pages/mine/index' })
      : Taro.navigateTo({ url: '/pages/login/index' });

    navigation.catch((error) => {
      console.error('[Home] 打开用户页面失败', error);
    });
  };

  const handleNav = (title: string) => {
    Taro.showToast({ title: `${title}频道`, icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.content}>
        <View className={styles.inner}>
          <View className={styles.header}>
            <View className={styles.brand}>
              <View className={styles.brandMark}>
                <Text className={styles.brandMarkText}>M</Text>
              </View>
              <View>
                <Text className={styles.brandName}>MOMENT</Text>
                <Text className={styles.brandSlogan}>发现日常新灵感</Text>
              </View>
            </View>
            <View className={styles.profileButton} onClick={handleProfile}>
              <Text className={styles.profileButtonText}>{user ? '我的' : '登录'}</Text>
            </View>
          </View>

          <View className={styles.bannerSection}>
            <Swiper
              className={styles.swiper}
              autoplay
              circular
              interval={4500}
              duration={450}
              onChange={(event) => setActiveBanner(event.detail.current)}
            >
              {banners.map((banner) => (
                <SwiperItem key={banner.id}>
                  <View className={styles.bannerItem}>
                    <Image
                      className={styles.bannerImage}
                      src={banner.image}
                      mode="aspectFill"
                      onError={() => console.error(`[Home] 轮播图加载失败：${banner.id}`)}
                    />
                    <View className={styles.bannerOverlay}>
                      <Text className={styles.bannerEyebrow}>{banner.eyebrow}</Text>
                      <Text className={styles.bannerTitle}>{banner.title}</Text>
                    </View>
                  </View>
                </SwiperItem>
              ))}
            </Swiper>
            <View className={styles.indicators}>
              {banners.map((banner, index) => (
                <View
                  key={banner.id}
                  className={classnames(styles.indicator, activeBanner === index && styles.indicatorActive)}
                />
              ))}
            </View>
          </View>

          <View className={styles.navCard}>
            {navItems.map((item) => (
              <View key={item.id} className={styles.navItem} onClick={() => handleNav(item.title)}>
                <View className={styles.navIcon} style={{ backgroundColor: item.backgroundColor }}>
                  <Text className={styles.navSymbol} style={{ color: item.color }}>
                    {item.symbol}
                  </Text>
                </View>
                <Text className={styles.navLabel}>{item.title}</Text>
              </View>
            ))}
          </View>

          <View className={styles.sectionHeader}>
            <View>
              <Text className={styles.sectionEyebrow}>EDITOR'S PICKS</Text>
              <Text className={styles.sectionTitle}>为你推荐</Text>
            </View>
            <Text className={styles.sectionCount}>{articles.length} 条新内容</Text>
          </View>

          <View className={styles.articleList}>
            {articles.map((article, index) => (
              <View
                key={article.id}
                className={classnames(
                  styles.articleCard,
                  index === articles.length - 1 && styles.articleCardLast,
                )}
                onClick={() => Taro.showToast({ title: '已选择该内容', icon: 'none' })}
              >
                <Text className={styles.articleNumber}>{String(index + 1).padStart(2, '0')}</Text>
                <View className={styles.articleBody}>
                  <Text className={styles.articleCategory}>{article.category}</Text>
                  <Text className={styles.articleTitle}>{article.title}</Text>
                  <Text className={styles.articleSummary}>{article.summary}</Text>
                  <Text className={styles.articleMeta}>{article.meta}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text className={styles.listEnd}>已经到底啦，期待与你再次相遇</Text>
        </View>
      </ScrollView>
      <CustomTabBar active="home" />
    </View>
  );
};

export default HomePage;
