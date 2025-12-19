import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'ai-workbench-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // 从 localStorage 读取保存的主题
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      return savedTheme;
    }
    // 默认使用深色主题
    return 'dark';
  });

  // 更新 HTML 属性和 localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 主题颜色配置
export const themeColors = {
  dark: {
    // Primary
    primary: '#00d4ff',
    primaryLight: '#5ce1ff',
    primaryDark: '#00a8cc',
    primaryGlow: 'rgba(0, 212, 255, 0.4)',

    // Secondary
    secondary: '#a855f7',
    secondaryLight: '#c084fc',
    secondaryGlow: 'rgba(168, 85, 247, 0.4)',

    // Backgrounds
    bgPrimary: '#0a0e17',
    bgSecondary: '#111827',
    bgTertiary: '#1a2234',
    bgElevated: '#1f2937',
    bgSurface: 'rgba(255, 255, 255, 0.03)',
    bgSurfaceHover: 'rgba(255, 255, 255, 0.06)',

    // Text
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b',
    textMuted: '#475569',

    // Borders
    borderPrimary: 'rgba(255, 255, 255, 0.08)',
    borderSecondary: 'rgba(255, 255, 255, 0.12)',
    borderAccent: 'rgba(0, 212, 255, 0.3)',

    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
    gradientSecondary: 'linear-gradient(135deg, #1a2234 0%, #0a0e17 100%)',

    // Shadows
    shadowMd: '0 4px 16px rgba(0, 0, 0, 0.4)',
    shadowLg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    shadowGlow: '0 0 40px rgba(0, 212, 255, 0.3)',

    // Status
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  light: {
    // Primary
    primary: '#0ea5e9',
    primaryLight: '#38bdf8',
    primaryDark: '#0284c7',
    primaryGlow: 'rgba(14, 165, 233, 0.2)',

    // Secondary
    secondary: '#8b5cf6',
    secondaryLight: '#a78bfa',
    secondaryGlow: 'rgba(139, 92, 246, 0.2)',

    // Backgrounds
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgTertiary: '#f1f5f9',
    bgElevated: '#ffffff',
    bgSurface: 'rgba(0, 0, 0, 0.02)',
    bgSurfaceHover: 'rgba(0, 0, 0, 0.04)',

    // Text
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#64748b',
    textMuted: '#94a3b8',

    // Borders
    borderPrimary: 'rgba(0, 0, 0, 0.06)',
    borderSecondary: 'rgba(0, 0, 0, 0.1)',
    borderAccent: 'rgba(14, 165, 233, 0.3)',

    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
    gradientSecondary: 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)',

    // Shadows
    shadowMd: '0 4px 16px rgba(0, 0, 0, 0.08)',
    shadowLg: '0 8px 32px rgba(0, 0, 0, 0.12)',
    shadowGlow: '0 0 40px rgba(14, 165, 233, 0.15)',

    // Status
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
  },
};

// Hook to get current theme colors
export const useThemeColors = () => {
  const { theme } = useTheme();
  return themeColors[theme];
};
