import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, User, Globe, MapPin as LocationIcon, Bell, Shield, Lock,
  UserX, Video, Tag, Ruler, CreditCard, FileText, Receipt,
  Briefcase, Upload, DollarSign, Trash2, Info, MessageCircle,
  ChevronRight, Map, Heart, MessageSquare, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage: setGlobalLanguage, t } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [allowRecommend, setAllowRecommend] = useState(true);
  const [commentNotif, setCommentNotif] = useState(true);
  const [recommendNotif, setRecommendNotif] = useState(true);
  const [orderNotif, setOrderNotif] = useState(true);
  const [foodPreference, setFoodPreference] = useState(true);
  const [beautyPreference, setBeautyPreference] = useState(true);
  const [distanceRange, setDistanceRange] = useState('5km');

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{t('settings')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 1. 账号与个人 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <User size={20} className="text-teal-600" />
            <h2 className="font-bold">{t('account')}</h2>
          </div>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500"></div>
              <div className="text-left">
                <p className="font-semibold">{t('nickname')}</p>
                <p className="text-sm text-gray-500">{t('clickToModify')}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button
            onClick={() => setShowLanguageModal(true)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-gray-600" />
              <span>{t('language')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{language}</span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </button>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <LocationIcon size={20} className="text-gray-600" />
              <span>{t('region')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{language === '한국어' ? '서울' : '首尔'}</span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </button>
        </div>

        {/* 2. 通知管理 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Bell size={20} className="text-teal-600" />
            <h2 className="font-bold">通知管理</h2>
          </div>

          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <span>评论通知</span>
            <button
              onClick={() => setCommentNotif(!commentNotif)}
              className={`w-12 h-6 rounded-full transition-colors ${
                commentNotif ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                commentNotif ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <span>推荐通知</span>
            <button
              onClick={() => setRecommendNotif(!recommendNotif)}
              className={`w-12 h-6 rounded-full transition-colors ${
                recommendNotif ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                recommendNotif ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="px-4 py-3 flex items-center justify-between">
            <span>服务订单通知</span>
            <button
              onClick={() => setOrderNotif(!orderNotif)}
              className={`w-12 h-6 rounded-full transition-colors ${
                orderNotif ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                orderNotif ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        {/* 3. 隐私 & 安全 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Shield size={20} className="text-teal-600" />
            <h2 className="font-bold">隐私 & 安全</h2>
          </div>

          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-gray-600" />
              <span>是否展示位置</span>
            </div>
            <button
              onClick={() => setShowLocation(!showLocation)}
              className={`w-12 h-6 rounded-full transition-colors ${
                showLocation ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                showLocation ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <span>是否允许被推荐</span>
            <button
              onClick={() => setAllowRecommend(!allowRecommend)}
              className={`w-12 h-6 rounded-full transition-colors ${
                allowRecommend ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                allowRecommend ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <UserX size={20} className="text-gray-600" />
              <span>黑名单</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* 4. 内容偏好 - 核心功能 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border-2 border-teal-500">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-teal-50 to-cyan-50">
            <Video size={20} className="text-teal-600" />
            <h2 className="font-bold text-teal-700">内容偏好 ⭐️</h2>
          </div>

          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-500 mb-3">选择你感兴趣的分类</p>
            <div className="flex gap-3">
              <button
                onClick={() => setFoodPreference(!foodPreference)}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  foodPreference
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-teal-500'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                美食 🍔
              </button>
              <button
                onClick={() => setBeautyPreference(!beautyPreference)}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  beautyPreference
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white border-pink-400'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                医美 💉
              </button>
            </div>
          </div>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Tag size={20} className="text-gray-600" />
              <div className="text-left">
                <p className="font-semibold">标签偏好</p>
                <p className="text-xs text-gray-500">汉堡 / 烤肉 / 皮肤管理等</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Ruler size={20} className="text-gray-600" />
                <span className="font-semibold">距离范围</span>
              </div>
              <span className="text-teal-600 font-bold">{distanceRange}</span>
            </div>
            <div className="flex gap-2">
              {['3km', '5km', '10km'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDistanceRange(range)}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    distanceRange === range
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. 支付与订单 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <CreditCard size={20} className="text-teal-600" />
            <h2 className="font-bold">支付与订单</h2>
          </div>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-gray-600" />
              <span>支付方式</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-gray-600" />
              <span>历史订单</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Receipt size={20} className="text-gray-600" />
              <span>发票</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* 6. 成为服务者 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Briefcase size={20} className="text-teal-600" />
            <h2 className="font-bold">成为服务者</h2>
          </div>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Upload size={20} className="text-gray-600" />
              <div className="text-left">
                <p className="font-semibold">入驻服务</p>
                <p className="text-xs text-gray-500">地陪 / 民宿 / 包车等</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-gray-600" />
              <span>上传资质</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-gray-600" />
              <span>设置价格</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* 7. 其他 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Info size={20} className="text-teal-600" />
            <h2 className="font-bold">其他</h2>
          </div>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-gray-600" />
              <span>清除缓存</span>
            </div>
            <span className="text-gray-400 text-sm">128 MB</span>
          </button>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Info size={20} className="text-gray-600" />
              <span>关于 Tanmap</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <MessageCircle size={20} className="text-gray-600" />
              <span>联系客服</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* 退出登录 */}
        <button className="w-full py-3 bg-white rounded-xl text-red-500 font-semibold shadow-sm hover:bg-red-50 transition-colors">
          退出登录
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
          <LocationIcon size={24} />
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
          className="flex flex-col items-center justify-center gap-1 text-gray-900"
        >
          <MoreVertical size={24} />
        </button>
      </div>

      {/* 语言选择弹窗 */}
      <AnimatePresence>
        {showLanguageModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowLanguageModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6"
            >
              <h3 className="text-lg font-bold mb-4">{t('language')}</h3>
              <div className="space-y-2">
                {(['中文', '한국어', 'English'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setGlobalLanguage(lang);
                      setShowLanguageModal(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      language === lang
                        ? 'bg-teal-50 text-teal-600 font-semibold'
                        : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
