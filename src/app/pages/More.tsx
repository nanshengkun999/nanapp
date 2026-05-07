import { useNavigate } from 'react-router';
import { ShoppingBag, Settings, Map, Heart, MessageSquare, MoreVertical, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function More() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold">{t('more')}</h1>
        </div>
      </div>

      {/* 菜单选项 */}
      <div className="p-4 space-y-3">
        <button
          onClick={() => navigate('/orders')}
          className="w-full flex items-center gap-4 px-6 py-5 bg-white hover:bg-gray-50 rounded-xl shadow-sm transition-colors"
        >
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
            <ShoppingBag size={24} className="text-teal-600" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-lg">{t('myOrders')}</h3>
            <p className="text-sm text-gray-500">{t('viewOrderHistory')}</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-4 px-6 py-5 bg-white hover:bg-gray-50 rounded-xl shadow-sm transition-colors"
        >
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
            <Settings size={24} className="text-teal-600" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-lg">{t('settings')}</h3>
            <p className="text-sm text-gray-500">{t('accountPrivacy')}</p>
          </div>
        </button>
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
          onClick={() => navigate('/forum')}
          className="flex flex-col items-center justify-center gap-1 text-gray-400"
        >
          <MessageSquare size={24} />
          <span className="text-xs">{t('forum')}</span>
        </button>

        <button
          className="flex flex-col items-center justify-center gap-1 text-gray-900"
        >
          <MoreVertical size={24} />
        </button>
      </div>
    </div>
  );
}
