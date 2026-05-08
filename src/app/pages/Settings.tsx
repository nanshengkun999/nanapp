import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Bell,
  Briefcase,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  Globe,
  Heart,
  Info,
  Lock,
  Map,
  MapPin,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Receipt,
  Ruler,
  Shield,
  Tag,
  Trash2,
  Upload,
  User,
  UserX,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { type Language, useLanguage } from '../contexts/LanguageContext';

const languageOptions: Language[] = ['中文', '한국어', 'English'];

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
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
    <div className="min-h-screen bg-gray-50 pb-16 text-gray-900">
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
            aria-label={t('back')}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{t('settings')}</h1>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <SettingsGroup
          icon={User}
          title={t('account')}
          rows={[
            {
              type: 'profile',
              title: t('nickname'),
              subtitle: t('clickToModify'),
              onClick: () => console.log('edit profile'),
            },
            {
              icon: Globe,
              title: t('language'),
              value: language,
              onClick: () => setShowLanguageModal(true),
            },
            {
              icon: MapPin,
              title: t('region'),
              value: t('seoul'),
              onClick: () => console.log('region'),
            },
          ]}
        />

        <section className="overflow-hidden rounded-xl bg-white shadow-sm">
          <SectionTitle icon={Bell} title={t('notifications')} />
          <SwitchRow label={t('commentNotif')} checked={commentNotif} onChange={() => setCommentNotif(!commentNotif)} />
          <SwitchRow label={t('recommendNotif')} checked={recommendNotif} onChange={() => setRecommendNotif(!recommendNotif)} />
          <SwitchRow label={t('orderNotif')} checked={orderNotif} onChange={() => setOrderNotif(!orderNotif)} last />
        </section>

        <section className="overflow-hidden rounded-xl bg-white shadow-sm">
          <SectionTitle icon={Shield} title={t('privacy')} />
          <SwitchRow
            icon={Lock}
            label={t('showLocation')}
            checked={showLocation}
            onChange={() => setShowLocation(!showLocation)}
          />
          <SwitchRow
            label={t('allowRecommend')}
            checked={allowRecommend}
            onChange={() => setAllowRecommend(!allowRecommend)}
          />
          <ActionRow icon={UserX} title={t('blacklist')} onClick={() => console.log('blacklist')} last />
        </section>

        <section className="overflow-hidden rounded-xl border-2 border-teal-500 bg-white shadow-sm">
          <SectionTitle icon={Video} title={t('contentPreference')} strong />
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="mb-3 text-sm text-gray-500">{t('selectCategories')}</p>
            <div className="flex gap-3">
              <PreferenceButton
                active={foodPreference}
                label={t('food')}
                onClick={() => setFoodPreference(!foodPreference)}
              />
              <PreferenceButton
                active={beautyPreference}
                label={t('beauty')}
                pink
                onClick={() => setBeautyPreference(!beautyPreference)}
              />
            </div>
          </div>
          <ActionRow icon={Tag} title={t('tagPreference')} subtitle={t('tagPreferenceDesc')} onClick={() => console.log('tags')} />
          <div className="px-4 py-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ruler size={20} className="text-gray-600" />
                <span className="font-semibold">{t('distanceRange')}</span>
              </div>
              <span className="font-bold text-teal-600">{distanceRange}</span>
            </div>
            <div className="flex gap-2">
              {['3km', '5km', '10km'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setDistanceRange(range)}
                  className={`flex-1 rounded-lg py-2 transition-all ${
                    distanceRange === range ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </section>

        <SettingsGroup
          icon={CreditCard}
          title={t('payment')}
          rows={[
            { icon: DollarSign, title: t('paymentMethod'), onClick: () => console.log('payment') },
            { icon: FileText, title: t('orderHistory'), onClick: () => navigate('/orders') },
            { icon: Receipt, title: t('invoice'), onClick: () => console.log('invoice') },
          ]}
        />

        <SettingsGroup
          icon={Briefcase}
          title={t('becomeProvider')}
          rows={[
            {
              icon: Upload,
              title: t('joinService'),
              subtitle: t('joinServiceDesc'),
              onClick: () => navigate('/services/provider'),
            },
            { icon: FileText, title: t('uploadCredentials'), onClick: () => console.log('credentials') },
            { icon: DollarSign, title: t('setPrice'), onClick: () => console.log('price') },
          ]}
        />

        <SettingsGroup
          icon={Info}
          title={t('other')}
          rows={[
            { icon: Trash2, title: t('clearCache'), value: '128 MB', onClick: () => console.log('cache') },
            { icon: Info, title: t('aboutTanmap'), onClick: () => console.log('about') },
            { icon: MessageCircle, title: t('contactSupport'), onClick: () => console.log('support') },
          ]}
        />

        <button
          type="button"
          className="w-full rounded-xl bg-white py-3 font-semibold text-red-500 shadow-sm transition-colors hover:bg-red-50"
        >
          {t('logout')}
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-200 bg-white">
        <BottomNavButton icon={Map} label={t('map')} onClick={() => navigate('/')} />
        <BottomNavButton icon={Heart} label={t('favorites')} onClick={() => navigate('/')} />
        <BottomNavButton icon={MapPin} label={t('services')} onClick={() => navigate('/services')} />
        <BottomNavButton icon={MessageSquare} label={t('forum')} onClick={() => navigate('/forum')} />
        <BottomNavButton icon={MoreVertical} label={t('more')} active onClick={() => navigate('/more')} />
      </div>

      <AnimatePresence>
        {showLanguageModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setShowLanguageModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-6"
            >
              <h3 className="mb-4 text-lg font-bold">{t('language')}</h3>
              <div className="space-y-2">
                {languageOptions.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageModal(false);
                    }}
                    className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                      language === lang
                        ? 'bg-teal-50 font-semibold text-teal-600'
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

type RowConfig = {
  type?: 'profile';
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  value?: string;
  onClick: () => void;
};

function SettingsGroup({
  icon: Icon,
  title,
  rows,
}: {
  icon: LucideIcon;
  title: string;
  rows: RowConfig[];
}) {
  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-sm">
      <SectionTitle icon={Icon} title={title} />
      {rows.map((row, index) =>
        row.type === 'profile' ? (
          <ProfileRow key={row.title} title={row.title} subtitle={row.subtitle} onClick={row.onClick} />
        ) : (
          <ActionRow
            key={row.title}
            icon={row.icon}
            title={row.title}
            subtitle={row.subtitle}
            value={row.value}
            onClick={row.onClick}
            last={index === rows.length - 1}
          />
        )
      )}
    </section>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  strong,
}: {
  icon: LucideIcon;
  title: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 border-b border-gray-100 px-4 py-3 ${
        strong ? 'bg-gradient-to-r from-teal-50 to-cyan-50' : ''
      }`}
    >
      <Icon size={20} className="text-teal-600" />
      <h2 className={`font-bold ${strong ? 'text-teal-700' : ''}`}>{title}</h2>
    </div>
  );
}

