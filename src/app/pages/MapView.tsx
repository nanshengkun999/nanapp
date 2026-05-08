import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  ArrowLeft,
  Building2,
  Clock3,
  Layers,
  LocateFixed,
  MapPin,
  Minus,
  Music2,
  Navigation,
  Plus,
  Route,
  Search,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  X,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { stores, type Store } from '../data/stores';
import { useLanguage } from '../contexts/LanguageContext';
import { localizeStore, localizeTag } from '../utils/storeI18n';

const mapBounds = {
  north: 40.015,
  south: 39.835,
  west: 116.305,
  east: 116.5,
};

const categoryMeta: Record<
  Store['category'],
  {
    Icon: LucideIcon;
    labelKey: string;
    marker: string;
    glow: string;
  }
> = {
  美食: {
    Icon: Utensils,
    labelKey: 'dining',
    marker: 'bg-[#f97316]',
    glow: 'shadow-[0_10px_28px_rgba(249,115,22,0.34)]',
  },
  医美: {
    Icon: Sparkles,
    labelKey: 'beauty',
    marker: 'bg-[#ec4899]',
    glow: 'shadow-[0_10px_28px_rgba(236,72,153,0.32)]',
  },
  夜生活: {
    Icon: Music2,
    labelKey: 'nightlife',
    marker: 'bg-[#6366f1]',
    glow: 'shadow-[0_10px_28px_rgba(99,102,241,0.34)]',
  },
};

const roadSegments = [
  { left: '-10%', top: '19%', width: '122%', height: 26, rotate: -7, type: 'primary' },
  { left: '-14%', top: '55%', width: '128%', height: 24, rotate: 10, type: 'primary' },
  { left: '2%', top: '38%', width: '96%', height: 18, rotate: -19, type: 'secondary' },
  { left: '18%', top: '-10%', width: '18%', height: 112, rotate: 5, type: 'secondary' },
  { left: '54%', top: '-8%', width: '16%', height: 118, rotate: -9, type: 'secondary' },
  { left: '76%', top: '8%', width: '15%', height: 88, rotate: 13, type: 'secondary' },
  { left: '9%', top: '77%', width: '94%', height: 16, rotate: -3, type: 'minor' },
  { left: '4%', top: '69%', width: '74%', height: 12, rotate: -28, type: 'minor' },
  { left: '33%', top: '12%', width: '12%', height: 83, rotate: 18, type: 'minor' },
  { left: '46%', top: '25%', width: '11%', height: 72, rotate: -18, type: 'minor' },
  { left: '66%', top: '39%', width: '10%', height: 61, rotate: 2, type: 'minor' },
];

const districtBlocks = [
  { left: '6%', top: '9%', width: '22%', height: '9%', rotate: -5, labelKey: 'chaoyangPark' },
  { left: '34%', top: '8%', width: '18%', height: '8%', rotate: 3, labelKey: 'wangjing' },
  { left: '70%', top: '17%', width: '19%', height: '10%', rotate: 8, labelKey: 'blueHarbor' },
  { left: '10%', top: '31%', width: '20%', height: '11%', rotate: -12, labelKey: 'sanlitun' },
  { left: '58%', top: '31%', width: '22%', height: '9%', rotate: 8, labelKey: 'embassyArea' },
  { left: '17%', top: '61%', width: '18%', height: '10%', rotate: 8, labelKey: 'gongti' },
  { left: '42%', top: '63%', width: '21%', height: '9%', rotate: -5, labelKey: 'guomao' },
  { left: '68%', top: '72%', width: '20%', height: '10%', rotate: 4, labelKey: 'shuangjing' },
];

const placeLabels = [
  { left: '13%', top: '48%', labelKey: 'taikooli' },
  { left: '48%', top: '47%', labelKey: 'liangmaRiver' },
  { left: '69%', top: '58%', labelKey: 'cbd' },
  { left: '25%', top: '84%', labelKey: 'dongdaqiao' },
];

