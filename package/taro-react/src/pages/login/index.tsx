import React, { useState } from 'react';
import { Button, Input, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { loginLocally } from '@/services/auth';
import styles from './index.module.scss';

const LoginPage: React.FC = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showValidationError = (title: string) => {
    Taro.showToast({ title, icon: 'none' });
  };

  const handleLogin = () => {
    const normalizedAccount = account.trim();
    if (!/^1\d{10}$/.test(normalizedAccount)) {
      showValidationError('请输入正确的 11 位手机号');
      return;
    }
    if (password.length < 6) {
      showValidationError('密码至少需要 6 位');
      return;
    }

    setSubmitting(true);
    try {
      loginLocally(normalizedAccount);
      Taro.showToast({ title: '登录成功', icon: 'success' });
      Taro.redirectTo({ url: '/pages/mine/index' }).catch((error) => {
        console.error('[Login] 登录后跳转失败', error);
      });
    } catch (error) {
      console.error('[Login] 本地登录失败', error);
      showValidationError('登录失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackHome = () => {
    Taro.redirectTo({ url: '/pages/index/index' }).catch((error) => {
      console.error('[Login] 返回首页失败', error);
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.container}>
        <View className={styles.brandMark}>
          <Text className={styles.brandMarkText}>M</Text>
        </View>
        <Text className={styles.eyebrow}>WELCOME TO MOMENT</Text>
        <Text className={styles.title}>登录，继续你的灵感旅程</Text>
        <Text className={styles.subtitle}>每一份喜欢，都值得被认真记录。</Text>

        <View className={styles.formCard}>
          <View className={styles.field}>
            <Text className={styles.label}>手机号</Text>
            <View className={styles.inputWrap}>
              <Input
                className={styles.input}
                type="number"
                maxlength={11}
                value={account}
                placeholder="请输入 11 位手机号"
                placeholderClass={styles.placeholder}
                onInput={(event) => setAccount(event.detail.value)}
              />
            </View>
          </View>

          <View className={styles.field}>
            <Text className={styles.label}>密码</Text>
            <View className={styles.inputWrap}>
              <Input
                className={styles.input}
                password
                maxlength={20}
                value={password}
                placeholder="请输入至少 6 位密码"
                placeholderClass={styles.placeholder}
                onInput={(event) => setPassword(event.detail.value)}
              />
            </View>
          </View>

          <View className={styles.demoTip}>
            <Text className={styles.demoTipTitle}>演示账号说明</Text>
            <Text className={styles.demoTipText}>输入任意合法手机号和 6 位以上密码即可体验。</Text>
          </View>

          <Button
            className={classnames(styles.submitButton, submitting && styles.submitButtonDisabled)}
            disabled={submitting}
            onClick={handleLogin}
          >
            {submitting ? '正在登录...' : '登录'}
          </Button>
          <Button className={styles.backButton} onClick={handleBackHome}>
            暂不登录，返回首页
          </Button>
        </View>

        <Text className={styles.privacyTip}>本模板使用本地演示登录，不会上传账号信息。</Text>
      </View>
    </View>
  );
};

export default LoginPage;
