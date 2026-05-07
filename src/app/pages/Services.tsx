import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Home, Car, Languages, Image, Video, Heart, MessageSquare, MoreVertical, MapPin, Map } from 'lucide-react';
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

const categories: { name: ServiceCategory; nameKey: string; icon: React.ReactNode }[] = [
  { name: '地陪', nameKey: 'localGuide', icon: <User size={20} /> },
  { name: '民宿', nameKey: 'guesthouse', icon: <Home size={20} /> },
  { name: '包车', nameKey: 'carRental', icon: <Car size={20} /> },
  { name: '翻译', nameKey: 'translation', icon: <Languages size={20} /> },
  { name: '修图', nameKey: 'photoEdit', icon: <Image size={20} /> },
  { name: '剪辑视频', nameKey: 'videoEdit', icon: <Video size={20} /> },
];

export default function Services() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('地陪');

  const filteredServices = services.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 分类导航 - 顶部固定 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 text-sm ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat.icon}
              <span>{t(cat.nameKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 服务列表 */}
      <div className="p-2 space-y-2">
        {filteredServices.map((service) => (
          <motion.div
            key={service.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex gap-3 p-2.5">
              <img
                src={service.image}
                alt={service.name}
                className="w-16 h-16 rounded-md object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm truncate">{service.name}</h3>
                  <span className="text-teal-600 font-bold text-sm whitespace-nowrap">
                    {service.price}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">{service.provider}</span>
                  <span className="text-yellow-500 text-xs">★ {service.rating}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                  {service.description}
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:shadow-md transition-shadow">
                    {t('bookNowBtn')}
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-50">
                    {t('detailsBtn')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
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
          className="flex flex-col items-center justify-center gap-1 text-gray-900"
        >
          <MapPin size={24} />
          <span className="text-xs">{t('services')}</span>
        </button>

        <button
          onClick={() => navigate('/forum')}
          className="flex flex-col items-center justify-center gap-1 text-gray-400"
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
