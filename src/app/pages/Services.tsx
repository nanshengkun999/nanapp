import { useMemo, useState } from 'react';
import { ClipboardList, Edit3, Plus, Search, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import MobileDock from '../components/MobileDock';
import { useLanguage } from '../contexts/LanguageContext';

type ServiceCategory = 'all' | 'localGuide' | 'translation' | 'medicalCompanion' | 'pickup' | 'photoCompanion';

interface ServicePerson {
  id: string;
  category: Exclude<ServiceCategory, 'all'>;
  nameKey: string;
  introKey: string;
  priceKey: string;
  avatar: string;
}

const categories: ServiceCategory[] = ['all', 'localGuide', 'translation', 'medicalCompanion', 'pickup', 'photoCompanion'];

const people: ServicePerson[] = [
  {
    id: '1',
    category: 'localGuide',
    nameKey: 'servicePersonJieun',
    introKey: 'serviceIntroJieun',
    priceKey: 'perHour120',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    category: 'medicalCompanion',
    nameKey: 'servicePersonMinseo',
    introKey: 'serviceIntroMinseo',
    priceKey: 'perHour150',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    category: 'pickup',
    nameKey: 'servicePersonJunho',
    introKey: 'serviceIntroJunho',
    priceKey: 'perRide80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    category: 'photoCompanion',
    nameKey: 'servicePersonWoojin',
    introKey: 'serviceIntroWoojin',
    priceKey: 'perHour100',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
  },
  {
    id: '5',
    category: 'translation',
    nameKey: 'servicePersonShuyan',
    introKey: 'serviceIntroShuyan',
    priceKey: 'perHour100',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=200&h=200&fit=crop',
  },
];

export default function Services() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [showMenu, setShowMenu] = useState(false);

  const filteredPeople = useMemo(() => {
    if (selectedCategory === 'all') return people;
    return people.filter((person) => person.category === selectedCategory);
  }, [selectedCategory]);

  const handleReserve = (person: ServicePerson) => {
    toast.info(`${t(person.nameKey)} ${t('reservePending')}`);
  };

  return (
    <main className="tan-soft-page min-h-dvh bg-[#F7FAF9]">
      <div className="px-4 pt-[calc(18px+env(safe-area-inset-top))] pb-[calc(96px+env(safe-area-inset-bottom))]">
        <header className="mb-2.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[25px] font-extrabold leading-tight tracking-normal text-[#073238]">
              {t('servicesTitle')}
            </h1>
            <p className="mt-1 text-[13px] font-semibold leading-5 text-[#7A8790]">
              {t('servicesSubtitle')}
            </p>
          </div>
          <button
            type="button"
            aria-label={t('searchServices')}
            className="tan-pressable grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/88 text-[#073238] shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          >
            <Search size={21} strokeWidth={2.1} />
          </button>
        </header>

        <nav
          className="-mx-4 mb-3 overflow-x-auto px-4 tan-scrollbar-hide"
          aria-label={t('serviceCategory')}
        >
          <div className="flex min-w-max items-center gap-4">
            {categories.map((category) => {
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`tan-pressable relative h-9 px-0.5 text-[14px] font-extrabold ${
                    active ? 'text-[#10BFA5]' : 'text-[#7A8790]'
                  }`}
                >
                  {t(category)}
                  {active && (
                    <motion.span
                      layoutId="service-category-line"
                      className="absolute inset-x-0 bottom-0 mx-auto h-0.5 w-5 rounded-full bg-[#10BFA5]"
                      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <section className="space-y-2.5">
          {filteredPeople.map((person, index) => (
            <motion.article
              key={person.id}
              className="flex min-h-[84px] items-center gap-2.5 rounded-[19px] border border-white/78 bg-white/92 p-2.5 shadow-[0_8px_22px_rgba(15,23,42,0.052)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
            >
              <img
                src={person.avatar}
                alt={t(person.nameKey)}
                className="h-[58px] w-[58px] shrink-0 rounded-[16px] object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <h2 className="truncate text-[15px] font-extrabold leading-tight text-[#073238]">
                    {t(person.nameKey)}
                  </h2>
                  <span className="rounded-full bg-[#EAF8F5] px-1.5 py-0.5 text-[10px] font-bold text-[#0EA896]">
                    {t(person.category)}
                  </span>
                </div>
                <p className="mt-1 truncate text-[12px] font-medium leading-5 text-[#7B8794]">
                  {t(person.introKey)}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <strong className="text-[12px] font-extrabold leading-none text-[#0EA896]">
                  {t(person.priceKey)}
                </strong>
                <button
                  type="button"
                  onClick={() => handleReserve(person)}
                  className="tan-pressable h-8 rounded-full bg-[#E7F8F5] px-3 text-[12px] font-extrabold text-[#0EA896]"
                >
                  {t('reserve')}
                </button>
              </div>
            </motion.article>
          ))}
        </section>
      </div>

      <div
        className="fixed bottom-[calc(88px+env(safe-area-inset-bottom))] z-[70]"
        style={{ right: 'max(18px, calc((100vw - 402px) / 2 + 18px))' }}
      >
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="mb-2.5 w-[144px] rounded-[20px] border border-white/80 bg-white/95 p-1.5 shadow-[0_10px_26px_rgba(15,23,42,0.12)] backdrop-blur-xl"
            >
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  console.log('publish service');
                  navigate('/services/provider');
                }}
                className="tan-pressable flex h-10 w-full items-center gap-2.5 rounded-[15px] px-2.5 text-[13px] font-extrabold text-[#073238]"
              >
                <Edit3 size={16} className="text-[#10BFA5]" />
                {t('publishService')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  console.log('manage service');
                  navigate('/services/provider');
                }}
                className="tan-pressable flex h-10 w-full items-center gap-2.5 rounded-[15px] px-2.5 text-[13px] font-extrabold text-[#073238]"
              >
                <ClipboardList size={16} className="text-[#10BFA5]" />
                {t('manageService')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          aria-label={t('serviceActions')}
          onClick={() => setShowMenu((previous) => !previous)}
          className="tan-pressable grid h-11 w-11 place-items-center rounded-full bg-white/92 text-[#10BFA5] shadow-[0_10px_24px_rgba(15,23,42,0.12)] backdrop-blur-xl"
        >
          {showMenu ? <UserRound size={21} /> : <Plus size={24} />}
        </button>
      </div>

      <MobileDock active="services" />
    </main>
  );
}
