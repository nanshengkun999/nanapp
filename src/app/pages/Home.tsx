import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Bookmark,
  CheckCircle2,
  Heart,
  Navigation,
  Search,
  Send,
  Share2,
  Syringe,
  Utensils,
  Wine,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import type { TouchEvent } from 'react';
import MobileDock from '../components/MobileDock';
import SearchPage from '../components/SearchPage';
import { categories, stores, type Category, type Store } from '../data/stores';

const categoryMeta = [
  {
    label: '美食',
    icon: Utensils,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=1800&fit=crop',
  },
  {
    label: '医美',
    icon: Syringe,
    image:
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&h=1800&fit=crop',
  },
  {
    label: '夜生活',
    icon: Wine,
    image:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=1800&fit=crop',
  },
];

const displayStores: Record<string, Partial<Store> & { tags: string[] }> = {
  '1': {
    name: '云端咖啡馆',
    address: '朝阳区 三里屯',
    tags: ['美食', '咖啡', '本地人常去', '约会'],
    description: '藏在街角的温暖咖啡馆，适合下午慢慢坐一会儿。',
  },
  '2': {
    name: '花间寿司',
    address: '海淀区 中关村',
    tags: ['美食', '日料', '约会', '寿司'],
  },
  '3': {
    name: '悦颜医美诊所',
    address: '东城区 王府井',
    tags: ['医美', '护肤', '本地人常去', '水光'],
  },
  '15': {
    name: 'Neon 夜店',
    address: '朝阳区 工体北路',
    tags: ['夜生活', '电音', 'DJ', '鸡尾酒'],
  },
};

function getCategoryIndex(category: Category) {
  return Math.max(0, categories.findIndex((item) => item === category));
}

