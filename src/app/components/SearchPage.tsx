import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import type { Category, Store } from '../data/stores';
import { useLanguage } from '../contexts/LanguageContext';
import { localizeStore } from '../utils/storeI18n';

interface SearchPageProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: Category;
  tagSearch: string;
  setTagSearch: (value: string) => void;
  recentSearches: string[];
  filteredTags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string) => void;
  onStoreSelect: (storeId: string, gridIndex: number) => void;
  filteredStores: Store[];
}

export default function SearchPage({
  onClose,
  selectedCategory,
  tagSearch,
  setTagSearch,
  recentSearches,
  filteredTags,
  selectedTag,
  onTagSelect,
  onStoreSelect,
  filteredStores,
}: SearchPageProps) {
  const { language, t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isCollapsed = scrollY > 50;
  const tabOpacity = Math.max(0, 1 - scrollY / 50);
  const cardHeight = isCollapsed ? 64 : 120;
  const themeColor = selectedCategory === '医美' ? '#E8B4C8' : '#14B8A6';
  const selectedCategoryKey =
    selectedCategory === '美食' ? 'food' : selectedCategory === '医美' ? 'beauty' : 'nightlife';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black"
    >
      <motion.div
        className="fixed left-0 right-0 top-0 z-10"
        animate={{ height: cardHeight }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
        <div className="relative flex h-full flex-col justify-between px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={17} />
              <Input
                placeholder={
                  selectedCategory === '美食'
                    ? t('searchFoodPlaceholder')
                    : selectedCategory === '医美'
                    ? t('searchBeautyPlaceholder')
                    : t('searchGenericPlaceholder')
                }
                value={tagSearch}
                onChange={(event) => setTagSearch(event.target.value)}
                className="h-10 w-full rounded-lg border-none bg-white/10 pl-10 text-white placeholder:text-white/40 focus:bg-white/15"
                autoFocus
              />
            </div>
          </div>

          <motion.div
            className="flex gap-2 overflow-x-auto tan-scrollbar-hide"
            animate={{ opacity: tabOpacity }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: '-4px' }}
          >
            <Badge
              variant="secondary"
              className="whitespace-nowrap px-3 py-1 text-xs text-white backdrop-blur-sm"
              style={{ backgroundColor: `${themeColor}cc` }}
            >
              {t(selectedCategoryKey)}
            </Badge>
            {[t('allCategories'), t('nearby'), t('hot')].map((label) => (
              <Badge
                key={label}
                variant="outline"
                className="whitespace-nowrap border-white/30 px-3 py-1 text-xs text-white/70"
              >
                {label}
              </Badge>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto pb-20 pt-32"
        onScroll={(event) => setScrollY(event.currentTarget.scrollTop)}
      >
        <div className="space-y-4">
          {recentSearches.length > 0 && !tagSearch && (
            <div className="px-3">
              <h3 className="mb-2 text-sm font-semibold text-white">{t('recentSearches')}</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <Badge
                    key={search}
                    variant="outline"
                    className="cursor-pointer border-white/30 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
                    onClick={() => onTagSelect(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!tagSearch && (
            <div className="px-3">
              <h3 className="mb-2 text-sm font-semibold text-white">{t('recommendedTags')}</h3>
              <div className="flex flex-wrap gap-2">
                {filteredTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'secondary'}
                    className={`cursor-pointer px-3 py-1 text-xs ${
                      selectedTag === tag ? 'text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                    style={{ backgroundColor: selectedTag === tag ? themeColor : undefined }}
                    onClick={() => onTagSelect(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            {filteredStores.length === 0 && tagSearch ? (
              <p className="py-12 text-center text-white/60">{t('noStoresFound')}</p>
            ) : (
              <div className="grid grid-cols-3 gap-0.5 px-0.5">
                {filteredStores.map((store, index) => {
                  const displayStore = localizeStore(store, language);

                  return (
                  <motion.button
                    key={displayStore.id}
                    type="button"
                    className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-black text-left"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onStoreSelect(displayStore.id, index);
                      onClose();
                    }}
                  >
                    <video
                      src={displayStore.videoUrl}
                      className="absolute inset-0 h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-7 px-2">
                      <p className="truncate text-xs font-extrabold text-white drop-shadow">{displayStore.name}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {displayStore.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-black/28 px-1.5 py-0.5 text-[10px] font-semibold text-white/82 backdrop-blur"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs font-semibold text-white/84">
                      <MapPin size={12} className="text-[#ff6b4a]" fill="#ff6b4a" />
                      {displayStore.distance}km
                    </div>
                  </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
