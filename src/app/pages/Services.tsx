import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight,
  Car,
  Heart,
  Home,
  Image,
  Languages,
  Map,
  MapPin,
  MessageSquare,
  MoreVertical,
  ShieldCheck,
  Star,
  User,
  Video,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

type ServiceCategory = '地陪' | '民宿' | '包车' | '翻译' | '修图' | '剪辑视频';

interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  provider: string;
  price: string;
  rating: number;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    id: '1',
    name: '专业中文地陪',
    category: '地陪',
    provider: '张导游',
    price: '¥500/天',
    rating: 4.9,
    description: '熟悉北京各大景点，提供专业讲解服务',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: '韩语翻译陪同',
    category: '地陪',
    provider: '李导游',
    price: '¥600/天',
    rating: 4.8,
    description: '韩语流利，专业医美翻译',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: '精品民宿 - 三里屯',
    category: '民宿',
    provider: '云间小筑',
    price: '¥680/晚',
    rating: 4.7,
    description: '地铁直达，周边美食众多',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: '豪华民宿 - 国贸CBD',
    category: '民宿',
    provider: '都市之家',
    price: '¥980/晚',
    rating: 4.9,
    description: '商务区核心位置，配套设施完善',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    name: '商务包车服务',
    category: '包车',
    provider: '安心出行',
    price: '¥800/天',
    rating: 4.8,
    description: '奔驰商务车，专业司机',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    name: '机场接送专车',
    category: '包车',
    provider: '快捷出行',
    price: '¥300/次',
    rating: 4.6,
    description: '准时接送，行李协助',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
  },
  {
    id: '7',
    name: '中韩翻译服务',
    category: '翻译',
    provider: '王翻译',
    price: '¥400/天',
    rating: 4.9,
    description: '医美专业翻译，经验丰富',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
  },
  {
    id: '8',
    name: '商务翻译陪同',
    category: '翻译',
    provider: '李翻译',
    price: '¥600/天',
    rating: 4.7,
    description: '商务会议同声传译',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop',
  },
  {
    id: '9',
    name: '专业修图服务',
    category: '修图',
    provider: '美图工作室',
    price: '¥50/张',
    rating: 4.8,
    description: '人像精修，自然美化',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=300&fit=crop',
  },
  {
    id: '10',
    name: '批量修图',
    category: '修图',
    provider: '快修工作室',
    price: '¥30/张起',
    rating: 4.6,
    description: '支持批量处理，快速交付',
    image: 'https://images.unsplash.com/photo-1600132806608-231446b2e7af?w=400&h=300&fit=crop',
  },
  {
    id: '11',
    name: 'Vlog剪辑服务',
    category: '剪辑视频',
    provider: '影像工作室',
    price: '¥500/条',
    rating: 4.9,
    description: '专业调色，音效配乐',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
  },
  {
    id: '12',
    name: '短视频剪辑',
    category: '剪辑视频',
    provider: '创意剪辑',
    price: '¥200/条',
    rating: 4.7,
    description: '抖音快手风格，热门模板',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=400&h=300&fit=crop',
  },
];

const categories: { name: ServiceCategory; nameKey: string; icon: ReactNode }[] = [
  { name: '地陪', nameKey: 'localGuide', icon: <User size={20} /> },
  { name: '民宿', nameKey: 'guesthouse', icon: <Home size={20} /> },
  { name: '包车', nameKey: 'carRental', icon: <Car size={20} /> },
  { name: '翻译', nameKey: 'translation', icon: <Languages size={20} /> },
  { name: '修图', nameKey: 'photoEdit', icon: <Image size={20} /> },
  { name: '剪辑视频', nameKey: 'videoEdit', icon: <Video size={20} /> },
];

const categoryDescriptions: Record<ServiceCategory, string> = {
  地陪: '熟悉本地动线的中文陪同与行程协助',
  民宿: '精选城市核心区住宿，覆盖短住与商务出行',
  包车: '机场接送、日租包车与商务出行服务',
  翻译: '中韩陪同翻译、医美翻译与商务会议支持',
  修图: '人像精修、批量修图与快速交付',
  剪辑视频: '短视频、Vlog 与旅拍素材剪辑',
};

