import { useState } from 'react';
import type { ComponentType } from 'react';
import { Car, Home, Image, Languages, Search, ShieldCheck, Star, User, MessageCircleHeart } from 'lucide-react';
import { motion } from 'motion/react';
import MobileDock from '../components/MobileDock';

type ServiceCategory = '地陪' | '民宿' | '包车' | '翻译' | '修图';

interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  provider: string;
  price: string;
  rating: number;
  description: string;
  tags: string[];
  image: string;
}

const serviceCategories: { name: ServiceCategory; icon: ComponentType<{ size?: number }> }[] = [
  { name: '地陪', icon: User },
  { name: '民宿', icon: Home },
  { name: '包车', icon: Car },
  { name: '翻译', icon: Languages },
  { name: '修图', icon: Image },
];

const services: Service[] = [
  {
    id: '1',
    name: '专业中文地陪',
    category: '地陪',
    provider: '张导游',
    price: '¥500/天',
    rating: 4.9,
    description: '熟悉北京各大景点，提供专业讲解服务',
    tags: ['5年经验', '服务周到', '中文流利'],
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=620&fit=crop',
  },
  {
    id: '2',
    name: '韩语翻译陪同',
    category: '地陪',
    provider: '李导游',
    price: '¥600/天',
    rating: 4.8,
    description: '韩语流利，熟悉医美、购物与本地餐厅预约',
    tags: ['韩语流利', '医美专业', '细心可靠'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=620&fit=crop',
  },
  {
    id: '3',
    name: '首尔设计民宿',
    category: '民宿',
    provider: '云间小筑',
    price: '¥680/晚',
    rating: 4.7,
    description: '地铁直达，周边美食多，适合两人轻旅行',
    tags: ['近地铁', '干净安静', '可做饭'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=620&fit=crop',
  },
  {
    id: '4',
    name: '商务包车服务',
    category: '包车',
    provider: '安心出行',
    price: '¥800/天',
    rating: 4.8,
    description: '商务车型，专业司机，支持机场接送与一日行程',
    tags: ['准时', '行李协助', '路线熟悉'],
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=620&fit=crop',
  },
  {
    id: '5',
    name: '中韩翻译服务',
    category: '翻译',
    provider: '王翻译',
    price: '¥400/天',
    rating: 4.9,
    description: '医美、商务、餐厅预约均可陪同沟通',
    tags: ['中韩互译', '专业术语', '陪同沟通'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=620&fit=crop',
  },
  {
    id: '6',
    name: '自然感修图',
    category: '修图',
    provider: '美图工作室',
    price: '¥50/张',
    rating: 4.8,
    description: '人像精修、肤色统一、保留自然质感',
    tags: ['自然肤色', '快速交付', '批量处理'],
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=500&h=620&fit=crop',
  },
];

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('地陪');
  const filteredServices = services.filter((service) => service.category === selectedCategory);
  const selectedCategoryCount = filteredServices.length;
  const averageRating =
    filteredServices.reduce((sum, service) => sum + service.rating, 0) / selectedCategoryCount;

  return (
    <main className="tan-soft-page min-h-dvh">
      <div className="px-4 pt-[calc(18px+env(safe-area-inset-top))] pb-[calc(112px+env(safe-area-inset-bottom))]">
        <header className="mb-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold text-[#10a696]">Tanmap</p>
              <h1 className="mt-1 text-[32px] font-extrabold leading-none text-[#073238]">
                本地服务
              </h1>
              <p className="mt-2 text-[14px] font-semibold text-[#8A94A3]">
                精选地陪、翻译、包车和旅拍修图
              </p>
            </div>
            <button
              type="button"
              aria-label="搜索服务"
              className="tan-pressable grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-white/86 text-[#073238] shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            >
              <Search size={27} strokeWidth={2.1} />
            </button>
          </div>

          <section className="rounded-[28px] border border-white/70 bg-white/76 p-2 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="grid grid-cols-5 gap-1.5">
              {serviceCategories.map((category) => {
                const Icon = category.icon;
                const active = selectedCategory === category.name;
                const count = services.filter((service) => service.category === category.name).length;

                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => setSelectedCategory(category.name)}
                    className={`tan-pressable flex min-h-[66px] min-w-0 flex-col items-center justify-center gap-1 rounded-[20px] px-1 text-[12px] font-extrabold ${
                      active
                        ? 'bg-[#10BFA5] text-white shadow-[0_10px_22px_rgba(18,184,166,0.22)]'
                        : 'bg-[#F2F8F6] text-[#52645f]'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="leading-none">{category.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                        active ? 'bg-white/22 text-white' : 'bg-white/78 text-[#8A94A3]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 rounded-[22px] bg-[#F2F8F6] p-2">
              <div>
                <p className="text-[11px] font-bold text-[#8A94A3]">当前分类</p>
                <p className="mt-1 text-[14px] font-extrabold text-[#073238]">{selectedCategory}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8A94A3]">可预约</p>
                <p className="mt-1 text-[14px] font-extrabold text-[#073238]">
                  {selectedCategoryCount} 项
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8A94A3]">均分</p>
                <p className="mt-1 flex items-center gap-1 text-[14px] font-extrabold text-[#F5A400]">
                  <Star size={14} fill="#F5A400" />
                  {averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          </section>
        </header>

        <section className="space-y-4">
          {filteredServices.map((service, index) => (
            <motion.article
              key={service.id}
              className="overflow-hidden rounded-[28px] border border-white/72 bg-white/90 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="flex gap-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-[118px] w-[98px] shrink-0 rounded-[22px] object-cover shadow-[0_8px_18px_rgba(15,23,42,0.12)]"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-[21px] font-extrabold leading-tight text-[#073238]">
                        {service.name}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-semibold text-[#667085]">
                        <span className="truncate">{service.provider}</span>
                        <span className="flex items-center gap-1 font-bold text-[#F5A400]">
                          <Star size={15} fill="#F5A400" />
                          {service.rating}
                        </span>
                      </div>
                    </div>
                    <strong className="shrink-0 text-[20px] font-extrabold leading-tight text-[#0EA896]">
                      {service.price}
                    </strong>
                  </div>
                  <p className="line-clamp-3 text-[14px] font-medium leading-5 text-[#5F6B7A]">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {service.tags.map((tag, tagIndex) => (
                  <span
                    key={tag}
                    className="flex min-h-9 items-center gap-1.5 rounded-xl bg-[#EAF8F5] px-3 text-[12px] font-extrabold text-[#0B8F82]"
                  >
                    {tagIndex === 0 ? <ShieldCheck size={15} /> : <MessageCircleHeart size={15} />}
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-[1fr_0.42fr] gap-3">
                <button
                  type="button"
                  className="tan-pressable h-12 rounded-[18px] bg-[linear-gradient(135deg,#12B8A6,#0EA896)] text-[16px] font-extrabold text-white shadow-[var(--tan-cta-shadow)]"
                >
                  立即预约
                </button>
                <button
                  type="button"
                  className="tan-pressable h-12 rounded-[18px] border border-[#12B8A6]/35 bg-white text-[16px] font-extrabold text-[#0EA896]"
                >
                  详情
                </button>
              </div>
            </motion.article>
          ))}
        </section>
      </div>

      <MobileDock active="services" />
    </main>
  );
}
