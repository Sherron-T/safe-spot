// tokens.jsx — design tokens + Tweaks state
// Warm, destigmatizing palette. Single terracotta accent, calm green for "open",
// confident (non-alarming) red reserved ONLY for emergency surfaces.

const THEMES = {
  warm: {
    bg:        'oklch(0.975 0.012 70)',
    surface:   'oklch(0.99 0.008 75)',
    ink:       'oklch(0.22 0.025 40)',
    mute:      'oklch(0.52 0.02 40)',
    faint:     'oklch(0.90 0.01 60)',
    border:    'oklch(0.89 0.012 65)',
    accent:    'oklch(0.62 0.14 40)',
    accentSoft:'oklch(0.93 0.04 45)',
    open:      'oklch(0.62 0.13 150)',   // calm green
    openSoft:  'oklch(0.93 0.05 150)',
    urgent:    'oklch(0.55 0.20 25)',    // red — reserved
    urgentSoft:'oklch(0.93 0.06 25)',
    mapLand:   'oklch(0.96 0.015 75)',
    mapWater:  'oklch(0.90 0.04 220)',
    mapStreet: 'oklch(1 0 0)',
    mapPark:   'oklch(0.92 0.05 145)',
  },
  clinical: {
    bg:        'oklch(0.98 0.005 240)',
    surface:   'oklch(1 0 0)',
    ink:       'oklch(0.22 0.02 245)',
    mute:      'oklch(0.50 0.02 245)',
    faint:     'oklch(0.92 0.01 240)',
    border:    'oklch(0.90 0.012 240)',
    accent:    'oklch(0.55 0.14 245)',   // steady blue
    accentSoft:'oklch(0.94 0.03 245)',
    open:      'oklch(0.60 0.13 160)',
    openSoft:  'oklch(0.94 0.04 160)',
    urgent:    'oklch(0.55 0.20 25)',
    urgentSoft:'oklch(0.94 0.05 25)',
    mapLand:   'oklch(0.97 0.005 240)',
    mapWater:  'oklch(0.92 0.03 225)',
    mapStreet: 'oklch(1 0 0)',
    mapPark:   'oklch(0.94 0.04 150)',
  },
  activist: {
    bg:        'oklch(0.20 0.02 30)',
    surface:   'oklch(0.26 0.025 30)',
    ink:       'oklch(0.97 0.01 80)',
    mute:      'oklch(0.75 0.02 60)',
    faint:     'oklch(0.32 0.025 30)',
    border:    'oklch(0.35 0.025 30)',
    accent:    'oklch(0.80 0.16 75)',    // amber
    accentSoft:'oklch(0.35 0.08 65)',
    open:      'oklch(0.78 0.17 145)',
    openSoft:  'oklch(0.33 0.08 145)',
    urgent:    'oklch(0.68 0.22 25)',
    urgentSoft:'oklch(0.35 0.10 25)',
    mapLand:   'oklch(0.22 0.02 30)',
    mapWater:  'oklch(0.30 0.04 235)',
    mapStreet: 'oklch(0.32 0.02 30)',
    mapPark:   'oklch(0.28 0.05 145)',
  },
};