export default function Services() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('地陪');

  const filteredServices = useMemo(
    () => services.filter((s) => s.category === selectedCategory),
    [selectedCategory],
  );

  const selectedCategoryConfig = categories.find((cat) => cat.name === selectedCategory);
  const recommendedService = filteredServices[0];

  return (
    <div className="min-h-dvh bg-slate-50 pb-20 text-slate-950">
      <main className="mx-auto w-full max-w-6xl px-4 pb-6 pt-5 sm:px-6 lg:px-8">
        <section className="mb-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700">
                <ShieldCheck size={16} />
                Tanmap Services
              </div>
              <h1 className="text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">本地服务预约</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                {categoryDescriptions[selectedCategory]}
              </p>
            </div>

            {recommendedService && (
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-lg sm:min-w-72">
                <p className="text-xs font-medium text-teal-200">当前推荐</p>
                <div className="mt-1 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{recommendedService.name}</p>
                    <p className="mt-0.5 text-xs text-slate-300">{recommendedService.provider}</p>
                  </div>
                  <span className="shrink-0 text-base font-bold text-teal-200">{recommendedService.price}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 分类导航 */}
        <div className="sticky top-0 z-20 -mx-4 mb-4 border-y border-slate-200/80 bg-slate-50/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/95 sm:shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;

              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  aria-pressed={isActive}
                >
                  {cat.icon}
                  <span>{t(cat.nameKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-bold text-slate-950">{t(selectedCategoryConfig?.nameKey ?? 'services')}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{filteredServices.length} 项可预约服务</p>
          </div>
        </div>

        {/* 服务列表 */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service, index) => (
            <motion.article
              key={service.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.03 }}
              className="group grid grid-cols-[104px_1fr] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/80 sm:flex sm:flex-col"
            >
              <div className="relative h-full min-h-[164px] w-[104px] overflow-hidden bg-slate-100 sm:h-44 sm:w-full">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                  {t(categories.find((cat) => cat.name === service.category)?.nameKey ?? 'services')}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-950">{service.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{service.provider}</p>
                  </div>
                  <span className="shrink-0 text-right text-base font-bold text-teal-700">{service.price}</span>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
                    <Star size={14} className="fill-current" />
                    {service.rating}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">已认证</span>
                </div>

                <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-600 sm:min-h-12">
                  {service.description}
                </p>

                <div className="mt-auto grid grid-cols-[1fr_auto] gap-2">
                  <button className="min-h-11 rounded-xl bg-teal-600 px-4 text-sm font-bold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700">
                    {t('bookNowBtn')}
                  </button>
                  <button className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                    {t('detailsBtn')}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </section>
      </main>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur">
        <button
          onClick={() => navigate('/')}
          className="flex min-h-12 min-w-12 flex-col items-center justify-center gap-1 rounded-xl text-slate-400 transition-colors hover:text-slate-700"
          aria-label={t('map')}
        >
          <Map size={24} />
          <span className="text-xs">{t('map')}</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex min-h-12 min-w-12 flex-col items-center justify-center gap-1 rounded-xl text-slate-400 transition-colors hover:text-slate-700"
          aria-label={t('favorites')}
        >
          <Heart size={24} />
          <span className="text-xs">{t('favorites')}</span>
        </button>

        <button
          className="flex min-h-12 min-w-12 flex-col items-center justify-center gap-1 rounded-xl text-teal-700"
          aria-label={t('services')}
          aria-current="page"
        >
          <MapPin size={24} />
          <span className="text-xs">{t('services')}</span>
        </button>

        <button
          onClick={() => navigate('/forum')}
          className="flex min-h-12 min-w-12 flex-col items-center justify-center gap-1 rounded-xl text-slate-400 transition-colors hover:text-slate-700"
          aria-label={t('forum')}
        >
          <MessageSquare size={24} />
          <span className="text-xs">{t('forum')}</span>
        </button>

        <button
          onClick={() => navigate('/more')}
          className="flex min-h-12 min-w-12 flex-col items-center justify-center gap-1 rounded-xl text-slate-400 transition-colors hover:text-slate-700"
          aria-label="更多"
        >
          <MoreVertical size={24} />
        </button>
      </div>
    </div>
  );
}