function getDisplayStore(store: Store) {
  return {
    ...store,
    ...displayStores[store.id],
    tags: displayStores[store.id]?.tags ?? ['精选', '本地人常去', '收藏点', '探店'],
    address: displayStores[store.id]?.address ?? '首尔 本地精选',
    name: displayStores[store.id]?.name ?? '本地精选地点',
  };
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedStores, setSavedStores] = useState<Set<string>>(
    () => new Set(stores.filter((store) => store.saved).map((store) => store.id))
  );
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const shareId = searchParams.get('share');
    if (!shareId) return;
    const storeIndex = stores.findIndex((store) => store.id === shareId);
    if (storeIndex !== -1) {
      setSelectedCategory(stores[storeIndex].category);
      setCurrentIndex(storeIndex);
    }
  }, [searchParams]);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesCategory = store.category === selectedCategory;
      const matchesTag = selectedTag ? store.tags.includes(selectedTag) : true;
      return matchesCategory && matchesTag;
    });
  }, [selectedCategory, selectedTag]);

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

  const currentStore = filteredStores[currentIndex] ?? filteredStores[0] ?? stores[0];
  const displayStore = getDisplayStore(currentStore);
  const categoryIndex = getCategoryIndex(selectedCategory);
  const selectedMeta = categoryMeta[categoryIndex] ?? categoryMeta[0];
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedTag(null);
    setCurrentIndex(0);
  };

  const handleTouchStart = (event: TouchEvent) => {
    touchStartY.current = event.touches[0].clientY;
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const diffY = touchStartY.current - event.changedTouches[0].clientY;
    const diffX = touchStartX.current - event.changedTouches[0].clientX;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      const currentCategoryIndex = categories.indexOf(selectedCategory);
      const nextIndex =
        diffX > 0
          ? (currentCategoryIndex + 1) % categories.length
          : (currentCategoryIndex - 1 + categories.length) % categories.length;
      handleCategorySelect(categories[nextIndex]);
      return;
    }

    if (Math.abs(diffY) > 50) {
      if (diffY > 0 && currentIndex < filteredStores.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      if (diffY < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const toggleSave = (storeId: string) => {
    setSavedStores((previous) => {
      const next = new Set(previous);
      if (next.has(storeId)) {
        next.delete(storeId);
        toast.success('已取消收藏');
      } else {
        next.add(storeId);
        toast.success('已加入收藏');
      }
      return next;
    });
  };

  const shareStore = async () => {
    const shareUrl = `${window.location.origin}/?share=${currentStore.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('分享链接已复制');
    } catch {
      toast.error('复制失败，请重试');
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

  return (
    <main
      className="tan-mobile-frame h-dvh bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={`${selectedCategory}-${currentIndex}`}
          src={selectedMeta.image}
          alt={displayStore.name}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0.6, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0.18),transparent_58%)]" />
      <div className="absolute inset-x-0 top-0 z-20 px-6 pt-8">
        <div className="flex items-center justify-between">
          <h1 className="text-[38px] font-extrabold leading-none tracking-normal drop-shadow-lg">
            Tanmap
          </h1>
          <button
            type="button"
            aria-label="搜索"
            onClick={() => setIsSearchOpen(true)}
            className="tan-pressable grid h-14 w-14 place-items-center rounded-full text-white"
          >
            <Search size={36} strokeWidth={2.2} />
          </button>
        </div>

        <div
          className="tan-glass mt-9 grid grid-cols-3 rounded-[36px] p-1.5"
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
                className={`tan-pressable relative flex h-16 items-center justify-center gap-2 rounded-[30px] text-[18px] font-extrabold ${
                  isActive ? 'text-[#0AAE9E]' : 'text-white/90'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute inset-0 rounded-[30px] bg-white/90 shadow-[0_8px_20px_rgba(255,255,255,0.16)]"
                    transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                  />
                )}
                <Icon className="relative" size={25} strokeWidth={2.2} />
                <span className="relative">{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="absolute bottom-[calc(116px+env(safe-area-inset-bottom))] left-6 right-6 z-20">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="truncate text-[32px] font-extrabold leading-tight tracking-normal">
                {displayStore.name}
              </h2>
              <CheckCircle2 className="shrink-0 text-[#12D8C4]" size={25} fill="#12D8C4" />
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {displayStore.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-[14px] font-semibold text-white backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="flex items-center gap-2 text-[17px] font-semibold text-white/84">
              <MapPinIcon />
              <span>{displayStore.distance}km</span>
              <span className="text-white/55">|</span>
              <span className="truncate">{displayStore.address}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              categoryIndex === 1 ? setShowBookingModal(true) : navigate(`/map?store=${currentStore.id}`)
            }
            className="tan-pressable flex h-16 shrink-0 items-center gap-3 rounded-full bg-[linear-gradient(135deg,#16D6C3,#0EA896)] px-7 text-[22px] font-extrabold text-white shadow-[var(--tan-cta-shadow)]"
          >
            <Send size={27} fill="white" strokeWidth={1.8} />
            去这里
          </button>
        </div>
      </section>

      <div className="absolute bottom-[260px] right-5 z-30 flex flex-col items-center gap-5">
        {[
          {
            label: '收藏',
            icon: Heart,
            action: () => toggleSave(currentStore.id),
            active: savedStores.has(currentStore.id),
          },
          { label: '分享', icon: Share2, action: shareStore },
          { label: '保存', icon: Bookmark, action: () => toggleSave(currentStore.id) },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              onClick={action.action}
              className="tan-pressable flex flex-col items-center gap-2 text-[15px] font-bold text-white"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-black/35 shadow-[0_8px_22px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <Icon
                  size={31}
                  strokeWidth={2}
                  className={action.active ? 'fill-[#A7FFF4] text-[#A7FFF4]' : ''}
                />
              </span>
              {action.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 px-4 pb-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              className="tan-card w-full max-w-[448px] rounded-[34px] p-6 text-[#073238]"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold">预约服务</h2>
                  <p className="mt-1 text-sm text-[#8A94A3]">留下联系方式，服务顾问会与你确认时间。</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="tan-pressable grid h-11 w-11 place-items-center rounded-full bg-[#F1F6F4]"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="space-y-3">
                <input className="h-14 w-full rounded-2xl border border-black/5 bg-white px-4 outline-none" placeholder="姓名" />
                <input className="h-14 w-full rounded-2xl border border-black/5 bg-white px-4 outline-none" placeholder="手机号 / 微信" />
                <button
                  type="button"
                  onClick={() => {
                    toast.success('预约已提交');
                    setShowBookingModal(false);
                  }}
                  className="tan-pressable mt-2 h-14 w-full rounded-2xl bg-[linear-gradient(135deg,#12B8A6,#0EA896)] text-lg font-extrabold text-white"
                >
                  确认预约
                </button>
              </div>
            </motion.div>
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

      <MobileDock active="map" />
    </main>
  );
}

function MapPinIcon() {
  return <Navigation size={23} className="text-[#27D9C6]" fill="#27D9C6" strokeWidth={1.8} />;
}