const mapPanLimit = {
  x: 120,
  y: 160,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getMarkerStyle(store: Store, index: number): CSSProperties {
  const leftRatio = (store.lng - mapBounds.west) / (mapBounds.east - mapBounds.west);
  const topRatio = (mapBounds.north - store.lat) / (mapBounds.north - mapBounds.south);
  const duplicateOffset = ((Number(store.id) + index) % 3) - 1;

  return {
    left: `${clamp(leftRatio * 78 + 11 + duplicateOffset * 1.8, 8, 92)}%`,
    top: `${clamp(topRatio * 70 + 13 - duplicateOffset * 1.3, 12, 84)}%`,
  };
}

function getRoadClass(type: string) {
  if (type === 'primary') {
    return 'bg-[#fff8db] shadow-[inset_0_0_0_3px_rgba(251,191,36,0.22),0_1px_4px_rgba(100,116,139,0.12)]';
  }

  if (type === 'secondary') {
    return 'bg-white shadow-[inset_0_0_0_1px_rgba(148,163,184,0.22),0_1px_3px_rgba(100,116,139,0.1)]';
  }

  return 'bg-white/88 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.15)]';
}

export default function MapView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isMapDragging, setIsMapDragging] = useState(false);
  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    didMove: false,
  });

  useEffect(() => {
    const storeId = searchParams.get('store');
    if (storeId) {
      setSelectedStore(storeId);
    }
  }, [searchParams]);

  const allTags = useMemo(() => Array.from(new Set(stores.flatMap((store) => store.tags))), []);
  const normalizedQuery = query.trim().toLowerCase();

  const toggleTag = (tag: string) => {
    setSelectedTags((previous) => {
      const next = new Set(previous);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedTags(new Set());
  };

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesTag =
        selectedTags.size === 0 || store.tags.some((tag) => selectedTags.has(tag));
      const displayStore = localizeStore(store, language);
      const searchable = `${displayStore.name} ${displayStore.address} ${displayStore.category} ${displayStore.tags.join(' ')}`;
      const matchesQuery =
        !normalizedQuery || searchable.toLowerCase().includes(normalizedQuery);

      return matchesTag && matchesQuery;
    });
  }, [language, normalizedQuery, selectedTags]);

  const selectedStoreData = selectedStore
    ? stores.find((store) => store.id === selectedStore)
    : undefined;
  const activeStore = selectedStoreData
    ? localizeStore(selectedStoreData, language)
    : filteredStores[0]
    ? localizeStore(filteredStores[0], language)
    : undefined;

  const handleMapPointerDown = (event: PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button, input')) return;

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: mapOffset.x,
      originY: mapOffset.y,
      didMove: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsMapDragging(true);
  };

  const handleMapPointerMove = (event: PointerEvent<HTMLElement>) => {
    const dragState = dragStateRef.current;
    if (dragState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 4) {
      dragState.didMove = true;
    }

    setMapOffset({
      x: clamp(dragState.originX + deltaX, -mapPanLimit.x, mapPanLimit.x),
      y: clamp(dragState.originY + deltaY, -mapPanLimit.y, mapPanLimit.y),
    });
  };

  const handleMapPointerEnd = (event: PointerEvent<HTMLElement>) => {
    const dragState = dragStateRef.current;
    if (dragState.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!dragState.didMove) {
      setSelectedStore(null);
    }

    dragState.pointerId = -1;
    setIsMapDragging(false);
  };

  return (
    <main className="tan-mobile-frame h-dvh bg-[#dfe9e4] text-[#14313a]">
      <section
        aria-label={t('map')}
        className={`absolute inset-0 overflow-hidden bg-[#edf3ee] touch-none select-none ${
          isMapDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onPointerDown={handleMapPointerDown}
        onPointerMove={handleMapPointerMove}
        onPointerUp={handleMapPointerEnd}
        onPointerCancel={handleMapPointerEnd}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate3d(${mapOffset.x}px, ${mapOffset.y}px, 0)`,
            transition: isMapDragging
              ? 'none'
              : 'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.26)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute -left-[16%] bottom-[-10%] h-[37%] w-[72%] rounded-[48%] bg-[#bfe5f2]/80 blur-[0.2px]" />
          <div className="absolute right-[-18%] top-[7%] h-[30%] w-[52%] rotate-[-17deg] rounded-[45%] bg-[#c8ecdb]" />
          <div className="absolute left-[4%] top-[11%] h-[21%] w-[31%] rotate-[-9deg] rounded-[36px] bg-[#cfead1]" />

          {districtBlocks.map((block) => (
            <div
              key={block.labelKey}
              className="absolute rounded-[18px] border border-white/55 bg-white/40 px-3 py-2 text-[11px] font-semibold text-[#6f817b] shadow-[0_1px_2px_rgba(71,85,105,0.08)] backdrop-blur-[1px]"
              style={{
                left: block.left,
                top: block.top,
                width: block.width,
                height: block.height,
                transform: `rotate(${block.rotate}deg)`,
              }}
            >
              {t(block.labelKey)}
            </div>
          ))}

          {roadSegments.map((road, index) => (
            <div
              key={`${road.left}-${road.top}-${index}`}
              className={`absolute rounded-full ${getRoadClass(road.type)}`}
              style={{
                left: road.left,
                top: road.top,
                width: road.width,
                height: `${road.height}px`,
                transform: `rotate(${road.rotate}deg)`,
                transformOrigin: 'center',
              }}
            />
          ))}

          <div className="absolute left-[35%] top-[39%] h-[7px] w-[45%] rotate-[23deg] rounded-full bg-[#ef4444]/72 shadow-[0_1px_5px_rgba(239,68,68,0.2)]" />
          <div className="absolute left-[72%] top-[55%] h-[102px] w-[7px] rotate-[8deg] rounded-full bg-[#22c55e]/70 shadow-[0_1px_5px_rgba(34,197,94,0.18)]" />

          {placeLabels.map((place) => (
            <span
              key={place.labelKey}
              className="absolute rounded-full bg-white/45 px-2.5 py-1 text-[11px] font-bold text-[#7b8c86] shadow-sm backdrop-blur-[2px]"
              style={{ left: place.left, top: place.top }}
            >
              {t(place.labelKey)}
            </span>
          ))}

          <div className="absolute left-[49%] top-[53%] -translate-x-1/2 -translate-y-1/2">
            <span className="absolute -inset-8 rounded-full bg-[#2563eb]/10" />
            <span className="absolute -inset-4 rounded-full bg-[#2563eb]/14" />
            <span className="relative grid h-5 w-5 place-items-center rounded-full border-[3px] border-white bg-[#2563eb] shadow-[0_4px_14px_rgba(37,99,235,0.34)]" />
          </div>

          {filteredStores.map((store, index) => {
            const displayStore = localizeStore(store, language);
            const isSelected = selectedStore === displayStore.id;
            const meta = categoryMeta[displayStore.category];
            const Icon = meta.Icon;

            return (
              <button
                key={store.id}
                type="button"
                aria-label={`${t('chooseStore')} ${displayStore.name}`}
                className="tan-pressable absolute z-20 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-full items-end justify-center"
                style={getMarkerStyle(store, index)}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedStore(displayStore.id);
                }}
              >
                <motion.span
                  animate={{ y: isSelected ? -4 : 0, scale: isSelected ? 1.08 : 1 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 260 }}
                  className="relative flex flex-col items-center"
                >
                  {isSelected && (
                    <span className="mb-1 max-w-[150px] rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-[#14313a] shadow-[0_8px_24px_rgba(15,23,42,0.18)]">
                      {displayStore.name}
                    </span>
                  )}
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full border-[3px] border-white text-white ${meta.marker} ${meta.glow}`}
                  >
                    <Icon size={20} strokeWidth={2.4} />
                  </span>
                  <span className="h-2 w-2 rounded-full bg-black/20 blur-[1px]" />
                </motion.span>
              </button>
            );
          })}
        </div>
      </section>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 px-4 pt-[calc(14px+env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            aria-label={t('back')}
            onClick={() => navigate(-1)}
            className="tan-pressable grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/92 text-[#14313a] shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-xl"
          >
            <ArrowLeft size={22} />
          </button>

          <label className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full bg-white/94 px-4 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <Search size={19} className="shrink-0 text-[#7b8c86]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('searchStorePlaceTag')}
              className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-[#14313a] outline-none placeholder:text-[#8c9b96]"
            />
            {(query || selectedTags.size > 0) && (
              <button
                type="button"
                aria-label={t('clearFilters')}
                onClick={clearFilters}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#eef4f1] text-[#5f716b]"
              >
                <X size={16} />
              </button>
            )}
          </label>
        </div>

        <div className="pointer-events-auto mt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAllTags((previous) => !previous)}
              className={`tan-pressable flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-extrabold shadow-[0_8px_22px_rgba(15,23,42,0.1)] backdrop-blur-xl ${
                showAllTags || selectedTags.size > 0
                  ? 'bg-[#10bfa5] text-white'
                  : 'bg-white/92 text-[#29454d]'
              }`}
            >
              <SlidersHorizontal size={16} />
              {selectedTags.size > 0 ? `${t('filter')} ${selectedTags.size}` : t('filter')}
            </button>

            <span className="rounded-full bg-white/86 px-3 py-2 text-[12px] font-extrabold text-[#64746f] shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              {selectedTags.size > 0 ? `${filteredStores.length} ${t('resultCount')}` : t('allPlaces')}
            </span>

            {selectedTags.size > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTags(new Set())}
                className="tan-pressable h-10 rounded-full bg-white/86 px-3 text-[12px] font-extrabold text-[#0d9488] shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl"
              >
                {t('clear')}
              </button>
            )}
          </div>

          <AnimatePresence>
            {showAllTags && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="mt-2 rounded-[24px] bg-white/92 p-3 shadow-[0_10px_28px_rgba(15,23,42,0.13)] backdrop-blur-xl"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[12px] font-extrabold text-[#64746f]">
                    {t('tagFilter')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAllTags(false)}
                    className="tan-pressable h-8 rounded-full bg-[#eef4f1] px-3 text-[12px] font-extrabold text-[#53645f]"
                  >
                    {t('collapse')}
                  </button>
                </div>

                <div className="max-h-[128px] overflow-y-auto pr-1">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTags(new Set())}
                      className={`tan-pressable min-h-9 rounded-full px-3.5 text-[12px] font-extrabold ${
                        selectedTags.size === 0
                          ? 'bg-[#10bfa5] text-white shadow-[0_6px_16px_rgba(16,191,165,0.24)]'
                          : 'bg-[#eef4f1] text-[#53645f]'
                      }`}
                    >
                      {t('all')}
                    </button>

                    {allTags.map((tag) => {
                      const isActive = selectedTags.has(tag);

                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`tan-pressable min-h-9 rounded-full px-3.5 text-[12px] font-extrabold ${
                            isActive
                              ? 'bg-[#10bfa5] text-white shadow-[0_6px_16px_rgba(16,191,165,0.24)]'
                              : 'bg-[#eef4f1] text-[#53645f]'
                          }`}
                        >
                          {localizeTag(tag, language)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <aside className="absolute right-4 top-[calc(150px+env(safe-area-inset-top))] z-30 flex flex-col gap-2">
        {[
          { id: 'locate', label: t('locate'), icon: LocateFixed },
          { id: 'zoomIn', label: t('zoomIn'), icon: Plus },
          { id: 'zoomOut', label: t('zoomOut'), icon: Minus },
          { id: 'layers', label: t('layers'), icon: Layers },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              onClick={() => {
                if (item.id === 'locate') {
                  setMapOffset({ x: 0, y: 0 });
                }
              }}
              className="tan-pressable grid h-11 w-11 place-items-center rounded-2xl bg-white/92 text-[#29454d] shadow-[0_8px_22px_rgba(15,23,42,0.12)] backdrop-blur-xl"
            >
              <Icon size={19} />
            </button>
          );
        })}
      </aside>

      <div className="absolute left-4 top-[calc(150px+env(safe-area-inset-top))] z-30 rounded-2xl bg-white/88 px-3 py-2 shadow-[0_8px_22px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <div className="flex items-center gap-2 text-[12px] font-bold text-[#64746f]">
          <Building2 size={15} />
          <span>{filteredStores.length} {t('placesUnit')}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeStore ? (
          <motion.section
            key={activeStore.id}
            initial={{ y: 96, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 96, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="absolute inset-x-0 bottom-0 z-50 px-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
          >
            <div className="rounded-[28px] bg-white/96 p-4 text-[#14313a] shadow-[0_-12px_36px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-white ${categoryMeta[activeStore.category].marker}`}
                    >
                      {(() => {
                        const Icon = categoryMeta[activeStore.category].Icon;
                        return <Icon size={18} />;
                      })()}
                    </span>
                    <div className="min-w-0">
                      <h1 className="truncate text-[20px] font-extrabold leading-tight">
                        {activeStore.name}
                      </h1>
                      <p className="text-[12px] font-bold text-[#7b8c86]">
                        {t(categoryMeta[activeStore.category].labelKey)} · {activeStore.distance}km
                      </p>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-[13px] font-medium leading-5 text-[#5f716b]">
                    {activeStore.address}
                  </p>
                </div>

                {selectedStoreData && (
                  <button
                    type="button"
                    aria-label={t('closeStoreDetail')}
                    onClick={() => setSelectedStore(null)}
                    className="tan-pressable grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef4f1] text-[#5f716b]"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="mb-4 flex gap-2 overflow-x-auto tan-scrollbar-hide">
                {activeStore.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="shrink-0 rounded-full bg-[#eef7f5] px-3 py-1.5 text-[12px] font-bold text-[#0d9488]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3 text-[12px] font-semibold text-[#5f716b]">
                <div className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#f5f8f7] px-3">
                  <Clock3 size={16} className="text-[#10bfa5]" />
                  <span className="truncate">{activeStore.hours}</span>
                </div>
                <div className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#f5f8f7] px-3">
                  <Route size={16} className="text-[#10bfa5]" />
                  <span>{activeStore.distance}km · {t('aroundEightMinutes')}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/store/${activeStore.id}`)}
                  className="tan-pressable flex h-13 flex-1 items-center justify-center rounded-2xl border border-[#dfe8e5] bg-white text-[15px] font-extrabold text-[#29454d]"
                >
                  {t('viewDetails')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/store/${activeStore.id}`)}
                  className="tan-pressable flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#16D6C3,#0EA896)] text-[15px] font-extrabold text-white shadow-[var(--tan-cta-shadow)]"
                >
                  <Navigation size={18} />
                  {t('startNavigation')}
                </button>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="empty"
            initial={{ y: 64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 64, opacity: 0 }}
            className="absolute inset-x-0 bottom-0 z-50 px-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
          >
            <div className="rounded-[28px] bg-white/96 p-5 text-center shadow-[0_-12px_36px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
              <p className="text-[18px] font-extrabold text-[#14313a]">{t('noMatchingPlaces')}</p>
              <p className="mt-1 text-[13px] font-medium text-[#6f817b]">
                {t('tryAnotherKeyword')}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="tan-pressable mt-4 h-12 rounded-2xl bg-[#10bfa5] px-6 text-[15px] font-extrabold text-white"
              >
                {t('clearFilters')}
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
