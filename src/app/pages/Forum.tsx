import { useState } from 'react';
import type { ComponentType } from 'react';
import {
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
import MobileDock from '../components/MobileDock';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  timeAgo: string;
  type: '出售' | '求购';
  title: string;
  content: string;
  price?: string;
  location: string;
  image: string;
  likes: number;
  comments: number;
  stars: number;
}

const bars = [
  {
    id: 'second-hand',
    title: '二手交易吧',
    moderator: '小金',
    icon: ShoppingBag,
    color: '#12B8A6',
  },
  {
    id: 'housing',
    title: '房源租售吧',
    moderator: '里奥',
    icon: Building2,
    color: '#8B5CF6',
  },
  {
    id: 'party',
    title: '蹦迪组队吧',
    moderator: 'DJ K',
    icon: Sparkles,
    color: '#2F80ED',
  },
  {
    id: 'poll',
    title: '发起投票吧',
    moderator: '小票',
    icon: PlusCircle,
    color: '#22C55E',
  },
];

const posts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Seoul阿杰',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop',
      level: 4,
    },
    timeAgo: '1小时前',
    type: '出售',
    title: '出一个几乎全新的相机',
    content: '因回国出 Sony ZV-E10，买了不到2个月，带原装盒子和配件，价格可小刀。',
    price: '¥450,000',
    location: '弘大入口站',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=420&h=420&fit=crop',
    likes: 36,
    comments: 12,
    stars: 8,
  },
  {
    id: '2',
    author: {
      name: '小苹果',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop',
      level: 3,
    },
    timeAgo: '2小时前',
    type: '求购',
    title: '求购 iPad Pro 11寸 M2',
    content: '最好是国行，成色好，配件齐全。有出的小伙伴滴滴。',
    location: '江南站附近',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=420&h=420&fit=crop',
    likes: 28,
    comments: 9,
    stars: 6,
  },
];

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'latest' | 'hot'>('latest');
  const [selectedBar, setSelectedBar] = useState<string | null>(null);

  return (
    <main className="tan-soft-page">
      <div className="tan-page-content">
        <header className="mb-7 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <h1 className="text-[30px] font-extrabold text-[#073238]">Tanmap</h1>
          <label className="tan-glass flex h-14 min-w-0 items-center gap-3 rounded-[28px] px-4">
            <Search className="shrink-0 text-[#8A94A3]" size={24} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="搜索帖子、吧友、内容..."
              className="min-w-0 flex-1 bg-transparent text-[15px] text-[#1F2933] outline-none placeholder:text-[#A8B0BA]"
            />
          </label>
          <button
            type="button"
            aria-label="通知"
            className="tan-pressable grid h-12 w-12 place-items-center rounded-full text-[#073238]"
          >
            <Bell size={27} />
          </button>
        </header>

        <section className="mb-8 flex gap-4 overflow-x-auto pb-2 tan-scrollbar-hide">
          {bars.map((bar) => {
            const Icon = bar.icon;
            const active = selectedBar === bar.id;
            return (
              <button
                key={bar.id}
                type="button"
                onClick={() => setSelectedBar(active ? null : bar.id)}
                className={`tan-pressable tan-card flex h-[118px] w-[118px] shrink-0 flex-col items-center justify-center gap-2 p-3 ${
                  active ? 'ring-2 ring-[#12B8A6]/40' : ''
                }`}
              >
                <Icon size={38} color={bar.color} strokeWidth={2.2} />
                <span className="text-center text-[15px] font-extrabold leading-tight text-[#111827]">
                  {bar.title}
                </span>
                <span className="text-[12px] font-semibold text-[#8A94A3]">吧主 {bar.moderator}</span>
              </button>
            );
          })}
        </section>

        <section className="mb-5 flex items-center justify-between">
          <div className="flex gap-8">
            {[
              { id: 'latest' as const, label: '最新' },
              { id: 'hot' as const, label: '热门' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`tan-pressable relative pb-2 text-[22px] font-extrabold ${
                  filter === item.id ? 'text-[#10BFA5]' : 'text-[#8A94A3]'
                }`}
              >
                {item.label}
                {filter === item.id && (
                  <motion.span
                    layoutId="forum-filter"
                    className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-[#10BFA5]"
                  />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="tan-pressable flex h-12 items-center gap-2 rounded-full bg-white/72 px-5 text-[16px] font-bold text-[#5F6B7A] shadow-[var(--tan-shadow)]"
          >
            筛选
            <Filter size={18} />
          </button>
        </section>

        <section className="space-y-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              className="tan-card p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[20px] font-extrabold text-[#111827]">
                      {post.author.name}
                    </span>
                    <span className="rounded-full border border-[#12B8A6]/30 bg-[#E6FAF6] px-2.5 py-0.5 text-[13px] font-bold text-[#0EA896]">
                      Lv.{post.author.level}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[14px] text-[#8A94A3]">{post.timeAgo}</p>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_128px] gap-4">
                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className={`rounded-lg px-3 py-1 text-[14px] font-extrabold ${
                        post.type === '出售'
                          ? 'bg-[#EAF2FF] text-[#2F80ED]'
                          : 'bg-[#E8F8EF] text-[#12B76A]'
                      }`}
                    >
                      {post.type}
                    </span>
                    <h2 className="truncate text-[20px] font-extrabold text-[#111827]">{post.title}</h2>
                  </div>
                  <p className="text-[16px] leading-relaxed text-[#4B5563]">{post.content}</p>
                  {post.price && <p className="mt-4 text-[24px] font-extrabold text-[#EF4444]">{post.price}</p>}
                  <p className="mt-3 flex items-center gap-2 text-[15px] font-medium text-[#7A8492]">
                    <MapPin size={18} />
                    {post.location}
                  </p>
                </div>
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-32 w-32 rounded-[20px] object-cover"
                />
              </div>

              <div className="mt-5 flex items-center gap-8 border-t border-[var(--tan-divider)] pt-4 text-[#7A8492]">
                <ActionIcon icon={Heart} value={post.likes} />
                <ActionIcon icon={MessageCircle} value={post.comments} />
                <ActionIcon icon={Star} value={post.stars} />
                <button type="button" className="tan-pressable ml-auto">
                  <MoreHorizontal size={24} />
                </button>
              </div>
            </motion.article>
          ))}
        </section>
      </div>

      <MobileDock active="forum" />
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
    <button type="button" className="tan-pressable flex items-center gap-2 text-[16px] font-bold">
      <Icon size={23} strokeWidth={2} />
      {value}
    </button>
  );
}