function ProfileRow({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500" />
        <div className="text-left">
          <p className="font-semibold">{title}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </button>
  );
}

function ActionRow({
  icon: Icon,
  title,
  subtitle,
  value,
  onClick,
  last,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  value?: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50 ${
        last ? '' : 'border-b border-gray-100'
      }`}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon size={20} className="text-gray-600" />}
        <div className="text-left">
          <p className="font-semibold">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-gray-500">{value}</span>}
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </button>
  );
}

function SwitchRow({
  icon: Icon,
  label,
  checked,
  onChange,
  last,
}: {
  icon?: LucideIcon;
  label: string;
  checked: boolean;
  onChange: () => void;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${last ? '' : 'border-b border-gray-100'}`}>
      <div className="flex items-center gap-3">
        {Icon && <Icon size={20} className="text-gray-600" />}
        <span>{label}</span>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`h-6 w-12 rounded-full transition-colors ${checked ? 'bg-teal-500' : 'bg-gray-300'}`}
        aria-pressed={checked}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function PreferenceButton({
  active,
  label,
  pink,
  onClick,
}: {
  active: boolean;
  label: string;
  pink?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg border-2 px-4 py-2 transition-all ${
        active
          ? pink
            ? 'border-pink-400 bg-gradient-to-r from-pink-400 to-rose-400 text-white'
            : 'border-teal-500 bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
          : 'border-gray-200 bg-gray-50 text-gray-600'
      }`}
    >
      {label}
    </button>
  );
}

function BottomNavButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 ${active ? 'text-gray-900' : 'text-gray-400'}`}
    >
      <Icon size={24} />
      <span className="text-xs">{label}</span>
    </button>
  );
}
