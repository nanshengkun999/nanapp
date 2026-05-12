import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import type { TouchEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  House,
  MapPin,
  Play,
  Search,
  Send,
  Share2,
  Star,
  Utensils,
  Volume2,
  VolumeX,
  UsersRound,
  WandSparkles,
  Wine,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import EmbeddedMapView from '../components/EmbeddedMapView';
import SearchPage from '../components/SearchPage';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import { categories, stores, type Category, type Store } from '../data/stores';
import { localizeStore } from '../utils/storeI18n';

type ViewMode = 'video' | 'map';
type ContentCategoryId = 'food' | 'medical' | 'nightlife';
type PreloadKind = 'vertical' | 'channel';
type ThemeId = ContentCategoryId | 'map';

type PreloadedVideo = {
  video: HTMLVideoElement;
  storeId: string;
  channelId: ContentCategoryId;
  index: number;
  kind: PreloadKind;
};

const categoryMeta = [
  { labelKey: 'food', icon: Utensils },
  { labelKey: 'beauty', icon: WandSparkles },
  { labelKey: 'nightlife', icon: Wine },
];

const mapHomeTab = { id: 'map', labelKey: 'map', type: 'map' } as const;

const contentHomeTabs = [
  { id: 'food', labelKey: 'food', categoryIndex: 0, type: 'content' },
  { id: 'medical', labelKey: 'beauty', categoryIndex: 1, type: 'content' },
  { id: 'nightlife', labelKey: 'nightlife', categoryIndex: 2, type: 'content' },
] as const;

const homeThemes: Record<
  ThemeId,
  {
    primary: string;
    primarySoft: string;
    primaryGlow: string;
    logo: string;
    logoGlow: string;
    buttonBg: string;
    buttonText: string;
    border: string;
    topBg: string;
    lineTrack: string;
    iconSoft: string;
  }
> = {
  map: {
    primary: '#66E1AA',
    primarySoft: 'rgba(102,225,170,0.18)',
    primaryGlow: 'rgba(102,225,170,0.56)',
    logo: '#79E5C4',
    logoGlow: 'rgba(121,229,196,0.52)',
    buttonBg: 'linear-gradient(135deg, #73E9B7, #4BD9C8)',
    buttonText: '#073238',
    border: 'rgba(102,225,170,0.38)',
    topBg: 'rgba(0,0,0,0.14)',
    lineTrack: 'rgba(255,255,255,0.22)',
    iconSoft: 'rgba(102,225,170,0.18)',
  },
  food: {
    primary: '#5FE0B5',
    primarySoft: 'rgba(95,224,181,0.1)',
    primaryGlow: 'rgba(95,224,181,0.42)',
    logo: '#8FF3D0',
    logoGlow: 'rgba(0,0,0,0.24)',
    buttonBg: 'linear-gradient(135deg, #8FF3D0 0%, #5FE0B5 48%, #48D6A0 100%)',
    buttonText: '#073B32',
    border: 'rgba(95,224,181,0.42)',
    topBg: 'rgba(8,12,10,0.42)',
    lineTrack: 'rgba(255,255,255,0.16)',
    iconSoft: 'rgba(95,224,181,0.18)',
  },
  medical: {
    primary: '#E8B4B8',
    primarySoft: 'rgba(255,235,232,0.1)',
    primaryGlow: 'rgba(232,180,184,0.24)',
    logo: '#F3D6C8',
    logoGlow: 'rgba(0,0,0,0.22)',
    buttonBg: 'linear-gradient(135deg, #F3D6C8 0%, #E8B4B8 48%, #C98F8F 100%)',
    buttonText: '#4A2D31',
    border: 'rgba(232,180,184,0.42)',
    topBg: 'rgba(18,14,16,0.42)',
    lineTrack: 'rgba(255,255,255,0.18)',
    iconSoft: 'rgba(255,235,232,0.1)',
  },
  nightlife: {
    primary: '#C02BFF',
    primarySoft: 'rgba(192,43,255,0.2)',
    primaryGlow: 'rgba(192,43,255,0.82)',
    logo: '#E879F9',
    logoGlow: 'rgba(46,219,255,0.45)',
    buttonBg: 'linear-gradient(135deg, #6A5CFF 0%, #C02BFF 52%, #FF4FD8 100%)',
    buttonText: '#FFFFFF',
    border: 'rgba(192,43,255,0.42)',
    topBg: 'rgba(8,10,24,0.42)',
    lineTrack: 'rgba(255,255,255,0.16)',
    iconSoft: 'rgba(46,219,255,0.18)',
  },
};

function normalizeHomeCategory(value: string | null): ContentCategoryId {
  if (value === 'medical' || value === 'beauty') return 'medical';
  if (value === 'nightlife') return 'nightlife';
  return 'food';
}

function getInitialHomeCategory(): ContentCategoryId {
  if (typeof window === 'undefined') return 'food';
  return normalizeHomeCategory(window.localStorage.getItem('tanmapHomeCategory'));
}

function getCategoryByContentId(categoryId: ContentCategoryId): Category {
  const tab = contentHomeTabs.find((item) => item.id === categoryId) ?? contentHomeTabs[0];
  return categories[tab.categoryIndex];
}

function getContentIdByCategory(category: Category): ContentCategoryId {
  const categoryIndex = categories.indexOf(category);
  return contentHomeTabs.find((tab) => tab.categoryIndex === categoryIndex)?.id ?? 'food';
}

function getPreloadOffsets() {
  if (typeof navigator === 'undefined') return [-1, 0, 1, 2, 3];

  const connection = (
    navigator as Navigator & {
      connection?: {
        effectiveType?: string;
        saveData?: boolean;
        type?: string;
      };
    }
  ).connection;
  const effectiveType = connection?.effectiveType ?? '';
  const isPoorNetwork =
    connection?.saveData === true ||
    effectiveType === 'slow-2g' ||
    effectiveType === '2g';

  return isPoorNetwork ? [-1, 0, 1] : [-1, 0, 1, 2, 3];
}

function createPreloadVideo(store: Store) {
  const video = document.createElement('video');
  video.src = store.videoUrl;
  video.preload = 'auto';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.load();
  return video;
}

function disposePreloadVideo(video: HTMLVideoElement) {
  video.pause();
  video.removeAttribute('src');
  video.load();
}

type LocalizedStoreDisplay = {
  name: Record<Language, string>;
  address: Record<Language, string>;
  tags: string[];
  description?: Record<Language, string>;
};

const storeDisplay: Record<string, LocalizedStoreDisplay> = {
  '1': {
    name: { 中文: '云端咖啡馆', 한국어: '구름 카페', English: 'Cloud Cafe' },
    address: { 中文: '首尔 弘大安静小巷', 한국어: '서울 홍대 조용한 골목', English: 'Quiet alley, Hongdae Seoul' },
    tags: ['food', 'coffee', 'localFavorite', 'date'],
    description: {
      中文: '博主私藏的温暖咖啡馆，适合下午慢慢坐一会儿。',
      한국어: '블로거가 아껴둔 따뜻한 카페, 오후에 천천히 머물기 좋아요.',
      English: 'A warm cafe saved by the blogger, good for a slow afternoon.',
    },
  },
  '2': {
    name: { 中文: '花间寿司', 한국어: '하나 스시', English: 'Hana Sushi' },
    address: { 中文: '首尔 延南洞', 한국어: '서울 연남동', English: 'Yeonnam-dong, Seoul' },
    tags: ['food', 'japaneseFood', 'niche', 'date'],
  },
  '3': {
    name: { 中文: '悦颜医美诊所', 한국어: '유안 클리닉', English: 'Yueyan Clinic' },
    address: { 中文: '首尔 江南区', 한국어: '서울 강남구', English: 'Gangnam, Seoul' },
    tags: ['beauty', 'skinCare', 'chineseSupport', 'lightBeauty'],
  },
  '7': {
    name: { 中文: '星光医美中心', 한국어: '스타라이트 클리닉', English: 'Starlight Clinic' },
    address: { 中文: '首尔 江南皮肤管理街', 한국어: '서울 강남 피부관리 거리', English: 'Gangnam skin care street' },
    tags: ['beauty', 'skinCare', 'localFavorite', 'chineseSupport'],
  },
  '11': {
    name: { 中文: '美式汉堡屋', 한국어: '아메리칸 버거 하우스', English: 'American Burger House' },
    address: { 中文: '首尔 弘大入口', 한국어: '서울 홍대입구', English: 'Hongdae Entrance, Seoul' },
    tags: ['food', 'localFavorite', 'niche', 'date'],
  },
  '15': {
    name: { 中文: 'Neon 夜店', 한국어: 'Neon 클럽', English: 'Neon Club' },
    address: { 中文: '首尔 梨泰院', 한국어: '서울 이태원', English: 'Itaewon, Seoul' },
    tags: ['nightlife', 'DJ', 'teamUp', 'cocktail'],
  },
  '17': {
    name: { 中文: 'Jazz Live House', 한국어: '재즈 라이브 하우스', English: 'Jazz Live House' },
    address: { 中文: '首尔 성수 작은 공연장', 한국어: '서울 성수 작은 공연장', English: 'Small live house, Seongsu' },
    tags: ['nightlife', 'localFavorite', 'date', 'cocktail'],
  },
};

function getCategoryIndex(category: Category) {
  return Math.max(0, categories.findIndex((item) => item === category));
}

function getCategoryLabel(category: Category, t: (key: string) => string) {
  return t(categoryMeta[getCategoryIndex(category)]?.labelKey ?? 'selected');
}

function getDisplayStore(store: Store, language: Language, t: (key: string) => string) {
  const override = storeDisplay[store.id];
  const localizedStore = localizeStore(store, language);

  return {
    ...localizedStore,
    tags: override?.tags.map(t) ?? [getCategoryLabel(store.category, t), t('localFavorite'), t('savedSpot'), t('visitSpot')],
    address: override?.address[language] ?? localizedStore.address,
    name: override?.name[language] ?? localizedStore.name,
    description: override?.description?.[language] ?? localizedStore.description,
  };
}

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const initialHomeCategory = getInitialHomeCategory();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [homeCategory, setHomeCategory] = useState<ContentCategoryId>(initialHomeCategory);
  const [selectedCategory, setSelectedCategory] = useState<Category>(() => getCategoryByContentId(initialHomeCategory));
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('video');
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [preloadIndexes, setPreloadIndexes] = useState<Set<number>>(() => new Set([0, 1, 2, 3]));
  const [showFavoritesSheet, setShowFavoritesSheet] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedStores, setSavedStores] = useState<Set<string>>(
    () => new Set(stores.filter((store) => store.saved).map((store) => store.id))
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());
  const preloadedVideosRef = useRef<Map<string, PreloadedVideo>>(new Map());
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const shareId = searchParams.get('share');
    const requestedMode = searchParams.get('mode');
    const shouldOpenSearch = searchParams.get('search') === '1';

    if (requestedMode === 'map') {
      setViewMode('map');
      setIsPaused(true);
    }

    if (shouldOpenSearch) {
      setIsSearchOpen(true);
    }

    if (!shareId) return;
    const storeIndex = stores.findIndex((store) => store.id === shareId);
    if (storeIndex !== -1) {
      const sharedStore = stores[storeIndex];
      const sharedCategoryStores = stores.filter((store) => store.category === sharedStore.category);
      setSelectedCategory(sharedStore.category);
      setCurrentIndex(Math.max(0, sharedCategoryStores.findIndex((store) => store.id === shareId)));
    }
  }, [searchParams]);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesCategory = store.category === selectedCategory;
      const matchesTag = selectedTag ? store.tags.includes(selectedTag) : true;
      return matchesCategory && matchesTag;
    });
  }, [selectedCategory, selectedTag]);

  useEffect(() => {
    if (currentIndex > filteredStores.length - 1) {
      setCurrentIndex(0);
    }
  }, [currentIndex, filteredStores.length]);

  const currentStore = filteredStores[currentIndex] ?? filteredStores[0] ?? stores[0];
  const displayStore = getDisplayStore(currentStore, language, t);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    stores
      .filter((store) => store.category === selectedCategory)
      .forEach((store) => store.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [selectedCategory]);

  const filteredTags = useMemo(() => {
    if (!tagSearch) return availableTags.slice(0, 12);
    return availableTags.filter((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase()));
  }, [availableTags, tagSearch]);

  const searchFilteredStores = useMemo(() => {
    const query = tagSearch.trim().toLowerCase();
    if (!query) return filteredStores;

    return filteredStores.filter((store) => {
      const localizedStore = localizeStore(store, language);
      const localizedTags = store.tags.map((tag) => t(tag).toLowerCase());

      return (
        localizedStore.name.toLowerCase().includes(query) ||
        localizedStore.address.toLowerCase().includes(query) ||
        localizedStore.description.toLowerCase().includes(query) ||
        store.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        localizedTags.some((tag) => tag.includes(query))
      );
    });
  }, [filteredStores, language, t, tagSearch]);

  const savedStoreList = useMemo(
    () => stores.filter((store) => savedStores.has(store.id)).map((store) => getDisplayStore(store, language, t)),
    [language, savedStores, t]
  );

  const orderedHomeTabs = useMemo(() => {
    const homeTab = contentHomeTabs.find((tab) => tab.id === homeCategory) ?? contentHomeTabs[0];
    return [mapHomeTab, homeTab, ...contentHomeTabs.filter((tab) => tab.id !== homeTab.id)];
  }, [homeCategory]);

  const currentChannel = getContentIdByCategory(selectedCategory);
  const activeTheme = homeThemes[viewMode === 'map' ? 'map' : currentChannel];
  const isNightlifeTheme = viewMode === 'video' && currentChannel === 'nightlife';
  const isMedicalTheme = viewMode === 'video' && currentChannel === 'medical';
  const isFoodTheme = viewMode === 'video' && currentChannel === 'food';
  const themedPillStyle: CSSProperties = {
    backgroundColor: activeTheme.topBg,
    borderColor: isFoodTheme ? 'rgba(255,255,255,0.18)' : activeTheme.border,
    boxShadow: isFoodTheme
      ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 6px 18px rgba(0,0,0,0.18)'
      : isMedicalTheme
      ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 6px 18px rgba(0,0,0,0.18)'
      : isNightlifeTheme
      ? '0 0 10px rgba(192,43,255,0.25), inset 0 0 12px rgba(255,255,255,0.04)'
      : `0 4px 14px rgba(0,0,0,0.18), 0 0 14px ${activeTheme.primaryGlow}`,
    backdropFilter: isNightlifeTheme || isMedicalTheme || isFoodTheme ? 'blur(14px)' : undefined,
  };
  const themedIconStyle: CSSProperties = {
    color: activeTheme.primary,
    filter: isFoodTheme
      ? 'drop-shadow(0 0 6px rgba(95,224,181,0.42))'
      : isMedicalTheme
      ? 'none'
      : isNightlifeTheme
      ? 'drop-shadow(0 0 8px rgba(192,43,255,0.8))'
      : `drop-shadow(0 0 8px ${activeTheme.primaryGlow})`,
  };
  const foodOverlay =
    'linear-gradient(to bottom, rgba(4,8,6,0.52) 0%, rgba(4,8,6,0.14) 36%, rgba(4,8,6,0.24) 66%, rgba(4,8,6,0.78) 100%)';
  const nightlifeOverlay =
    'linear-gradient(to bottom, rgba(3,5,15,0.72) 0%, rgba(3,5,15,0.24) 35%, rgba(3,5,15,0.32) 60%, rgba(3,5,15,0.82) 100%), radial-gradient(circle at 78% 14%, rgba(192,43,255,0.28), transparent 34%), radial-gradient(circle at 20% 52%, rgba(46,219,255,0.12), transparent 30%)';

  const preloadVideo = (index: number) => {
    const store = filteredStores[index];
    if (!store) return null;

    setPreloadIndexes((previous) => {
      if (previous.has(index)) return previous;
      const next = new Set(previous);
      next.add(index);
      return next;
    });

    const video = videoRefs.current.get(index);
    if (!video) return null;

    if (!video.getAttribute('src')) {
      video.src = store.videoUrl;
      video.preload = 'auto';
      video.load();
    }
    return video;
  };

  const releaseVideo = (index: number) => {
    setPreloadIndexes((previous) => {
      if (!previous.has(index)) return previous;
      const next = new Set(previous);
      next.delete(index);
      return next;
    });

    const video = videoRefs.current.get(index);
    if (!video) return;
    disposePreloadVideo(video);
  };

  const preloadNextChannel = (channelId: ContentCategoryId) => {
    const currentTabIndex = orderedHomeTabs.findIndex((tab) => tab.type === 'content' && tab.id === channelId);
    const nextTab = orderedHomeTabs.slice(currentTabIndex + 1).find((tab) => tab.type === 'content');
    if (!nextTab) return null;

    const nextCategory = categories[nextTab.categoryIndex];
    const nextStores = stores.filter((store) => store.category === nextCategory);
    const nextIndex = Math.min(currentIndex, Math.max(0, nextStores.length - 1));
    const store = nextStores[nextIndex];
    if (!store) return null;

    const key = `channel:${nextTab.id}:${nextIndex}`;
    const existing = preloadedVideosRef.current.get(key);
    if (existing?.storeId === store.id) return existing.video;

    if (existing) {
      disposePreloadVideo(existing.video);
      preloadedVideosRef.current.delete(key);
    }

    const video = createPreloadVideo(store);
    preloadedVideosRef.current.set(key, {
      video,
      storeId: store.id,
      channelId: nextTab.id,
      index: nextIndex,
      kind: 'channel',
    });
    return video;
  };

  const updatePreloadWindow = (nextIndex: number, nextChannel: ContentCategoryId) => {
    if (viewMode === 'map') {
      preloadedVideosRef.current.forEach((entry) => disposePreloadVideo(entry.video));
      preloadedVideosRef.current.clear();
      return;
    }

    const keepIndexes = new Set<number>();
    getPreloadOffsets().forEach((offset) => {
      const preloadIndex = nextIndex + offset;
      if (preloadIndex < 0 || preloadIndex >= filteredStores.length) return;
      keepIndexes.add(preloadIndex);
      preloadVideo(preloadIndex);
    });

    setPreloadIndexes(keepIndexes);

    videoRefs.current.forEach((video, index) => {
      if (keepIndexes.has(index)) return;
      disposePreloadVideo(video);
    });

    const keepChannelKeys = new Set<string>();
    const nextChannelVideo = preloadNextChannel(nextChannel);
    if (nextChannelVideo) {
      preloadedVideosRef.current.forEach((entry, key) => {
        if (entry.kind === 'channel' && entry.video === nextChannelVideo) keepChannelKeys.add(key);
      });
    }

    preloadedVideosRef.current.forEach((entry, key) => {
      if (keepChannelKeys.has(key)) return;
      disposePreloadVideo(entry.video);
      preloadedVideosRef.current.delete(key);
    });
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedTag(null);
    setCurrentIndex(0);
    setIsPaused(false);
    setViewMode('video');
    setIsSearchOpen(false);
    setShowFavoritesSheet(false);
  };

  const handleHomeTabSelect = (tabIndex: number) => {
    const normalizedIndex = (tabIndex + orderedHomeTabs.length) % orderedHomeTabs.length;
    const tab = orderedHomeTabs[normalizedIndex];

    setIsSearchOpen(false);
    setShowFavoritesSheet(false);

    if (tab.type === 'map') {
      setViewMode('map');
      setIsPaused(true);
      return;
    }

    const nextCategory = categories[tab.categoryIndex];
    setViewMode('video');
    setSelectedCategory(nextCategory);
    setSelectedTag(null);
    setCurrentIndex(0);
    setIsPaused(false);
  };

  const handleSetHomeCategory = (categoryId: ContentCategoryId | 'map') => {
    if (categoryId === 'map') return;
    const nextCategory = getCategoryByContentId(categoryId);

    setHomeCategory(categoryId);
    window.localStorage.setItem('tanmapHomeCategory', categoryId);
    setViewMode('video');
    setSelectedCategory(nextCategory);
    setSelectedTag(null);
    setCurrentIndex(0);
    setIsPaused(false);
    setIsSearchOpen(false);
    setShowFavoritesSheet(false);
  };

  const handleTouchStart = (event: TouchEvent) => {
    touchStartY.current = event.touches[0].clientY;
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const diffY = touchStartY.current - event.changedTouches[0].clientY;
    const diffX = touchStartX.current - event.changedTouches[0].clientX;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 52) {
      const nextTabIndex = diffX > 0 ? activeHomeTabIndex + 1 : activeHomeTabIndex - 1;
      handleHomeTabSelect(nextTabIndex);
      return;
    }

    if (viewMode !== 'video') return;
  };

  const toggleSave = (storeId: string) => {
    setSavedStores((previous) => {
      const next = new Set(previous);
      if (next.has(storeId)) {
        next.delete(storeId);
        toast.success(t('removedFavorite'));
      } else {
        next.add(storeId);
        toast.success(t('addedFavorite'));
      }
      return next;
    });
  };

  const shareStore = async () => {
    const shareUrl = `${window.location.origin}${import.meta.env.BASE_URL}?share=${currentStore.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t('shareCopied'));
    } catch {
      toast.error(t('copyFailed'));
    }
  };

  const handleStoreSelectFromSearch = (storeId: string) => {
    setIsSearchOpen(false);
    const storeIndex = filteredStores.findIndex((store) => store.id === storeId);
    if (storeIndex !== -1) setCurrentIndex(storeIndex);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setCurrentIndex(0);
    setIsSearchOpen(false);
    setTagSearch('');
    setRecentSearches((previous) => (previous.includes(tag) ? previous : [tag, ...previous.slice(0, 4)]));
  };

  const handleMapToggle = () => {
    if (viewMode === 'map') {
      setViewMode('video');
      setIsPaused(false);
      return;
    }

    setViewMode('map');
    setIsPaused(true);
  };

  const handleOpenFavorites = () => {
    setIsSearchOpen(false);
    setShowFavoritesSheet(true);
  };

  const handleOpenSearch = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      setShowFavoritesSheet(false);
      setViewMode('video');
      setIsPaused(false);
      navigate('/', { replace: true });
      return;
    }
    setShowFavoritesSheet(false);
    setViewMode('video');
    setIsSearchOpen(true);
  };

  const handleTagSearch = (tag: string) => {
    setShowFavoritesSheet(false);
    setViewMode('video');
    setIsSearchOpen(true);
    setTagSearch(tag);
  };

  const handleOpenMap = () => {
    if (isSearchOpen || showFavoritesSheet) {
      setIsSearchOpen(false);
      setShowFavoritesSheet(false);
      setViewMode('video');
      setIsPaused(false);
      navigate('/', { replace: true });
      return;
    }
    handleMapToggle();
  };

  const handleGoHere = () => {
    if (viewMode === 'map') {
      setIsSearchOpen(false);
      setShowFavoritesSheet(false);
      setViewMode('video');
      setIsPaused(false);
      navigate('/', { replace: true });
      return;
    }
    setIsSearchOpen(false);
    setShowFavoritesSheet(false);
    setViewMode('map');
    setIsPaused(true);
  };

  const handleOpenMore = () => {
    navigate('/more');
  };

  const handleOpenService = () => {
    navigate('/services');
  };

  const handleOpenCommunity = () => {
    navigate('/forum');
  };

  const handleVideoPlay = (index: number) => {
    const video = videoRefs.current.get(index);
    if (!video || viewMode !== 'video') return;

    video.muted = isMuted;
    video.play().catch(() => {
      setIsPaused(true);
    });
  };

  const handleVideoPause = (index: number) => {
    videoRefs.current.get(index)?.pause();
  };

  const handleVideoChange = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    setVideoProgress(0);
    setIsPaused(false);
  };

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || isScrubbing) return;
    setVideoProgress((video.currentTime / video.duration) * 100);
  };

  const handleVideoSeek = (value: number) => {
    const video = videoRef.current;
    setVideoProgress(value);
    if (!video || !video.duration) return;
    video.currentTime = (video.duration * value) / 100;
  };

  const activeHomeTabIndex =
    viewMode === 'map'
      ? 0
      : Math.max(1, orderedHomeTabs.findIndex((tab) => tab.type === 'content' && categories[tab.categoryIndex] === selectedCategory));

  useEffect(() => {
    videoRef.current = videoRefs.current.get(currentIndex) ?? null;
  }, [currentIndex, filteredStores]);

  useEffect(() => {
    if (viewMode !== 'video') return;
    videoRefs.current.forEach((video, index) => {
      video.muted = isMuted;
      if (index === currentIndex && !isPaused) {
        handleVideoPlay(index);
      } else {
        handleVideoPause(index);
      }
    });
  }, [currentIndex, isMuted, isPaused, viewMode, preloadIndexes]);

  useEffect(() => {
    if (viewMode !== 'video') return;
    const container = scrollContainerRef.current;
    const activeItem = itemRefs.current.get(currentIndex);
    if (!container || !activeItem) return;

    const expectedTop = currentIndex * container.clientHeight;
    if (Math.abs(container.scrollTop - expectedTop) < 3) return;
    activeItem.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [currentIndex, selectedCategory, viewMode]);

  useEffect(() => {
    if (viewMode !== 'video') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.7) return;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isNaN(index)) return;
          handleVideoChange(index);
        });
      },
      {
        root: scrollContainerRef.current,
        threshold: [0, 0.7, 1],
      }
    );

    itemRefs.current.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [filteredStores, viewMode, currentIndex]);

  useEffect(() => {
    updatePreloadWindow(currentIndex, currentChannel);
  }, [currentIndex, currentChannel, filteredStores, orderedHomeTabs, viewMode]);

  useEffect(() => {
    return () => {
      preloadedVideosRef.current.forEach((entry) => disposePreloadVideo(entry.video));
      preloadedVideosRef.current.clear();
    };
  }, []);

  return (
    <main
      className="tan-mobile-frame h-dvh bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        {viewMode === 'video' ? (
          <motion.div
            key={`video-feed-${selectedCategory}`}
            className="absolute inset-0"
            initial={{ opacity: 0.55, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
          >
            <div
              ref={scrollContainerRef}
              className="h-full w-full snap-y snap-mandatory overflow-y-scroll overscroll-contain tan-scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {filteredStores.map((store, index) => {
                const shouldLoadVideo = preloadIndexes.has(index);

                return (
                  <section
                    key={`${store.id}-${selectedCategory}`}
                    ref={(node) => {
                      if (node) {
                        itemRefs.current.set(index, node);
                      } else {
                        itemRefs.current.delete(index);
                      }
                    }}
                    data-index={index}
                    className="relative h-dvh w-full snap-start snap-always overflow-hidden bg-black"
                  >
                    <video
                      ref={(node) => {
                        if (node) {
                          videoRefs.current.set(index, node);
                          if (index === currentIndex) videoRef.current = node;
                        } else {
                          videoRefs.current.delete(index);
                        }
                      }}
                      src={shouldLoadVideo ? store.videoUrl : undefined}
                      className="absolute left-0 top-0 h-full w-full object-cover"
                      muted={isMuted}
                      loop
                      playsInline
                      autoPlay={index === currentIndex && !isPaused}
                      preload={shouldLoadVideo ? 'auto' : 'none'}
                      onTimeUpdate={index === currentIndex ? handleVideoTimeUpdate : undefined}
                      onLoadedMetadata={index === currentIndex ? handleVideoTimeUpdate : undefined}
                      onClick={() => {
                        if (index === currentIndex) setIsPaused((previous) => !previous);
                      }}
                    />
                  </section>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="embedded-map"
            className="absolute inset-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.24 }}
          >
            <EmbeddedMapView activeStoreId={currentStore.id} />
          </motion.div>
        )}
      </AnimatePresence>

      {viewMode === 'video' && isPaused && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              aria-label={isMuted ? t('unmuteVideo') : t('muteVideo')}
              onClick={(event) => {
                event.stopPropagation();
                setIsMuted((previous) => !previous);
              }}
              className="tan-pressable pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-white/22 bg-black/36 text-white backdrop-blur-md transition-all duration-[180ms]"
              style={{
                borderColor: activeTheme.border,
                background: isFoodTheme
                  ? 'rgba(20,22,20,0.58)'
                  : isMedicalTheme
                  ? 'rgba(80,48,52,0.52)'
                  : isNightlifeTheme
                  ? 'rgba(25,12,45,0.72)'
                  : undefined,
                backdropFilter: isMedicalTheme || isFoodTheme ? 'blur(16px)' : undefined,
                boxShadow: isFoodTheme
                  ? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 22px rgba(0,0,0,0.28)'
                  : isMedicalTheme
                  ? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 22px rgba(0,0,0,0.26)'
                  : isNightlifeTheme
                  ? '0 0 12px rgba(255,79,216,0.75), 0 0 26px rgba(106,92,255,0.55), inset 0 0 18px rgba(255,255,255,0.08)'
                  : `0 0 22px ${activeTheme.primaryGlow}`,
              }}
            >
              {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>
            <button
              type="button"
              aria-label={t('playVideo')}
              onClick={(event) => {
                event.stopPropagation();
                setIsPaused(false);
              }}
              className="tan-pressable pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-white/22 bg-black/36 text-white backdrop-blur-md transition-all duration-[180ms]"
              style={{
                borderColor: activeTheme.border,
                background: isFoodTheme
                  ? 'rgba(20,22,20,0.58)'
                  : isMedicalTheme
                  ? 'rgba(80,48,52,0.52)'
                  : isNightlifeTheme
                  ? 'rgba(25,12,45,0.72)'
                  : undefined,
                backdropFilter: isMedicalTheme || isFoodTheme ? 'blur(16px)' : undefined,
                boxShadow: isFoodTheme
                  ? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 22px rgba(0,0,0,0.28)'
                  : isMedicalTheme
                  ? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 22px rgba(0,0,0,0.26)'
                  : isNightlifeTheme
                  ? '0 0 12px rgba(255,79,216,0.75), 0 0 26px rgba(106,92,255,0.55), inset 0 0 18px rgba(255,255,255,0.08)'
                  : `0 0 24px ${activeTheme.primaryGlow}`,
              }}
            >
              <Play size={24} fill="white" />
            </button>
          </div>
        </div>
      )}

      {!isSearchOpen && (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78),rgba(0,0,0,0.12)_44%,rgba(0,0,0,0.46)_100%)] transition-opacity duration-[220ms]"
            style={
              isNightlifeTheme
                ? { backgroundImage: nightlifeOverlay }
                : isFoodTheme
                ? { backgroundImage: foodOverlay }
                : undefined
            }
          />
          <header className="absolute inset-x-0 top-0 z-40 px-5 pt-[calc(12px+env(safe-area-inset-top))]">
            <div className="flex min-h-8 items-center gap-2">
              {viewMode === 'map' ? (
                <span className="h-9 w-20" aria-hidden="true" />
              ) : (
                <h1
                  className="shrink-0 text-[22px] font-extrabold leading-none tracking-normal text-[#79E5C4] drop-shadow-lg"
                  style={
                    isNightlifeTheme
                      ? {
                          color: '#F0ABFC',
                          WebkitTextFillColor: '#F0ABFC',
                          textShadow: '0 0 8px rgba(192,43,255,0.8), 0 0 18px rgba(46,219,255,0.45)',
                        }
                      : isMedicalTheme
                      ? {
                          background: 'linear-gradient(135deg, #F3D6C8 0%, #E8B4B8 42%, #C98F8F 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textShadow: '0 1px 2px rgba(0,0,0,0.22)',
                        }
                      : isFoodTheme
                      ? {
                          background: 'linear-gradient(135deg, #8FF3D0 0%, #5FE0B5 48%, #48D6A0 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textShadow: '0 1px 2px rgba(0,0,0,0.24)',
                        }
                      : {
                          color: activeTheme.logo,
                          textShadow: `0 0 14px ${activeTheme.logoGlow}`,
                        }
                  }
                >
                  Tanmap
                </h1>
              )}
              {viewMode === 'map' ? (
                <span className="ml-auto h-9 w-20" aria-hidden="true" />
              ) : (
                <div className="ml-auto flex min-w-0 max-w-[calc(100vw-128px)] items-center justify-end gap-1 overflow-x-auto tan-scrollbar-hide">
                  <button
                    type="button"
                    onClick={handleOpenCommunity}
                    className="tan-pressable h-7 shrink-0 rounded-full border border-white/20 bg-black/14 px-2 text-[11px] font-semibold text-white/92 shadow-[0_4px_14px_rgba(0,0,0,0.18)] backdrop-blur-md min-[410px]:h-8 min-[410px]:px-2.5 min-[410px]:text-[12px]"
                    style={themedPillStyle}
                  >
                    {t('exploreBar')}
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenService}
                    className="tan-pressable h-7 shrink-0 rounded-full border border-white/20 bg-black/14 px-2 text-[11px] font-semibold text-white/92 shadow-[0_4px_14px_rgba(0,0,0,0.18)] backdrop-blur-md min-[410px]:h-8 min-[410px]:px-2.5 min-[410px]:text-[12px]"
                    style={themedPillStyle}
                  >
                    {t('variousServices')}
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenMore}
                    className="tan-pressable h-7 shrink-0 rounded-full border border-white/20 bg-black/14 px-2 text-[11px] font-semibold text-white/92 shadow-[0_4px_14px_rgba(0,0,0,0.18)] backdrop-blur-md min-[410px]:h-8 min-[410px]:px-2.5 min-[410px]:text-[12px]"
                    style={themedPillStyle}
                  >
                    {t('homeMy')}
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenFavorites}
                    className="tan-pressable h-7 shrink-0 rounded-full border border-white/20 bg-black/14 px-2 text-[11px] font-semibold text-white/92 shadow-[0_4px_14px_rgba(0,0,0,0.18)] backdrop-blur-md min-[410px]:h-8 min-[410px]:px-2.5 min-[410px]:text-[12px]"
                    style={themedPillStyle}
                  >
                    {t('favoritesFolder')}
                  </button>
                  <button
                    type="button"
                    aria-label={t('search')}
                    onClick={handleOpenSearch}
                    className="tan-pressable grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/24 bg-black/14 text-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] backdrop-blur-md min-[410px]:h-8 min-[410px]:w-8"
                    style={themedPillStyle}
                  >
                    <Search size={16} strokeWidth={1.9} />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-[22px_1fr_22px] items-center gap-1 text-white">
              <button
                type="button"
                aria-label={t('previousCategory')}
                onClick={() => handleHomeTabSelect(activeHomeTabIndex - 1)}
                className="tan-pressable grid h-7 w-6 place-items-center text-white/62"
                style={themedIconStyle}
              >
                <ChevronLeft size={23} strokeWidth={2.1} />
              </button>
              <nav className="grid grid-cols-4 items-start" aria-label="Tanmap categories">
                {orderedHomeTabs.map((tab, index) => {
                  const isActive = activeHomeTabIndex === index;
                  const isContentTab = tab.type === 'content';
                  const isHomeCategory = isContentTab && tab.id === homeCategory;

                  return (
                    <div
                      key={tab.id}
                      className="relative flex h-11 flex-col items-center justify-start"
                    >
                      <button
                        type="button"
                        onClick={() => handleHomeTabSelect(index)}
                        className={`tan-pressable flex h-8 flex-col items-center justify-start text-[15px] font-semibold tracking-normal ${
                          isActive ? 'text-white' : 'text-white/60'
                        }`}
                        style={
                          isActive
                            ? {
                                color: isFoodTheme ? '#FFFFFF' : isMedicalTheme ? '#F3D6C8' : undefined,
                                fontWeight: isFoodTheme ? 700 : undefined,
                                textShadow: isFoodTheme || isMedicalTheme
                                  ? 'none'
                                  : isNightlifeTheme
                                  ? '0 0 8px rgba(255,79,216,0.9), 0 0 14px rgba(106,92,255,0.7)'
                                  : `0 0 12px ${activeTheme.primaryGlow}`,
                              }
                            : isFoodTheme
                            ? { color: 'rgba(255,255,255,0.62)', fontWeight: 600 }
                            : isMedicalTheme
                            ? { color: 'rgba(255,255,255,0.68)' }
                            : undefined
                        }
                      >
                        <span>{t(tab.labelKey)}</span>
                        {isActive && (
                          <motion.span
                            layoutId="home-category-underline"
                            className="mt-1 h-0.5 w-8 rounded-full bg-[#62E0B0] shadow-[0_0_12px_rgba(98,224,176,0.7)]"
                            style={{
                              height: isNightlifeTheme || isFoodTheme ? 3 : undefined,
                              background: isFoodTheme
                                ? 'linear-gradient(90deg, #8FF3D0, #5FE0B5, #48D6A0)'
                                : isMedicalTheme
                                ? 'linear-gradient(90deg, #F3D6C8, #E8B4B8, #C98F8F)'
                                : isNightlifeTheme
                                ? 'linear-gradient(90deg, #FF4FD8, #C02BFF, #2EDBFF)'
                                : activeTheme.primary,
                              boxShadow: isFoodTheme
                                ? '0 0 8px rgba(95,224,181,0.35)'
                                : isMedicalTheme
                                ? 'none'
                                : isNightlifeTheme
                                ? '0 0 8px rgba(192,43,255,0.9), 0 0 16px rgba(46,219,255,0.45)'
                                : `0 0 14px ${activeTheme.primaryGlow}`,
                            }}
                            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                          />
                        )}
                      </button>
                      {viewMode === 'video' && isPaused && isContentTab && (
                        <button
                          type="button"
                          aria-label={`${t('setHomeCategory')}: ${t(tab.labelKey)}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSetHomeCategory(tab.id);
                          }}
                          className={`tan-pressable absolute top-7 grid h-5 w-5 place-items-center rounded-full transition-colors ${
                            isHomeCategory
                              ? 'text-[#62E0B0] drop-shadow-[0_0_8px_rgba(98,224,176,0.75)]'
                              : 'text-white/72'
                          }`}
                          style={
                            isHomeCategory
                              ? isFoodTheme
                                ? {
                                    color: '#5FE0B5',
                                    fill: '#5FE0B5',
                                    filter: 'drop-shadow(0 0 6px rgba(95,224,181,0.42))',
                                    transform: 'scale(1.06)',
                                  }
                                : isMedicalTheme
                                ? {
                                    color: '#E8B4B8',
                                    filter: 'none',
                                  }
                                : isNightlifeTheme
                                ? {
                                    color: '#FF4FD8',
                                    filter: 'drop-shadow(0 0 8px rgba(255,79,216,0.95))',
                                    transform: 'scale(1.08)',
                                  }
                                : themedIconStyle
                              : isFoodTheme
                              ? { color: 'rgba(255,255,255,0.58)', fill: 'rgba(255,255,255,0.58)', filter: 'none' }
                              : isMedicalTheme
                              ? { color: 'rgba(255,255,255,0.62)' }
                              : isNightlifeTheme
                              ? { color: 'rgba(255,255,255,0.58)' }
                              : undefined
                          }
                        >
                          <House size={14} fill="currentColor" strokeWidth={2} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </nav>
              <button
                type="button"
                aria-label={t('nextCategory')}
                onClick={() => handleHomeTabSelect(activeHomeTabIndex + 1)}
                className="tan-pressable grid h-7 w-6 place-items-center text-white/62"
                style={themedIconStyle}
              >
                <ChevronRight size={23} strokeWidth={2.1} />
              </button>
            </div>
          </header>

          {viewMode === 'video' && (
            <section className="absolute inset-x-0 bottom-[calc(18px+env(safe-area-inset-bottom))] z-30 px-3">
              <div className="mb-4 max-w-[82%]">
                <h2
                  className="mb-1 truncate text-[26px] font-extrabold leading-tight tracking-normal text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.45)]"
                  style={{
                    color: '#FFFFFF',
                    textShadow: isFoodTheme
                      ? '0 2px 8px rgba(0,0,0,0.48)'
                      : isMedicalTheme
                      ? 'none'
                      : isNightlifeTheme
                      ? '0 0 10px rgba(192,43,255,0.75), 0 0 18px rgba(46,219,255,0.28)'
                      : `0 0 14px ${activeTheme.primaryGlow}`,
                  }}
                >
                  {displayStore.name}
                </h2>
                <p className="mb-1.5 flex items-center gap-1.5 truncate text-[12px] font-medium text-white/82">
                  <MapPin
                    size={14}
                    className="shrink-0"
                    style={
                      isFoodTheme
                        ? { color: '#5FE0B5', filter: 'none' }
                        : isMedicalTheme
                        ? { color: '#E8B4B8', filter: 'none' }
                        : isNightlifeTheme
                        ? { color: '#C02BFF', filter: 'drop-shadow(0 0 6px rgba(192,43,255,0.8))' }
                        : themedIconStyle
                    }
                  />
                  <span className="truncate">{displayStore.address}</span>
                </p>
                {displayStore.description && (
                  <p
                    className="mb-2 line-clamp-1 text-[12px] font-medium text-white/78"
                    style={
                      isFoodTheme
                        ? { color: 'rgba(255,255,255,0.78)', lineHeight: 1.45 }
                        : isMedicalTheme
                        ? { color: 'rgba(255,255,255,0.76)' }
                        : undefined
                    }
                  >
                    {displayStore.description}
                  </p>
                )}
                <div className="flex gap-3 overflow-x-auto tan-scrollbar-hide">
                  {displayStore.tags.slice(0, 4).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagSearch(tag)}
                      className="tan-pressable shrink-0 py-0.5 text-[13px] font-semibold text-white/88 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
                      style={
                        isNightlifeTheme
                          ? {
                              color: '#EACBFF',
                              border: '1px solid rgba(192,43,255,0.45)',
                              background: 'rgba(20,10,40,0.36)',
                              boxShadow: '0 0 8px rgba(192,43,255,0.22)',
                              borderRadius: 8,
                              paddingInline: 8,
                            }
                          : isMedicalTheme
                          ? {
                              color: '#F3D6C8',
                              border: '1px solid rgba(232,180,184,0.34)',
                              background: 'rgba(80,48,52,0.32)',
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                              borderRadius: 8,
                              paddingInline: 8,
                            }
                          : isFoodTheme
                          ? {
                              color: 'rgba(255,255,255,0.92)',
                              border: '1px solid rgba(95,224,181,0.38)',
                              background: 'rgba(8,12,10,0.36)',
                              boxShadow: 'none',
                              backdropFilter: 'blur(10px)',
                              borderRadius: 999,
                              paddingInline: 8,
                            }
                          : {
                              color: activeTheme.primary,
                              textShadow: `0 0 10px ${activeTheme.primaryGlow}`,
                            }
                      }
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                {isPaused && (
                  <div className="relative -ml-3 mt-2 w-screen py-2">
                    <div
                      className={`relative rounded-full bg-white/22 transition-all duration-150 ${
                        isScrubbing ? 'h-1.5' : 'h-0.5'
                      }`}
                      style={{ backgroundColor: activeTheme.lineTrack }}
                    >
                      <div
                        className="h-full rounded-full bg-[#66E1AA]"
                        style={{
                          width: `${Math.min(100, Math.max(0, videoProgress))}%`,
                          background: isFoodTheme
                            ? 'linear-gradient(90deg, #8FF3D0, #5FE0B5, #48D6A0)'
                            : isMedicalTheme
                            ? 'linear-gradient(90deg, #F3D6C8, #E8B4B8, #C98F8F)'
                            : isNightlifeTheme
                            ? 'linear-gradient(90deg, #FF4FD8, #C02BFF, #2EDBFF)'
                            : activeTheme.primary,
                          boxShadow: isFoodTheme
                            ? '0 0 8px rgba(95,224,181,0.42)'
                            : isMedicalTheme
                            ? 'none'
                            : isNightlifeTheme
                            ? '0 0 10px rgba(192,43,255,0.8)'
                            : `0 0 12px ${activeTheme.primaryGlow}`,
                        }}
                      />
                      {(isNightlifeTheme || isMedicalTheme || isFoodTheme) && (
                        <span
                          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
                          style={{
                            left: `calc(${Math.min(100, Math.max(0, videoProgress))}% - 5px)`,
                            backgroundColor: isFoodTheme ? '#5FE0B5' : isMedicalTheme ? '#E8B4B8' : '#FF4FD8',
                            boxShadow: isFoodTheme
                              ? '0 0 8px rgba(95,224,181,0.55)'
                              : isMedicalTheme
                              ? '0 1px 4px rgba(0,0,0,0.22)'
                              : '0 0 10px rgba(255,79,216,0.85)',
                          }}
                        />
                      )}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={videoProgress}
                      aria-label={t('videoProgress')}
                      onPointerDown={() => setIsScrubbing(true)}
                      onPointerUp={() => setIsScrubbing(false)}
                      onPointerCancel={() => setIsScrubbing(false)}
                      onChange={(event) => handleVideoSeek(Number(event.currentTarget.value))}
                      className="absolute inset-x-0 top-0 h-5 w-full cursor-pointer opacity-0"
                    />
                  </div>
                )}
              </div>

              <div
                className="grid h-[56px] grid-cols-[minmax(0,1fr)_116px_minmax(0,1fr)] items-center gap-1.5 rounded-[18px] border border-white/22 bg-black/24 px-2 shadow-[0_10px_28px_rgba(0,0,0,0.26)] backdrop-blur-md min-[390px]:grid-cols-[minmax(0,1fr)_124px_minmax(0,1fr)]"
                style={{
                  borderColor: isFoodTheme ? 'rgba(255,255,255,0.16)' : activeTheme.border,
                  borderRadius: isFoodTheme ? 24 : undefined,
                  background: isFoodTheme
                    ? 'rgba(8,12,10,0.68)'
                    : isMedicalTheme
                    ? 'rgba(18,14,16,0.56)'
                    : isNightlifeTheme
                    ? 'rgba(5,7,18,0.74)'
                    : undefined,
                  backdropFilter: isNightlifeTheme || isMedicalTheme || isFoodTheme ? 'blur(18px)' : undefined,
                  boxShadow: isFoodTheme
                    ? '0 10px 28px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : isMedicalTheme
                    ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 24px rgba(0,0,0,0.22)'
                    : isNightlifeTheme
                    ? '0 0 16px rgba(192,43,255,0.35), inset 0 0 16px rgba(255,255,255,0.04)'
                    : `0 10px 28px rgba(0,0,0,0.26), 0 0 18px ${activeTheme.primaryGlow}`,
                }}
              >
                <div className="flex min-w-0 items-center gap-1.5 text-white">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#62E0B0]/18 text-[#62E0B0]"
                    style={{
                      background: isFoodTheme
                        ? 'rgba(95,224,181,0.18)'
                        : isMedicalTheme
                        ? 'linear-gradient(135deg, #F3D6C8 0%, #E8B4B8 58%, #C98F8F 100%)'
                        : isNightlifeTheme
                        ? 'radial-gradient(circle, #2EDBFF 0%, #6A5CFF 55%, #1A0C3D 100%)'
                        : activeTheme.iconSoft,
                      border: isFoodTheme ? '1px solid rgba(95,224,181,0.34)' : undefined,
                      color: isMedicalTheme ? '#4A2D31' : activeTheme.primary,
                      boxShadow: isFoodTheme
                        ? 'none'
                        : isMedicalTheme
                        ? '0 6px 14px rgba(0,0,0,0.18)'
                        : isNightlifeTheme
                        ? '0 0 14px rgba(46,219,255,0.7)'
                        : `0 0 12px ${activeTheme.primaryGlow}`,
                    }}
                  >
                    <MapPin size={21} fill="currentColor" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[18px] font-extrabold leading-none">{displayStore.distance}km</span>
                    <span className="mt-0.5 block truncate text-[10px] text-white/66">
                      {t('approxSevenMinuteWalk')}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGoHere}
                  className="tan-pressable flex h-11 items-center justify-center gap-1.5 rounded-full bg-[#66E1AA] text-[16px] font-extrabold text-[#073238] shadow-[0_10px_24px_rgba(102,225,170,0.22)]"
                  style={{
                    background: activeTheme.buttonBg,
                    color: activeTheme.buttonText,
                    border: isNightlifeTheme || isFoodTheme ? '1px solid rgba(255,255,255,0.28)' : undefined,
                    animation: isNightlifeTheme ? 'tan-nightlife-glow 260ms ease-out' : undefined,
                    boxShadow: isFoodTheme
                      ? 'inset 0 1px 0 rgba(255,255,255,0.38), 0 8px 20px rgba(0,0,0,0.24)'
                      : isMedicalTheme
                      ? 'inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 18px rgba(0,0,0,0.22)'
                      : isNightlifeTheme
                      ? '0 0 14px rgba(192,43,255,0.85), 0 0 28px rgba(255,79,216,0.45), inset 0 1px 1px rgba(255,255,255,0.35)'
                      : `0 10px 24px ${activeTheme.primaryGlow}`,
                  }}
                >
                  {t('goHere')}
                  <Send size={18} fill="currentColor" />
                </button>
                <div className="flex min-w-0 justify-end gap-0.5">
                  <button
                    type="button"
                    onClick={() => toggleSave(currentStore.id)}
                    aria-label={t('favorite')}
                    className="tan-pressable grid h-8 w-8 place-items-center text-white min-[390px]:h-9 min-[390px]:w-9"
                  >
                    <Star
                      size={21}
                      className={savedStores.has(currentStore.id) ? 'fill-[#66E1AA] text-[#66E1AA]' : ''}
                      style={
                        isFoodTheme
                          ? {
                              color: savedStores.has(currentStore.id) ? '#5FE0B5' : 'rgba(255,255,255,0.86)',
                              fill: savedStores.has(currentStore.id) ? '#5FE0B5' : 'transparent',
                              filter: 'none',
                            }
                          : isMedicalTheme
                          ? {
                              color: '#E8B4B8',
                              fill: savedStores.has(currentStore.id) ? '#E8B4B8' : 'transparent',
                              filter: 'none',
                            }
                          : isNightlifeTheme
                          ? {
                              color: '#2EDBFF',
                              fill: savedStores.has(currentStore.id) ? '#2EDBFF' : 'transparent',
                              filter: 'drop-shadow(0 0 8px rgba(46,219,255,0.8))',
                            }
                          : savedStores.has(currentStore.id)
                          ? { ...themedIconStyle, fill: activeTheme.primary }
                          : themedIconStyle
                      }
                    />
                  </button>
                  <button
                    type="button"
                    onClick={shareStore}
                    aria-label={t('share')}
                    className="tan-pressable grid h-8 w-8 place-items-center text-white min-[390px]:h-9 min-[390px]:w-9"
                  >
                    <Share2
                      size={21}
                      style={isFoodTheme ? { color: 'rgba(255,255,255,0.9)' } : isNightlifeTheme || isMedicalTheme ? { color: '#FFFFFF' } : themedIconStyle}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenMore}
                    aria-label={t('more')}
                    className="tan-pressable grid h-8 w-8 place-items-center text-white min-[390px]:h-9 min-[390px]:w-9"
                  >
                    <UsersRound
                      size={22}
                      style={isFoodTheme ? { color: 'rgba(255,255,255,0.9)' } : isNightlifeTheme || isMedicalTheme ? { color: '#FFFFFF' } : themedIconStyle}
                    />
                  </button>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <AnimatePresence>
        {showFavoritesSheet && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end justify-center bg-black/22 px-3 pb-[calc(76px+env(safe-area-inset-bottom))] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFavoritesSheet(false)}
          >
            <motion.section
              className="tan-dark-sheet max-h-[38vh] w-full max-w-[402px] overflow-hidden rounded-[24px] p-3"
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 90, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-2.5 flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-extrabold leading-tight">{t('myFavorites')}</h2>
                  <p className="mt-0.5 text-[10px] font-semibold text-white/58">
                    {t('favoritesSheetSubtitle')}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t('closeFavorites')}
                  onClick={() => setShowFavoritesSheet(false)}
                  className="tan-pressable grid h-8 w-8 place-items-center rounded-full bg-white/14 text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {savedStoreList.length > 0 ? (
                <div className="max-h-[27vh] space-y-2 overflow-y-auto pr-1 tan-scrollbar-hide">
                  {savedStoreList.map((store) => (
                    <div
                      key={store.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        const sourceStore = stores.find((item) => item.id === store.id);
                        if (sourceStore) {
                          const categoryStores = stores.filter((item) => item.category === sourceStore.category);
                          setSelectedCategory(sourceStore.category);
                          setSelectedTag(null);
                          setCurrentIndex(Math.max(0, categoryStores.findIndex((item) => item.id === store.id)));
                        }
                        setShowFavoritesSheet(false);
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter' && event.key !== ' ') return;
                        event.preventDefault();
                        const sourceStore = stores.find((item) => item.id === store.id);
                        if (sourceStore) {
                          const categoryStores = stores.filter((item) => item.category === sourceStore.category);
                          setSelectedCategory(sourceStore.category);
                          setSelectedTag(null);
                          setCurrentIndex(Math.max(0, categoryStores.findIndex((item) => item.id === store.id)));
                        }
                        setShowFavoritesSheet(false);
                      }}
                      className="tan-pressable flex w-full items-center gap-2 rounded-[16px] border border-white/14 bg-white/12 p-2 text-left"
                    >
                      <button
                        type="button"
                        aria-label={t('removedFavorite')}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleSave(store.id);
                        }}
                        className="tan-pressable grid h-8 w-8 shrink-0 place-items-center rounded-[13px] bg-[#A7FFF4]/18 text-[#A7FFF4]"
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-extrabold text-white">
                          {store.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[10px] font-semibold text-white/58">
                          {store.address}
                        </span>
                      </span>
                      <span className="rounded-full bg-white/14 px-2.5 py-0.5 text-[10px] font-bold text-[#A7FFF4]">
                        {store.distance}km
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <Heart className="mx-auto text-[#A7FFF4]" size={42} strokeWidth={1.8} />
                  <h3 className="mt-2 text-[17px] font-extrabold">{t('noFavorites')}</h3>
                  <p className="mt-1.5 text-[12px] font-semibold text-white/58">
                    {t('noFavoritesDesc')}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleCategorySelect(categories[0]);
                        setShowFavoritesSheet(false);
                      }}
                      className="tan-pressable h-9 rounded-full border border-white/18 bg-white/14 text-[12px] font-extrabold text-white"
                    >
                      {t('discoverFood')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFavoritesSheet(false)}
                      className="tan-pressable h-9 rounded-full border border-white/18 bg-white/14 text-[12px] font-extrabold text-white"
                    >
                      {t('viewHot')}
                    </button>
                  </div>
                </div>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchPage
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            selectedCategory={selectedCategory}
            tagSearch={tagSearch}
            setTagSearch={setTagSearch}
            recentSearches={recentSearches}
            filteredTags={filteredTags}
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
            filteredStores={searchFilteredStores}
            onStoreSelect={handleStoreSelectFromSearch}
          />
        )}
      </AnimatePresence>

    </main>
  );
}
