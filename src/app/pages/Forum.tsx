import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, ShoppingBag, Building2, Sparkles, PlusCircle, Heart, MessageCircle, Star, MoreHorizontal, MapPin, MessageSquare, MoreVertical, Map } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

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
  images: string[];
  likes: number;
  comments: number;
  stars: number;
}

const getCategoryName = (id: string, t: (key: string) => string) => {
  const names: { [key: string]: string } = {
    '1': t('secondHand'),
    '2': t('housing'),
    '3': t('party'),
    '4': t('poll'),
  };
  return names[id] || '';
};

const categories = [
  {
    id: '1',
    nameKey: 'secondHand',
    icon: <ShoppingBag size={32} className="text-teal-500" />,
    moderatorName: '小金',
    bgColor: 'from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
  },
  {
    id: '2',
    nameKey: 'housing',
    icon: <Building2 size={32} className="text-purple-500" />,
    moderatorName: '里奥',
    bgColor: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200',
  },
  {
    id: '3',
    nameKey: 'party',
    icon: <Sparkles size={32} className="text-blue-500" />,
    moderatorName: 'DJ K',
    bgColor: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
  },
  {
    id: '4',
    nameKey: 'poll',
    icon: <PlusCircle size={32} className="text-emerald-500" />,
    moderatorName: '小票',
    bgColor: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
  },
];

const posts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Seoul阿杰',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      level: 4,
    },
    timeAgo: '1小时前',
    type: '出售',
    title: '出一个几乎全新的相机 📷',
    content: '因回国出 Sony ZV-E10，买了不到2个月，带原装盒子和配件，价格可小刀～',
    price: '¥450,000',
    location: '弘大入口站',
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop'],
    likes: 36,
    comments: 12,
    stars: 8,
  },
  {
    id: '2',
    author: {
      name: '小苹果',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      level: 3,
    },
    timeAgo: '2小时前',
    type: '求购',
    title: '求购 iPad Pro 11寸 M2✨',
    content: '最好是国行，成色好，配件齐全有出的小伙伴滴滴～',
    location: '江南站附近',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'],
    likes: 18,
    comments: 7,
    stars: 3,
  },
  {
    id: '3',
    author: {
      name: '东大门小王',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      level: 2,
    },
    timeAgo: '3小时前',
    type: '出售',
    title: '出一双 Nike Dunk 熊猫 44码',
    content: '只穿过两次，几乎全新，原盒在有需要的来～',
    price: '¥80,000',
    location: '东大门历史文化公园站',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'],
    likes: 24,
    comments: 9,
    stars: 5,
  },
  {
    id: '4',
    author: {
      name: '明洞小李',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      level: 5,
    },
    timeAgo: '5小时前',
    type: '出售',
    title: '出 MacBook Pro 14 M1 Pro',
    content: '用了一年多，成色9成新，16G+512G，性能完美，带原装充电器',
    price: '¥1,200,000',
    location: '明洞站',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'],
    likes: 42,
    comments: 15,
    stars: 11,
  },
];

export default function Forum() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'latest' | 'hot'>('latest');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 z-20 bg-white backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="pt-4 px-4 pb-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              Tanmap
            </h1>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`${t('search')}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 分类按钮 - 正方形横向滚动 */}
      <div className="px-3 py-3 bg-white">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`flex-shrink-0 w-24 h-24 rounded-2xl transition-all border-2 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-br ${category.bgColor} ${category.borderColor} shadow-md`
                  : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full gap-1 p-2">
                {category.icon}
                <span className="text-[10px] font-semibold text-gray-800 leading-tight text-center">
                  {t(category.nameKey)}
                </span>
                <span className="text-[9px] text-gray-500">
                  👑{t('moderator')} {category.moderatorName}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFilter('latest')}
            className={`text-sm font-semibold ${
              filter === 'latest' ? 'text-teal-600' : 'text-gray-500'
            }`}
          >
            {t('latest')}
          </button>
          <button
            onClick={() => setFilter('hot')}
            className={`text-sm font-semibold ${
              filter === 'hot' ? 'text-teal-600' : 'text-gray-500'
            }`}
          >
            {t('hot')}
          </button>
        </div>
        <button className="text-gray-400 text-sm flex items-center gap-1">
          <span>{t('filter')}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* 帖子列表 */}
      <div className="divide-y divide-gray-200 bg-white">
        {posts.map((post) => (
          <div key={post.id} className="p-4 bg-white">
            {/* 用户信息 */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{post.author.name}</span>
                  <span className="px-2 py-0.5 bg-teal-50 text-teal-600 text-xs rounded-full border border-teal-200">
                    Lv.{post.author.level}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{post.timeAgo}</span>
              </div>
            </div>

            {/* 帖子内容 */}
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    post.type === '出售'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {post.type}
                  </span>
                  <span className="ml-2 font-semibold text-gray-900">{post.title}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                  {post.content}
                </p>
                {post.price && (
                  <p className="text-red-500 font-bold text-lg mb-2">{post.price}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={14} />
                  <span>{post.location}</span>
                </div>
              </div>

              {/* 图片 */}
              {post.images.length > 0 && (
                <div className="relative">
                  <img
                    src={post.images[0]}
                    alt="Post image"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  {post.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs flex items-center gap-1">
                      <span>图</span>
                      <span>{post.images.length}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 互动按钮 */}
            <div className="flex items-center gap-6 mt-4 text-gray-500">
              <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <Heart size={20} />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                <MessageCircle size={20} />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-yellow-500 transition-colors">
                <Star size={20} />
                <span className="text-sm">{post.stars}</span>
              </button>
              <button className="ml-auto hover:text-gray-900 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50">
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center justify-center gap-1 text-gray-400"
        >
          <Map size={24} />
          <span className="text-xs">{t('map')}</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center justify-center gap-1 text-gray-400"
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
          className="flex flex-col items-center justify-center gap-1 text-gray-900"
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
    </div>
  );
}
