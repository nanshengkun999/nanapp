import { useState } from 'react';
import type { ComponentType } from 'react';
import {
  ArrowLeft,
  Bell,
  Building2,
  Filter,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  PlusCircle,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';

interface Post {
  id: string;
  author: {
    nameKey: string;
    avatar: string;
    level: number;
  };
  timeAgoKey: string;
  type: 'sale' | 'wanted';
  titleKey: string;
  contentKey: string;
  price?: string;
  locationKey: string;
  image: string;
  likes: number;
  comments: number;
  stars: number;
}

const bars = [
  {
    id: 'second-hand',
    titleKey: 'secondHand',
    moderatorKey: 'moderatorXiaojin',
    icon: ShoppingBag,
    color: '#12B8A6',
  },
  {
    id: 'housing',
    titleKey: 'housing',
    moderatorKey: 'moderatorLeo',
    icon: Building2,
    color: '#8B5CF6',
  },
  {
    id: 'party',
    titleKey: 'party',
    moderatorKey: 'moderatorDjk',
    icon: Sparkles,
    color: '#2F80ED',
  },
  {
    id: 'poll',
    titleKey: 'poll',
    moderatorKey: 'moderatorTicket',
    icon: PlusCircle,
    color: '#22C55E',
  },
];

const posts: Post[] = [
  {
    id: '1',
    author: {
      nameKey: 'forumAuthorAjie',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop',
      level: 4,
    },
    timeAgoKey: 'oneHourAgo',
    type: 'sale',
    titleKey: 'postCameraTitle',
    contentKey: 'postCameraContent',
    price: '¥450,000',
    locationKey: 'hongdaeEntrance',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=420&h=420&fit=crop',
    likes: 36,
    comments: 12,
    stars: 8,
  },
  {
    id: '2',
    author: {
      nameKey: 'forumAuthorApple',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop',
      level: 3,
    },
    timeAgoKey: 'twoHoursAgo',
    type: 'wanted',
    titleKey: 'postIpadTitle',
    contentKey: 'postIpadContent',
    locationKey: 'gangnamStationNearby',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=420&h=420&fit=crop',
    likes: 28,
    comments: 9,
    stars: 6,
  },
];

export default function Forum() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'latest' | 'hot'>('latest');
  const [selectedBar, setSelectedBar] = useState<string | null>(null);

  return (
    <main className="tan-soft-page">
      <div className="tan-page-content">
        <header className="mb-4 grid grid-cols-[40px_auto_1fr_auto] items-center gap-2.5">
          <button
            type="button"
            aria-label={t('returnHome')}
            onClick={() => navigate('/')}
            className="tan-pressable grid h-10 w-10 place-items-center rounded-full bg-white/80 text-[#073238] shadow-[0_8px_22px_rgba(15,23,42,0.07)] backdrop-blur-xl"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[24px] font-extrabold text-[#073238]">Tanmap</h1>
          <label className="tan-glass flex h-10 min-w-0 items-center gap-2 rounded-[20px] px-3">
            <Search className="shrink-0 text-[#8A94A3]" size={18} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('forumSearch')}
              className="min-w-0 flex-1 bg-transparent text-[12px] text-[#1F2933] outline-none placeholder:text-[#A8B0BA]"
            />
          </label>
          <button
            type="button"
            aria-label={t('notification')}
            className="tan-pressable grid h-9 w-9 place-items-center rounded-full text-[#073238]"
          >
            <Bell size={21} />
          </button>
        </header>

        <section className="mb-5 flex gap-2.5 overflow-x-auto pb-1 tan-scrollbar-hide">
          {bars.map((bar) => {
            const Icon = bar.icon;
            const active = selectedBar === bar.id;
            return (
              <button
                key={bar.id}
                type="button"
                onClick={() => setSelectedBar(active ? null : bar.id)}
                className={`tan-pressable tan-card flex h-[88px] w-[92px] shrink-0 flex-col items-center justify-center gap-1.5 p-2 ${
                  active ? 'ring-2 ring-[#12B8A6]/40' : ''
                }`}
              >
                <Icon size={28} color={bar.color} strokeWidth={2.2} />
                <span className="text-center text-[12px] font-extrabold leading-tight text-[#111827]">
                  {t(bar.titleKey)}
                </span>
                <span className="text-[10px] font-semibold text-[#8A94A3]">
                  {t('moderator')} {t(bar.moderatorKey)}
                </span>
              </button>
            );
          })}
        </section>

        <section className="mb-3.5 flex items-center justify-between">
          <div className="flex gap-5">
            {[
              { id: 'latest' as const, label: t('latest') },
              { id: 'hot' as const, label: t('hot') },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`tan-pressable relative pb-1.5 text-[17px] font-extrabold ${
                  filter === item.id ? 'text-[#10BFA5]' : 'text-[#8A94A3]'
                }`}
              >
                {item.label}
                {filter === item.id && (
                  <motion.span
                    layoutId="forum-filter"
                    className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#10BFA5]"
                  />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="tan-pressable flex h-9 items-center gap-1.5 rounded-full bg-white/72 px-3.5 text-[13px] font-bold text-[#5F6B7A] shadow-[var(--tan-shadow)]"
          >
            {t('filter')}
            <Filter size={15} />
          </button>
        </section>

        <section className="space-y-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              className="tan-card p-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="mb-3 flex items-center gap-2.5">
                <img
                  src={post.author.avatar}
                  alt={t(post.author.nameKey)}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[16px] font-extrabold text-[#111827]">
                      {t(post.author.nameKey)}
                    </span>
                    <span className="rounded-full border border-[#12B8A6]/30 bg-[#E6FAF6] px-2 py-0.5 text-[11px] font-bold text-[#0EA896]">
                      Lv.{post.author.level}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#8A94A3]">{t(post.timeAgoKey)}</p>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_104px] gap-3">
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`rounded-lg px-2 py-0.5 text-[11px] font-extrabold ${
                        post.type === 'sale'
                          ? 'bg-[#EAF2FF] text-[#2F80ED]'
                          : 'bg-[#E8F8EF] text-[#12B76A]'
                      }`}
                    >
                      {t(post.type)}
                    </span>
                    <h2 className="truncate text-[16px] font-extrabold text-[#111827]">{t(post.titleKey)}</h2>
                  </div>
                  <p className="line-clamp-3 text-[13px] leading-5 text-[#4B5563]">{t(post.contentKey)}</p>
                  {post.price && <p className="mt-2.5 text-[20px] font-extrabold text-[#EF4444]">{post.price}</p>}
                  <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-[#7A8492]">
                    <MapPin size={14} />
                    {t(post.locationKey)}
                  </p>
                </div>
                <img
                  src={post.image}
                  alt={t(post.titleKey)}
                  className="h-[104px] w-[104px] rounded-[16px] object-cover"
                />
              </div>

              <div className="mt-3 flex items-center gap-5 border-t border-[var(--tan-divider)] pt-3 text-[#7A8492]">
                <ActionIcon icon={Heart} value={post.likes} />
                <ActionIcon icon={MessageCircle} value={post.comments} />
                <ActionIcon icon={Star} value={post.stars} />
                <button type="button" className="tan-pressable ml-auto">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}

function ActionIcon({
  icon: Icon,
  value,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  value: number;
}) {
  return (
    <button type="button" className="tan-pressable flex items-center gap-1.5 text-[13px] font-bold">
      <Icon size={18} strokeWidth={2} />
      {value}
    </button>
  );
}