const STRINGS = {
  EN: {
    appName: 'Safe Spot',
    tagline: 'NYC harm reduction, on your map.',
    tabMap: 'Map', tabSaved: 'Saved', tabLearn: 'Learn', tabBuddy: 'Buddy', tabNow: 'Now',
    openNow: 'Open now', closed: 'Closed', closesSoon: 'Closes soon',
    filterAll: 'All', filterSEP: 'Syringe exchange', filterNarcan: 'Naloxone', filterTest: 'Test strips', filterWound: 'Wound care', filterYouth: 'Youth 16–24',
    hereNow: 'Near you',
    privacyTitle: 'No account. No tracking.',
    privacyBody: "We don't ask for your name, phone, or location history. Nothing you do here is shared with anyone.",
    privacyCta: 'Got it',
    emergency: 'I need help now',
    getNarcan: 'Get free naloxone',
    howToUse: 'How to use naloxone',
    openMaps: 'Directions',
    call: 'Call',
    save: 'Save', saved: 'Saved',
    buddyTitle: 'Buddy mode',
    buddyBody: 'Pick someone to check on you. If you don\'t respond to a timer, they get a text with your rough location.',
    startBuddy: 'Start a session',
    minutes: 'minutes',
    languages: 'Languages', services: 'Services', hours: 'Hours', access: 'Access',
    walking: 'walk', transit: 'transit',
  },
  ES: {
    appName: 'Safe Spot',
    tagline: 'Reducción de daños en NYC, en tu mapa.',
    tabMap: 'Mapa', tabSaved: 'Guardados', tabLearn: 'Aprende', tabBuddy: 'Compañía', tabNow: 'Ahora',
    openNow: 'Abierto ahora', closed: 'Cerrado', closesSoon: 'Cierra pronto',
    filterAll: 'Todo', filterSEP: 'Jeringas', filterNarcan: 'Naloxona', filterTest: 'Tiras de prueba', filterWound: 'Heridas', filterYouth: 'Jóvenes 16–24',
    hereNow: 'Cerca de ti',
    privacyTitle: 'Sin cuenta. Sin rastreo.',
    privacyBody: 'No pedimos tu nombre, teléfono ni historial. Nada de lo que hagas aquí se comparte.',
    privacyCta: 'Entendido',
    emergency: 'Necesito ayuda ahora',
    getNarcan: 'Naloxona gratis',
    howToUse: 'Cómo usar naloxona',
    openMaps: 'Cómo llegar',
    call: 'Llamar',
    save: 'Guardar', saved: 'Guardado',
    buddyTitle: 'Modo compañía',
    buddyBody: 'Elige a alguien que te cuide. Si no respondes al temporizador, recibe un mensaje con tu ubicación aproximada.',
    startBuddy: 'Iniciar sesión',
    minutes: 'minutos',
    languages: 'Idiomas', services: 'Servicios', hours: 'Horario', access: 'Acceso',
    walking: 'caminando', transit: 'tránsito',
  },
  ZH: {
    appName: 'Safe Spot',
    tagline: '纽约减害资源，就在你的地图上。',
    tabMap: '地图', tabSaved: '收藏', tabLearn: '学习', tabBuddy: '伙伴', tabNow: '紧急',
    openNow: '现在营业', closed: '已关闭', closesSoon: '即将关闭',
    filterAll: '全部', filterSEP: '针具交换', filterNarcan: '纳洛酮', filterTest: '检测试纸', filterWound: '伤口护理', filterYouth: '青年 16–24',
    hereNow: '附近的资源',
    privacyTitle: '无需账号。不做追踪。',
    privacyBody: '我们不会索取你的姓名、电话或位置记录。你在这里的任何操作都不会被分享。',
    privacyCta: '明白了',
    emergency: '我现在需要帮助',
    getNarcan: '领取免费纳洛酮',
    howToUse: '纳洛酮使用方法',
    openMaps: '路线',
    call: '打电话',
    save: '收藏', saved: '已收藏',
    buddyTitle: '伙伴模式',
    buddyBody: '选一个人照看你。如果定时器到时你没有回应，他们会收到带有大致位置的短信。',
    startBuddy: '开始会话',
    minutes: '分钟',
    languages: '语言', services: '服务', hours: '时间', access: '无障碍',
    walking: '步行', transit: '公交',
  },
};

function useTokens(tweaks) {
  const base = THEMES[tweaks.theme] || THEMES.warm;
  const dark = tweaks.mode === 'dark';
  if (!dark) return { ...base, dark: false };
  // dark mode: invert for warm + clinical (activist already dark-ish)
  if (tweaks.theme === 'activist') return { ...base, dark: true };
  return {
    ...base,
    bg:        'oklch(0.18 0.015 50)',
    surface:   'oklch(0.23 0.018 50)',
    ink:       'oklch(0.97 0.01 70)',
    mute:      'oklch(0.72 0.015 55)',
    faint:     'oklch(0.28 0.02 50)',
    border:    'oklch(0.32 0.02 50)',
    accentSoft:'oklch(0.32 0.07 45)',
    openSoft:  'oklch(0.30 0.06 150)',
    urgentSoft:'oklch(0.32 0.08 25)',
    mapLand:   'oklch(0.20 0.018 50)',
    mapWater:  'oklch(0.26 0.03 225)',
    mapStreet: 'oklch(0.30 0.018 50)',
    mapPark:   'oklch(0.26 0.05 145)',
    dark: true,
  };
}

function useScale(tweaks) {
  const big = tweaks.bigText;
  const compact = tweaks.density === 'compact';
  return {
    h1: big ? 36 : 30,
    h2: big ? 24 : 20,
    h3: big ? 19 : 17,
    body: big ? 18 : 15,
    small: big ? 15 : 12,
    tap: big ? 52 : 44,
    gap: compact ? 10 : 14,
    padY: compact ? 10 : 14,
  };
}

Object.assign(window, { THEMES, STRINGS, useTokens, useScale });
