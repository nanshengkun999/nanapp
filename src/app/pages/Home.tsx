import { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Heart, Map, Share2, Search, X, Video, MessageSquare, MoreVertical, MapPin, Utensils, Syringe, Wine } from 'lucide-react';
import { stores, categories, type Category, type Store } from '../data/stores';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import SearchPage from '../components/SearchPage';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedStores, setSavedStores] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category>('美食');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categorySwipeStartX, setCategorySwipeStartX] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCategoryBar, setShowCategoryBar] = useState(false);
  const [showFavoritesList, setShowFavoritesList] = useState(false);
  const [removedFromFavorites, setRemovedFromFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'video' | 'map'>('video');
  const [showMap, setShowMap] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isChangingCategory = useRef(false);
  const favoritesSwipeStartX = useRef(0);
  const navigate = useNavigate();

  // 触觉反馈
  const triggerHaptic = (strength: 'light' | 'medium' | 'heavy') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 5,
        medium: 10,
        heavy: 20,
      };
      navigator.vibrate(patterns[strength]);
    }
  };

  useEffect(() => {
    const shareId = searchParams.get('share');
    if (shareId) {
      const storeIndex = stores.findIndex((s) => s.id === shareId);
      if (storeIndex !== -1) {
        const store = stores[storeIndex];
        setSelectedCategory(store.category);
        setSelectedTag(null);
        setTimeout(() => {
          setCurrentIndex(storeIndex);
        }, 100);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedHome');
    if (!hasVisited) {
      setShowTip(true);
      localStorage.setItem('hasVisitedHome', 'true');
      setTimeout(() => {
        setShowTip(false);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    setShowCategoryBar(false);
  }, [currentIndex, selectedCategory]);

  const filteredStores = useMemo(() => {
    let result = stores;

    if (selectedCategory) {
      result = result.filter((store) => store.category === selectedCategory);
    }

    if (selectedTag) {
      result = result.filter((store) => store.tags.includes(selectedTag));
    }

    return result;
  }, [selectedCategory, selectedTag]);

  const handleStoreSelectFromSearch = (storeId: string, gridIndex: number) => {
    setIsSearchOpen(false);
    const storeIndex = filteredStores.findIndex((s) => s.id === storeId);
    if (storeIndex !== -1) {
      setCurrentIndex(storeIndex);
    }
  };

  const availableTags = useMemo(() => {
    const categoryStores = selectedCategory
      ? stores.filter((store) => store.category === selectedCategory)
      : stores;

    const tags = new Set<string>();
    categoryStores.forEach((store) => {
      store.tags.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags);
  }, [selectedCategory]);

  const filteredTags = useMemo(() => {
    if (!tagSearch) return availableTags.slice(0, 12);
    return availableTags.filter((tag) =>
      tag.toLowerCase().includes(tagSearch.toLowerCase())
    );
  }, [availableTags, tagSearch]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setCategorySwipeStartX(e.touches[0].clientX);
    isChangingCategory.current = false;
    setShowCategoryBar(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const diffY = touchStartY.current - currentY;
    const diffX = categorySwipeStartX - currentX;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      isChangingCategory.current = true;
    } else if (Math.abs(diffY) > 10) {
      isChangingCategory.current = false;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY.current - touchEndY;
    const diffX = categorySwipeStartX - touchEndX;

    if (isChangingCategory.current && Math.abs(diffX) > 50) {
      if (showTip) {
        setShowTip(false);
      }
      if (diffX > 0) {
        handleCategorySwipe('left');
      } else {
        handleCategorySwipe('right');
      }
    } else if (!isChangingCategory.current && Math.abs(diffY) > 50) {
      if (diffY > 0 && currentIndex < filteredStores.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diffY < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      if (e.deltaY > 0 && currentIndex < filteredStores.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } else if (Math.abs(e.deltaX) > 10) {
      if (e.deltaX > 0) {
        handleCategorySwipe('left');
      } else {
        handleCategorySwipe('right');
      }
    }
  };

  const handleCategorySelect = (category: Category) => {
    triggerHaptic('medium');
    setSelectedCategory(category);
    setSelectedTag(null);
    setCurrentIndex(0);
  };

  const handleCategorySwipe = (direction: 'left' | 'right') => {
    const currentIdx = categories.indexOf(selectedCategory);
    let newIdx: number;

    if (direction === 'left') {
      newIdx = (currentIdx + 1) % categories.length;
    } else {
      newIdx = (currentIdx - 1 + categories.length) % categories.length;
    }

    handleCategorySelect(categories[newIdx]);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setCurrentIndex(0);
    setIsSearchOpen(false);
    setTagSearch('');

    if (!recentSearches.includes(tag)) {
      setRecentSearches([tag, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearTagFilter = () => {
    setSelectedTag(null);
    setCurrentIndex(0);
  };

  const handleBookingClick = () => {
    if (selectedCategory === '医美') {
      setShowBookingModal(true);
    } else {
      navigate(`/map?store=${currentStore.id}`);
    }
  };

  const toggleSave = (storeId: string) => {
    const newSaved = new Set(savedStores);
    if (newSaved.has(storeId)) {
      newSaved.delete(storeId);
      toast.success('已取消收藏');
    } else {
      newSaved.add(storeId);
      toast.success('已加入收藏');
    }
    setSavedStores(newSaved);
  };

  const handleRemoveFromFavorites = (storeId: string) => {
    const newRemoved = new Set(removedFromFavorites);
    newRemoved.add(storeId);
    setRemovedFromFavorites(newRemoved);

    const newSaved = new Set(savedStores);
    newSaved.delete(storeId);
    setSavedStores(newSaved);
  };

  const handleCloseFavorites = () => {
    setShowFavoritesList(false);
    setRemovedFromFavorites(new Set());
  };

  const toggleFavoritesList = () => {
    if (showFavoritesList) {
      handleCloseFavorites();
    } else {
      setShowFavoritesList(true);
    }
  };

  const handleFavoriteCardClick = (storeId: string) => {
    const storeIndex = filteredStores.findIndex((s) => s.id === storeId);
    if (storeIndex !== -1) {
      setCurrentIndex(storeIndex);
    }
    handleCloseFavorites();
  };

  const handleFavoritesSwipeStart = (e: React.TouchEvent) => {
    favoritesSwipeStartX.current = e.touches[0].clientX;
  };

  const handleFavoritesSwipeEnd = (e: React.TouchEvent) => {
    const swipeEndX = e.changedTouches[0].clientX;
    const diffX = swipeEndX - favoritesSwipeStartX.current;

    if (diffX > 100) {
      handleCloseFavorites();
    }
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  const handleScreenClick = () => {
    setShowCategoryBar(!showCategoryBar);
  };

  const currentStore = filteredStores[currentIndex];

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case '美食':
        return <Utensils size={14} />;
      case '医美':
        return <Syringe size={14} />;
      case '夜生活':
        return <Wine size={14} />;
      default:
        return <Utensils size={14} />;
    }
  };

  const themeColor = selectedCategory === '医美'
    ? '#E8B4C8'
    : selectedCategory === '夜生活'
    ? '#A78BFA'
    : '#14B8A6';
  const themeColorGradient = selectedCategory === '医美'
    ? 'linear-gradient(135deg, #F6D1D3 0%, #E8B4B8 100%)'
    : selectedCategory === '夜生活'
    ? 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)'
    : 'linear-gradient(90deg, #14B8A6 0%, #0D9488 100%)';

  const savedStoresList = useMemo(() => {
    return stores.filter(store => savedStores.has(store.id) && !removedFromFavorites.has(store.id));
  }, [savedStores, removedFromFavorites]);

  if (!currentStore) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-white">
        <p>暂无内容</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-hidden bg-black relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* 温馨提示 */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-24 left-3 z-50 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm"
          >
            👉 左右滑动切换分类
          </motion.div>
        )}
      </AnimatePresence>

      {/* 顶部 Tanmap */}
      <div className="absolute top-0 left-0 right-0 z-40 pt-4 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl font-bold drop-shadow-lg">Tanmap</h1>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-white hover:scale-110 transition-transform drop-shadow-lg"
          >
            <Search size={24} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* 分类栏 - 新设计 */}
      <AnimatePresence>
        {showCategoryBar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-16 left-0 right-0 z-40 pt-2"
          >
            {/* CategoryBar容器 */}
            <div className="relative h-8 overflow-hidden">
              {/* 左侧渐变遮罩 */}
              <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-r from-black/60 to-transparent" />

              {/* ScrollContainer */}
              <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide scroll-smooth snap-x snap-mandatory">
                {categories.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <motion.button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      whileTap={{ scale: 1.05 }}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                        mass: 1,
                      }}
                      className={`flex items-center gap-1.5 px-4 h-7 rounded-full font-semibold text-xs whitespace-nowrap flex-shrink-0 snap-center transition-all duration-200 ${
                        isActive
                          ? 'bg-white/90 text-black shadow-[0_2px_6px_rgba(0,0,0,0.1)]'
                          : 'bg-white/20 text-white/70'
                      }`}
                    >
                      {getCategoryIcon(category)}
                      <span>{category}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* 右侧渐变遮罩 */}
              <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-black/60 to-transparent" />
            </div>

            {/* 标签过滤器 */}
            {selectedTag && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 px-4 flex items-center gap-1"
              >
                <span className="px-3 py-1 bg-white/20 text-white backdrop-blur-sm rounded-full text-sm">
                  {selectedTag}
                </span>
                <button
                  onClick={clearTagFilter}
                  className="text-white/80 hover:text-white"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 视频流或地图 */}
      <AnimatePresence mode="wait">
        {showMap ? (
          <motion.div
            key="map-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full pb-16"
          >
            <iframe
              src={`/map?store=${currentStore.id}`}
              className="w-full h-full border-0"
              title="地图"
            />
          </motion.div>
        ) : (
          <motion.div
            key={`${selectedCategory}-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <div
              className="h-full w-full relative pb-16"
              onClick={handleScreenClick}
            >
            <img
              src={
                selectedCategory === '医美'
                  ? 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=1200&fit=crop'
                  : 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=1200&fit=crop'
              }
              alt={currentStore.name}
              className="absolute inset-0 w-full h-full object-cover brightness-95"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

            {/* 店铺信息 - 左下角 */}
            <div className="absolute bottom-20 left-3 text-white space-y-1.5 max-w-[60%]">
              <h1 className="font-semibold opacity-90" style={{ fontSize: '1.35rem' }}>{currentStore.name}</h1>

              <div className="flex flex-wrap gap-1">
                {currentStore.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/20"
                    style={{ fontSize: '0.675rem' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="opacity-70 flex items-center gap-0.5" style={{ fontSize: '0.79rem' }}>
                <span>📍</span>
                {currentStore.distance}km
              </p>
            </div>

            {/* 右侧按钮 - 只有收藏和分享 */}
            <div className="absolute right-3 bottom-32 flex flex-col gap-4 items-center">
              <motion.button
                whileTap={{ scale: 1.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(currentStore.id);
                }}
                className="text-white hover:scale-110 transition-transform drop-shadow-lg"
              >
                <Heart
                  className={savedStores.has(currentStore.id) ? 'fill-current text-pink-500' : ''}
                  size={29}
                  strokeWidth={1.5}
                />
              </motion.button>

              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const shareUrl = `${window.location.origin}/?share=${currentStore.id}`;
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    toast.success('已复制链接');
                  } catch (err) {
                    toast.error('复制失败，请重试');
                  }
                }}
                className="text-white hover:scale-110 transition-transform drop-shadow-lg"
              >
                <Share2 size={29} strokeWidth={1.5} />
              </button>
            </div>

            {/* 右下角按钮 - 去这里/立即预约 */}
            <div className="absolute right-3 bottom-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookingClick();
                }}
                className="text-white rounded-full font-semibold transition-all px-6 shadow-lg"
                style={{
                  fontSize: '0.9rem',
                  height: '38px',
                  background: themeColorGradient,
                }}
              >
                {selectedCategory === '医美' ? t('bookNow') : t('goHere')}
              </button>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50">
        <button
          onClick={() => {
            if (showMap) {
              setShowMap(false);
            } else {
              setShowMap(true);
            }
          }}
          className="flex flex-col items-center justify-center gap-1 text-gray-900"
        >
          {showMap ? <Video size={24} /> : <Map size={24} />}
          <span className="text-xs">{showMap ? t('video') : t('map')}</span>
        </button>

        <button
          onClick={toggleFavoritesList}
          className={`flex flex-col items-center justify-center gap-1 ${
            showFavoritesList ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <Heart size={24} />
          <span className="text-xs">{t('favorites')}</span>
        </button>

        <button
          onClick={() => navigate('/services')}
          className="flex flex-col items-center justify-center gap-1 text-gray-400"
        >
          <MapPin size={24} />
          <span className="text-xs">{t('services')}</span>
        </button>

        <button
          onClick={() => navigate('/forum')}
          className="flex flex-col items-center justify-center gap-1 text-gray-400"
        >
          <MessageSquare size={24} />
          <span className="text-xs">{t('forum')}</span>
        </button>

        <button
          onClick={() => navigate('/more')}
          className="flex flex-col items-center justify-center gap-1 text-gray-400"
        >
          <MoreVertical size={24} />
        </button>
      </div>

      {/* 收藏列表弹窗 */}
      <AnimatePresence>
        {showFavoritesList && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 bottom-16 w-1/4 min-w-[300px] bg-white shadow-2xl z-40 rounded-l-2xl overflow-hidden"
            style={{ height: 'calc((100vh - 4rem) / 2)' }}
            onTouchStart={handleFavoritesSwipeStart}
            onTouchEnd={handleFavoritesSwipeEnd}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-lg">我的收藏</h3>
                <button
                  onClick={handleCloseFavorites}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {savedStoresList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Heart size={48} className="mb-2" />
                    <p>暂无收藏</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {savedStoresList.map((store) => (
                      <motion.div
                        key={store.id}
                        layout
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="p-3 mb-2 rounded-lg border transition-all hover:shadow-md cursor-pointer"
                        style={{
                          borderColor: store.category === '美食' ? '#14B8A6' : store.category === '医美' ? '#E8B4C8' : '#A78BFA',
                          backgroundColor: store.category === '美食' ? '#F0FDFA' : store.category === '医美' ? '#FDF5F8' : '#F5F3FF',
                        }}
                        onClick={() => handleFavoriteCardClick(store.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm mb-1 truncate">{store.name}</h4>
                            <div className="flex flex-wrap gap-1">
                              {store.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: store.category === '美食' ? '#CCFBF1' : store.category === '医美' ? '#F8E8EE' : '#EDE9FE',
                                    color: store.category === '美食' ? '#14B8A6' : store.category === '医美' ? '#E8B4C8' : '#A78BFA',
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromFavorites(store.id);
                            }}
                            className="flex-shrink-0 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Heart size={20} className="fill-current" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 搜索页面 */}
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

      {/* 预约表单弹窗 */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-full bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#F6D1D3] to-[#E8B4C8] bg-clip-text text-transparent">
                  预约服务
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    预约日期
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    姓名
                  </label>
                  <input
                    type="text"
                    placeholder="请输入您的姓名"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    手机号
                  </label>
                  <div className="flex gap-2">
                    <select className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none bg-white">
                      <option value="+86">+86 中国</option>
                      <option value="+82">+82 韩国</option>
                      <option value="+1">+1 美国</option>
                      <option value="+81">+81 日本</option>
                      <option value="+44">+44 英国</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="请输入手机号"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    微信号
                  </label>
                  <input
                    type="text"
                    placeholder="请输入您的微信号"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    护照号码
                  </label>
                  <input
                    type="text"
                    placeholder="请输入您的护照号码"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success('预约成功！我们会尽快联系您');
                    setShowBookingModal(false);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#F6D1D3] to-[#E8B4C8] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  确认预约
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
