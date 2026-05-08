import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import type { TouchEvent } from 'react';
import {
  Briefcase,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Navigation,
  Play,
  Search,
  Send,
  Share2,
  Utensils,
  Video,
  WandSparkles,
  Wine,
  X,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import EmbeddedMapView from '../components/EmbeddedMapView';
import SearchPage from '../components/SearchPage';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import { categories, stores, type Category, type Store } from '../data/stores';
import { localizeStore } from '../utils/storeI18n';

type ViewMode = 'video' | 'map';

const categoryMeta = [
  { labelKey: 'food', icon: Utensils },
  { labelKey: 'beauty', icon: WandSparkles },
  { labelKey: 'nightlife', icon: Wine },
];

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('video');
  const [isPaused, setIsPaused] = useState(false);
  const [showFavoritesSheet, setShowFavoritesSheet] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedStores, setSavedStores] = useState<Set<string>>(
    () => new Set(stores.filter((store) => store.saved).map((store) => store.id))
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const shareId = searchParams.get('share');
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || viewMode !== 'video') return;

    if (isPaused) {
      video.pause();
      return;
    }

    video.play().catch(() => {
      setIsPaused(true);
    });
  }, [currentStore.id, isPaused, viewMode]);

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

  const savedStoreList = useMemo(
    () => stores.filter((store) => savedStores.has(store.id)).map((store) => getDisplayStore(store, language, t)),
    [language, savedStores, t]
  );

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedTag(null);
    setCurrentIndex(0);
    setIsPaused(true);
  };

  const handleTouchStart = (event: TouchEvent) => {
    touchStartY.current = event.touches[0].clientY;
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (viewMode !== 'video') return;

    const diffY = touchStartY.current - event.changedTouches[0].clientY;
    const diffX = touchStartX.current - event.changedTouches[0].clientX;

    if (isPaused && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 48) {
      const currentCategoryIndex = categories.indexOf(selectedCategory);
      const nextIndex =
        diffX > 0
          ? (currentCategoryIndex + 1) % categories.length
          : (currentCategoryIndex - 1 + categories.length) % categories.length;
      handleCategorySelect(categories[nextIndex]);
      return;
    }

    if (Math.abs(diffY) > 54) {
      if (diffY > 0 && currentIndex < filteredStores.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsPaused(false);
      }
      if (diffY < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setIsPaused(false);
      }
    }
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
    const shareUrl = `${window.location.origin}/?share=${currentStore.id}`;
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
    setShowFavoritesSheet(true);
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleOpenMap = () => {
    handleMapToggle();
  };

  const handleGoHere = () => {
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

  return (
    <main
      className="tan-mobile-frame h-dvh bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        {viewMode === 'video' ? (
          <motion.div
            key={`${currentStore.id}-${selectedCategory}`}
            className="absolute inset-0"
            initial={{ opacity: 0.55, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
          >
            <video
              ref={videoRef}
              src={currentStore.videoUrl}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              onClick={() => setIsPaused((previous) => !previous)}
            />
            {isPaused && (
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-black/28 text-white backdrop-blur-md">
                  <Play size={22} fill="white" />
                </span>
              </div>
            )}
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

      {viewMode === 'video' && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0.18),transparent_58%)]" />
          <header className="absolute inset-x-0 top-0 z-20 px-4 pt-[calc(18px+env(safe-area-inset-top))]">
            <div className="flex items-center justify-between">
              <h1 className="text-[23px] font-extrabold leading-none tracking-normal drop-shadow-lg">
                Tanmap
              </h1>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={t('services')}
                  onClick={handleOpenService}
                  className="tan-pressable flex h-9 items-center gap-1.5 rounded-full border border-white/12 bg-black/35 px-3 text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] backdrop-blur-md"
                >
                  <Briefcase size={15} strokeWidth={2.1} />
                  {t('services')}
                </button>
                <button
                  type="button"
                  aria-label={t('forum')}
                  onClick={handleOpenCommunity}
                  className="tan-pressable flex h-9 items-center gap-1.5 rounded-full border border-white/12 bg-black/35 px-3 text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] backdrop-blur-md"
                >
                  <MessageCircle size={15} strokeWidth={2.1} />
                  {t('forum')}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  className="tan-glass mt-4 grid grid-cols-3 rounded-[22px] p-0.5"
                  style={{ background: 'rgba(255,255,255,0.28)' }}
                >
                  {categories.map((category, index) => {
                    const meta = categoryMeta[index] ?? categoryMeta[0];
                    const Icon = meta.icon;
                    const isActive = selectedCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className={`tan-pressable relative flex h-9 items-center justify-center gap-1 rounded-[20px] text-[12px] font-extrabold ${
                          isActive ? 'text-[#0AAE9E]' : 'text-white/90'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="category-pill"
                            className="absolute inset-0 rounded-[20px] bg-white/90 shadow-[0_8px_20px_rgba(255,255,255,0.16)]"
                            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                          />
                        )}
                        <Icon className="relative" size={16} strokeWidth={2.2} />
                        <span className="relative">{t(meta.labelKey)}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          <section className="absolute bottom-[calc(82px+env(safe-area-inset-bottom))] left-4 right-3 z-20">
            <div className="mb-3 flex items-end justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h2 className="mb-2 truncate text-[20px] font-extrabold leading-tight tracking-normal">
                  {displayStore.name}
                </h2>
                <div className="mb-2 flex flex-wrap gap-1">
                  {displayStore.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/30 bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="flex items-center gap-1 text-[12px] font-semibold text-white/84">
                  <Navigation size={14} className="text-[#27D9C6]" fill="#27D9C6" />
                  <span>{displayStore.distance}km</span>
                  <span className="text-white/55">|</span>
                  <span className="truncate">{displayStore.address}</span>
                </p>
              </div>

            </div>
          </section>

          <div className="absolute bottom-[178px] right-2.5 z-30 flex flex-col items-center gap-3">
            {[
              {
                label: t('follow'),
                type: 'avatar' as const,
                action: () => toast.info(t('followSoon')),
              },
              {
                label: t('favorite'),
                type: 'icon' as const,
                icon: Heart,
                action: () => toggleSave(currentStore.id),
                active: savedStores.has(currentStore.id),
              },
              { label: t('comment'), type: 'icon' as const, icon: MessageCircle, action: () => toast.info(t('commentSoon')) },
              { label: t('share'), type: 'icon' as const, icon: Share2, action: shareStore },
            ].map((action) => {
              const Icon = action.type === 'icon' ? action.icon : null;

              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.action}
                  className="tan-pressable flex min-h-[40px] min-w-[40px] flex-col items-center gap-1 text-[10px] font-bold text-white"
                >
                  {Icon ? (
                    <Icon
                      size={21}
                      strokeWidth={2.2}
                      className={`drop-shadow-[0_3px_10px_rgba(0,0,0,0.45)] ${
                        action.active ? 'fill-white text-white' : ''
                      }`}
                    />
                  ) : (
                    <span
                      className="relative block h-8 w-8 rounded-full border border-white/70 bg-cover bg-center shadow-[0_4px_12px_rgba(0,0,0,0.32)]"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop')",
                      }}
                    >
                    </span>
                  )}
                  {action.label}
                </button>
              );
            })}
          </div>
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
                    <button
                      key={store.id}
                      type="button"
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
                      className="tan-pressable flex w-full items-center gap-2 rounded-[16px] border border-white/14 bg-white/12 p-2 text-left"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[13px] bg-[#A7FFF4]/18 text-[#A7FFF4]">
                        <Heart size={16} fill="currentColor" />
                      </span>
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
                    </button>
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
            filteredStores={filteredStores}
            onStoreSelect={handleStoreSelectFromSearch}
          />
        )}
      </AnimatePresence>

      <HomeBottomDock
        onOpenFavorites={handleOpenFavorites}
        onOpenSearch={handleOpenSearch}
        onOpenMap={handleOpenMap}
        onGoHere={handleGoHere}
        onOpenMore={handleOpenMore}
        centerIcon={viewMode === 'map' ? Video : MapPin}
        labels={{
          favorites: t('favorites'),
          search: t('search'),
          map: viewMode === 'map' ? t('video') : t('map'),
          goHere: t('goHere'),
          more: t('more'),
        }}
      />
    </main>
  );
}

function HomeBottomDock({
  onOpenFavorites,
  onOpenSearch,
  onOpenMap,
  onGoHere,
  onOpenMore,
  centerIcon: CenterIcon,
  labels,
}: {
  onOpenFavorites: () => void;
  onOpenSearch: () => void;
  onOpenMap: () => void;
  onGoHere: () => void;
  onOpenMore: () => void;
  centerIcon: LucideIcon;
  labels: {
    favorites: string;
    search: string;
    map: string;
    goHere: string;
    more: string;
  };
}) {
  return (
    <nav
      className="fixed left-1/2 bottom-[calc(10px+env(safe-area-inset-bottom))] z-[80] grid h-[56px] w-[min(calc(100%_-_22px),402px)] -translate-x-1/2 grid-cols-5 items-end rounded-full border border-white/80 bg-white/92 px-2 pb-1 pt-1 shadow-[0_10px_24px_rgba(0,0,0,0.13)] backdrop-blur-2xl"
      aria-label="home quick navigation"
    >
      <HomeDockButton icon={Heart} label={labels.favorites} onClick={onOpenFavorites} />
      <HomeDockButton icon={Search} label={labels.search} onClick={onOpenSearch} />
      <button
        type="button"
        onClick={onOpenMap}
        aria-label={labels.map}
        className="tan-pressable -mt-8 flex min-h-[70px] flex-col items-center justify-start text-[#0EA896]"
      >
        <span className="grid h-[68px] w-[68px] place-items-center rounded-full border border-white/75 bg-[radial-gradient(circle_at_35%_30%,#74F8EA,#12B8A6_56%,#078D80)] text-white shadow-[0_0_0_8px_rgba(18,184,166,0.16),0_0_28px_rgba(18,184,166,0.56),0_10px_22px_rgba(0,0,0,0.18)]">
          <CenterIcon size={28} fill={CenterIcon === MapPin ? 'white' : 'none'} strokeWidth={2.25} />
        </span>
        <span className="-mt-5 text-[11px] font-extrabold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.38)]">
          {labels.map}
        </span>
      </button>
      <HomeDockButton icon={Send} label={labels.goHere} onClick={onGoHere} />
      <HomeDockButton icon={MoreHorizontal} label={labels.more} onClick={onOpenMore} />
    </nav>
  );
}

function HomeDockButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tan-pressable flex min-h-[48px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-[17px] text-[#5F6673]"
    >
      <Icon size={22} strokeWidth={2.05} />
      <span className="text-[10px] font-extrabold leading-none">{label}</span>
    </button>
  );
}
