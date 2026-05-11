import {
  ArrowLeft,
  Clock3,
  Heart,
  MapPin,
  Music2,
  Navigation,
  Sparkles,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { stores, type Category } from '../data/stores';
import { useLanguage } from '../contexts/LanguageContext';
import { localizeStore } from '../utils/storeI18n';

const categoryMeta: Record<
  Category,
  {
    Icon: LucideIcon;
    labelKey: string;
    accent: string;
    surface: string;
  }
> = {
  美食: {
    Icon: Utensils,
    labelKey: 'diningSaved',
    accent: 'bg-[#f97316]',
    surface: 'from-[#fff4e8] to-white',
  },
  医美: {
    Icon: Sparkles,
    labelKey: 'clinicBooking',
    accent: 'bg-[#ec4899]',
    surface: 'from-[#fff0f7] to-white',
  },
  夜生活: {
    Icon: Music2,
    labelKey: 'nightlife',
    accent: 'bg-[#6366f1]',
    surface: 'from-[#f0f1ff] to-white',
  },
};

const savedCategoryOrder: Category[] = ['美食', '医美', '夜生活'];

export default function SavedStores() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const savedStores = stores.filter((store) => store.saved);
  const displaySavedStores = savedStores.map((store) => localizeStore(store, language));
  const categoryCounts = savedCategoryOrder.map((category) => ({
    category,
    count: savedStores.filter((store) => store.category === category).length,
    meta: categoryMeta[category],
  }));

  return (
    <main className="tan-soft-page min-h-dvh">
      <header className="sticky top-0 z-30 px-4 pt-[calc(12px+env(safe-area-inset-top))] pb-3">
        <div className="rounded-[28px] border border-white/70 bg-white/78 p-3 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={t('returnHome')}
              onClick={() => navigate('/')}
              className="tan-pressable grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eef7f5] text-[#29454d]"
            >
              <ArrowLeft size={21} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-extrabold leading-none text-[#10a696]">Tanmap</p>
              <div className="mt-1 flex min-w-0 items-end gap-2">
                <h1 className="truncate text-[27px] font-extrabold leading-none text-[#14313a]">
                  {t('myFavorites')}
                </h1>
                <span className="mb-0.5 shrink-0 rounded-full bg-[#e8f8f5] px-2.5 py-1 text-[12px] font-extrabold text-[#0d9488]">
                  {savedStores.length} {t('placesUnit')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 rounded-[22px] bg-[#f2f8f6] p-1.5">
            {categoryCounts.map(({ category, count, meta }) => {
              const Icon = meta.Icon;

              return (
                <div
                  key={category}
                  className="flex min-w-0 items-center gap-2 rounded-[18px] bg-white/72 px-2.5 py-2"
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-xl text-white ${meta.accent}`}>
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-extrabold leading-none text-[#14313a]">{count}</p>
                    <p className="mt-1 truncate text-[10px] font-bold leading-none text-[#7b8c86]">
                      {t(category === '美食' ? 'food' : category === '医美' ? 'beauty' : 'nightlife')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <section className="px-5 pt-1 pb-[calc(28px+env(safe-area-inset-bottom))]">
        {savedStores.length === 0 ? (
          <div className="mt-20 flex flex-col items-center rounded-[28px] bg-white/88 px-7 py-12 text-center shadow-[var(--tan-shadow)]">
            <Heart size={64} className="mb-6 text-[#8df5eb]" strokeWidth={1.8} />
            <h2 className="text-[25px] font-extrabold text-[#14313a]">{t('noFavorites')}</h2>
            <p className="mt-2 text-[15px] font-semibold text-[#7b8c86]">
              {t('noFavoritesDesc')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="tan-pressable mt-8 h-13 rounded-2xl bg-[#10bfa5] px-8 text-[16px] font-extrabold text-white shadow-[var(--tan-cta-shadow)]"
            >
              {t('discoverPlaces')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displaySavedStores.map((store, index) => {
              const meta = categoryMeta[store.category];
              const Icon = meta.Icon;

              return (
                <motion.article
                  key={store.id}
                  className={`overflow-hidden rounded-[26px] bg-gradient-to-br ${meta.surface} shadow-[0_10px_26px_rgba(15,23,42,0.08)]`}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.22, delay: index * 0.035 }}
                >
                  <div className="w-full p-4 text-left">
                    <div className="mb-3 flex items-start gap-3">
                      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white ${meta.accent}`}>
                        <Icon size={22} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-[20px] font-extrabold leading-tight text-[#14313a]">
                            {store.name}
                          </h2>
                          <Heart size={17} className="shrink-0 fill-[#10bfa5] text-[#10bfa5]" />
                        </div>
                        <p className="mt-1 text-[12px] font-extrabold text-[#0d9488]">
                          {t(meta.labelKey)} · {store.distance}km
                        </p>
                      </div>
                    </div>

                    <p className="mb-3 flex items-start gap-2 text-[13px] font-semibold leading-5 text-[#5f716b]">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-[#10bfa5]" />
                      <span>{store.address}</span>
                    </p>

                    <div className="mb-3 flex gap-2 overflow-x-auto tan-scrollbar-hide">
                      {store.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="shrink-0 rounded-full bg-white/78 px-3 py-1.5 text-[12px] font-extrabold text-[#53645f]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                      <div className="flex min-h-10 items-center gap-2 rounded-2xl bg-white/68 px-3 text-[12px] font-bold text-[#64746f]">
                        <Clock3 size={15} className="text-[#10bfa5]" />
                        <span className="truncate">{store.hours}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/store/${store.id}`)}
                        className="tan-pressable h-10 rounded-2xl border border-[#dfe8e5] bg-white/78 px-3 text-[12px] font-extrabold text-[#29454d]"
                      >
                        {t('details')}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/map?store=${store.id}`)}
                        className="tan-pressable flex h-10 items-center gap-1.5 rounded-2xl bg-[#10bfa5] px-3 text-[12px] font-extrabold text-white"
                      >
                        <Navigation size={15} />
                        {t('map')}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
