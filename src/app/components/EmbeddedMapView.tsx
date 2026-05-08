import { useEffect, useMemo, useState } from 'react';
import { Clock3, MapPin, Navigation, Search, Utensils, WandSparkles, Wine } from 'lucide-react';
import { motion } from 'motion/react';
import { categories, stores, type Store } from '../data/stores';
import { useLanguage } from '../contexts/LanguageContext';
import { localizeStore } from '../utils/storeI18n';

interface EmbeddedMapViewProps {
  activeStoreId?: string;
}

const mapBounds = {
  north: 40.015,
  south: 39.835,
  west: 116.305,
  east: 116.5,
};

const categoryStyles = [
  {
    labelKey: 'food',
    Icon: Utensils,
    marker: 'bg-[#f97316]',
    halo: 'shadow-[0_10px_24px_rgba(249,115,22,0.28)]',
  },
  {
    labelKey: 'beauty',
    Icon: WandSparkles,
    marker: 'bg-[#ec4899]',
    halo: 'shadow-[0_10px_24px_rgba(236,72,153,0.26)]',
  },
  {
    labelKey: 'nightlife',
    Icon: Wine,
    marker: 'bg-[#6366f1]',
    halo: 'shadow-[0_10px_24px_rgba(99,102,241,0.28)]',
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getCategoryStyle(store: Store) {
  const index = Math.max(0, categories.findIndex((category) => category === store.category));
  return categoryStyles[index] ?? categoryStyles[0];
}

function getMarkerPosition(store: Store, index: number) {
  const leftRatio = (store.lng - mapBounds.west) / (mapBounds.east - mapBounds.west);
  const topRatio = (mapBounds.north - store.lat) / (mapBounds.north - mapBounds.south);
  const offset = ((Number(store.id) + index) % 3) - 1;

  return {
    left: `${clamp(leftRatio * 78 + 11 + offset * 1.8, 8, 92)}%`,
    top: `${clamp(topRatio * 70 + 13 - offset * 1.3, 12, 84)}%`,
  };
}

export default function EmbeddedMapView({ activeStoreId }: EmbeddedMapViewProps) {
  const { language, t } = useLanguage();
  const [selectedStoreId, setSelectedStoreId] = useState(activeStoreId ?? stores[0]?.id);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (activeStoreId) {
      setSelectedStoreId(activeStoreId);
    }
  }, [activeStoreId]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredStores = useMemo(() => {
    if (!normalizedQuery) return stores;

    return stores.filter((store) => {
      const displayStore = localizeStore(store, language);
      return `${displayStore.name} ${displayStore.address} ${displayStore.tags.join(' ')}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [language, normalizedQuery]);

  const selectedStoreSource =
    stores.find((store) => store.id === selectedStoreId) ?? filteredStores[0] ?? stores[0];
  const selectedStore = selectedStoreSource ? localizeStore(selectedStoreSource, language) : undefined;
  const selectedStyle = selectedStore ? getCategoryStyle(selectedStore) : categoryStyles[0];
  const SelectedIcon = selectedStyle.Icon;

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#e8f2ee] text-[#14313a]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.32)_1px,transparent_1px)] bg-[size:54px_54px]" />
      <div className="absolute -left-[20%] bottom-[-12%] h-[38%] w-[78%] rounded-[48%] bg-[#bfe5f2]/70" />
      <div className="absolute right-[-18%] top-[6%] h-[31%] w-[58%] rotate-[-16deg] rounded-[45%] bg-[#c9eadc]/85" />
      <div className="absolute left-[8%] top-[14%] h-[20%] w-[33%] rotate-[-9deg] rounded-[34px] bg-white/34" />

      <div className="absolute left-[-12%] top-[20%] h-6 w-[126%] rotate-[-7deg] rounded-full bg-[#fff6d9] shadow-[inset_0_0_0_3px_rgba(251,191,36,0.18)]" />
      <div className="absolute left-[-15%] top-[55%] h-6 w-[130%] rotate-[10deg] rounded-full bg-[#fff6d9] shadow-[inset_0_0_0_3px_rgba(251,191,36,0.18)]" />
      <div className="absolute left-[4%] top-[38%] h-4 w-[94%] rotate-[-19deg] rounded-full bg-white shadow-sm" />
      <div className="absolute left-[10%] top-[78%] h-3 w-[92%] rotate-[-3deg] rounded-full bg-white/88 shadow-sm" />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 px-4 pt-[calc(14px+env(safe-area-inset-top))]">
        <label className="pointer-events-auto flex h-10 items-center gap-2 rounded-full bg-white/90 px-3.5 text-[#14313a] shadow-[0_8px_24px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <Search size={16} className="text-[#7b8c86]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchStorePlace')}
            className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold outline-none placeholder:text-[#8c9b96]"
          />
        </label>
      </header>

      {filteredStores.map((store, index) => {
        const displayStore = localizeStore(store, language);
        const style = getCategoryStyle(displayStore);
        const Icon = style.Icon;
        const isSelected = selectedStore?.id === displayStore.id;

        return (
          <button
            key={displayStore.id}
            type="button"
            aria-label={`${t('chooseStore')} ${displayStore.name}`}
            onClick={() => setSelectedStoreId(displayStore.id)}
            className="tan-pressable absolute z-20 flex min-h-10 min-w-10 -translate-x-1/2 -translate-y-full items-end justify-center"
            style={getMarkerPosition(store, index)}
          >
            <motion.span
              animate={{ y: isSelected ? -5 : 0, scale: isSelected ? 1.08 : 1 }}
              transition={{ type: 'spring', damping: 18, stiffness: 260 }}
              className="relative flex flex-col items-center"
            >
              {isSelected && (
                <span className="mb-1 max-w-[132px] truncate rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#14313a] shadow-[0_8px_22px_rgba(15,23,42,0.16)]">
                    {displayStore.name}
                </span>
              )}
              <span
                className={`grid h-10 w-10 place-items-center rounded-full border-[3px] border-white text-white ${style.marker} ${style.halo}`}
              >
                <Icon size={17} strokeWidth={2.4} />
              </span>
              <span className="h-2 w-2 rounded-full bg-black/18 blur-[1px]" />
            </motion.span>
          </button>
        );
      })}

      {selectedStore && (
        <motion.aside
          key={selectedStore.id}
          initial={{ y: 72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="absolute inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom))] z-40 px-4"
        >
          <div className="rounded-[22px] bg-white/94 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.13)] backdrop-blur-2xl">
            <div className="flex items-start gap-2.5">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[16px] text-white ${selectedStyle.marker}`}>
                <SelectedIcon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="truncate text-[17px] font-extrabold leading-tight text-[#073238]">
                      {selectedStore.name}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-[12px] font-bold text-[#75827f]">
                      <MapPin size={14} />
                      <span className="truncate">{selectedStore.address}</span>
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#E8F8F5] px-2.5 py-1 text-[12px] font-extrabold text-[#0EA896]">
                    {selectedStore.distance}km
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5 truncate text-[12px] font-semibold text-[#6b7774]">
                    <Clock3 size={14} className="text-[#10BFA5]" />
                    {selectedStore.hours}
                  </span>
                  <button
                    type="button"
                    className="tan-pressable flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#16D6C3,#0EA896)] px-3.5 text-[12px] font-extrabold text-white shadow-[var(--tan-cta-shadow)]"
                  >
                    <Navigation size={14} />
                    {t('navigation')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </section>
  );
}
