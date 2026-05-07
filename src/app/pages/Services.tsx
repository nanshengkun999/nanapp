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

  return (
    <main className="tan-soft-page">
      <div className="tan-page-content">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-[38px] font-extrabold leading-none tracking-normal text-[#073238]">
              Tanmap
            </h1>
            <p className="mt-3 text-[16px] font-medium text-[#8A94A3]">
              精选本地服务 · 让旅程更轻松
            </p>
          </div>
          <button
            type="button"
            aria-label="搜索服务"
            className="tan-pressable tan-glass grid h-16 w-16 place-items-center rounded-full text-[#073238]"
          >
            <Search size={32} strokeWidth={2.1} />
          </button>
        </header>

        <section className="tan-glass mb-8 flex gap-3 overflow-x-auto rounded-[34px] p-3 tan-scrollbar-hide">
          {serviceCategories.map((category) => {
            const Icon = category.icon;
            const active = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                type="button"
                onClick={() => setSelectedCategory(category.name)}
                className={`tan-pressable flex h-14 shrink-0 items-center gap-2 rounded-[24px] px-5 text-[17px] font-extrabold ${
                  active
                    ? 'bg-[#10BFA5] text-white shadow-[0_10px_24px_rgba(18,184,166,0.22)]'
                    : 'bg-white/75 text-[#4B5563]'
                }`}
              >
                <Icon size={23} />
                {category.name}
              </button>
            );
          })}
        </section>

        <section className="space-y-6">
          {filteredServices.map((service, index) => (
            <motion.article
              key={service.id}
              className="tan-card tan-enter p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="flex gap-5">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-[136px] w-28 shrink-0 rounded-[22px] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[24px] font-extrabold leading-tight text-[#073238]">
                        {service.name}
                      </h2>
                      <div className="mt-2 flex items-center gap-3 text-[17px] text-[#667085]">
                        <span>{service.provider}</span>
                        <span className="flex items-center gap-1 font-bold text-[#F5A400]">
                          <Star size={19} fill="#F5A400" />
                          {service.rating}
                        </span>
                      </div>
                    </div>
                    <strong className="shrink-0 text-[24px] font-extrabold text-[#0EA896]">
                      {service.price}
                    </strong>
                  </div>
                  <p className="mt-4 text-[17px] leading-relaxed text-[#5F6B7A]">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {service.tags.map((tag, tagIndex) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 rounded-xl bg-[#EAF8F5] px-4 py-2 text-[14px] font-bold text-[#0B8F82]"
                  >
                    {tagIndex === 0 ? <ShieldCheck size={18} /> : <MessageCircleHeart size={18} />}
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-[1fr_0.42fr] gap-4">
                <button
                  type="button"
                  className="tan-pressable h-14 rounded-[18px] bg-[linear-gradient(135deg,#12B8A6,#0EA896)] text-[18px] font-extrabold text-white shadow-[var(--tan-cta-shadow)]"
                >
                  立即预约
                </button>
                <button
                  type="button"
                  className="tan-pressable h-14 rounded-[18px] border border-[#12B8A6]/35 bg-white text-[18px] font-extrabold text-[#0EA896]"
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
