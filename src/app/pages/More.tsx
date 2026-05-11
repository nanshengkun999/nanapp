import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Info,
  MapPin,
  Settings,
  ShoppingBag,
  Ticket,
  User,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';

const stats = [
  { icon: MapPin, value: '36', labelKey: 'exploredPlaces' },
  { icon: CheckCircle2, value: '128', labelKey: 'favorites' },
  { icon: User, value: '12', labelKey: 'checkins' },
];

const quickActions = [
  { titleKey: 'wallet', subtitleKey: 'walletDesc', icon: WalletCards, path: '/settings' },
  { titleKey: 'coupons', subtitleKey: 'couponsDesc', icon: Ticket, path: '/settings' },
];

const menuGroups = [
  {
    titleKey: 'common',
    items: [
      {
        titleKey: 'myOrders',
        subtitleKey: 'viewOrderHistory',
        icon: ShoppingBag,
        path: '/orders',
      },
      {
        titleKey: 'settings',
        subtitleKey: 'accountPrivacy',
        icon: Settings,
        path: '/settings',
      },
    ],
  },
  {
    titleKey: 'support',
    items: [
      {
        titleKey: 'helpFeedback',
        subtitleKey: 'helpFeedbackDesc',
        icon: Headphones,
        path: '/settings',
      },
      {
        titleKey: 'aboutTanmap',
        subtitleKey: 'aboutDesc',
        icon: Info,
        path: '/settings',
      },
    ],
  },
];

export default function More() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <main className="tan-soft-page min-h-dvh">
      <div className="px-4 pt-[calc(14px+env(safe-area-inset-top))] pb-[calc(28px+env(safe-area-inset-bottom))]">
        <header className="mb-2.5 grid grid-cols-[40px_1fr_40px] items-center gap-2">
          <button
            type="button"
            aria-label={t('back')}
            onClick={() => navigate('/')}
            className="tan-pressable grid h-10 w-10 place-items-center rounded-full bg-white/86 text-[#14313a] shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="text-[28px] font-extrabold leading-none tracking-normal text-[#14313a]">
              {t('moreTitle')}
            </h1>
          </div>
          <button
            type="button"
            aria-label={t('notification')}
            className="tan-pressable relative grid h-10 w-10 place-items-center rounded-full bg-white/86 text-[#14313a] shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          >
            <Bell size={20} />
            <span className="absolute right-2.5 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#12B8A6]" />
          </button>
        </header>

        <section className="mb-3 overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#ffffff,#e9fbf8)] shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div className="p-3">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=220&h=220&fit=crop"
                alt={t('explorerName')}
                className="h-14 w-14 shrink-0 rounded-[18px] object-cover ring-2 ring-white/80"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex min-w-0 items-center gap-2">
                  <h2 className="truncate text-[18px] font-extrabold leading-tight text-[#14313a]">
                    {t('explorerName')}
                  </h2>
                  <span className="shrink-0 rounded-full bg-[#DDF8F3] px-2 py-0.5 text-[10px] font-extrabold text-[#0EA896]">
                    Lv.4
                  </span>
                </div>
                <p className="line-clamp-1 text-[12px] font-semibold leading-4 text-[#6B7B83]">
                  {t('explorerBio')}
                </p>
              </div>
              <button
                type="button"
                className="tan-pressable grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#DDF8F3] text-[#0EA896]"
                aria-label={t('openProfile')}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-[16px] bg-white/58 p-1.5">
              {stats.map((item) => (
                <ProfileMetric key={item.labelKey} icon={item.icon} value={item.value} label={t(item.labelKey)} />
              ))}
            </div>
          </div>
        </section>

        <section className="mb-3 grid grid-cols-2 gap-2">
          {quickActions.map((item) => (
            <button
              key={item.titleKey}
              type="button"
              onClick={() => navigate(item.path)}
              className="tan-pressable flex min-h-[58px] items-center gap-2.5 rounded-[16px] bg-white/86 p-2.5 text-left shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
            >
              <IconBubble icon={item.icon} small />
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-extrabold text-[#14313a]">
                  {t(item.titleKey)}
                </span>
                <span className="mt-0.5 block truncate text-[10px] font-bold text-[#8A94A3]">
                  {t(item.subtitleKey)}
                </span>
              </span>
            </button>
          ))}
        </section>

        <section className="space-y-2.5">
          {menuGroups.map((group) => (
            <div key={group.titleKey}>
              <h2 className="mb-1.5 px-1 text-[12px] font-extrabold text-[#7b8c86]">
                {t(group.titleKey)}
              </h2>
              <div className="overflow-hidden rounded-[18px] bg-white/86 shadow-[0_8px_18px_rgba(15,23,42,0.05)]">
                {group.items.map((item, index) => (
                  <MenuRow
                    key={item.titleKey}
                    item={item}
                    withDivider={index < group.items.length - 1}
                    onClick={() => navigate(item.path)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

    </main>
  );
}

function ProfileMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center rounded-[14px] bg-white/72 px-1 py-1.5 text-center">
      <Icon size={16} className="mb-0.5 text-[#0EA896]" strokeWidth={2.1} />
      <span className="text-[15px] font-extrabold leading-none text-[#14313a]">{value}</span>
      <span className="mt-0.5 truncate text-[10px] font-bold leading-none text-[#7b8c86]">
        {label}
      </span>
    </div>
  );
}

function MenuRow({
  item,
  withDivider,
  onClick,
}: {
  item: (typeof menuGroups)[number]['items'][number];
  withDivider?: boolean;
  onClick: () => void;
}) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`tan-pressable flex w-full items-center gap-2.5 px-3 py-3 text-left ${
        withDivider ? 'border-b border-[#e7efec]' : ''
      }`}
    >
      <IconBubble icon={item.icon} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-extrabold text-[#14313a]">
          {t(item.titleKey)}
        </span>
        <span className="mt-0.5 block truncate text-[11px] font-semibold text-[#8A94A3]">
          {t(item.subtitleKey)}
        </span>
      </span>
      <ChevronRight className="shrink-0 text-[#9aa8a4]" size={18} />
    </button>
  );
}

function IconBubble({
  icon: Icon,
  small,
}: {
  icon: LucideIcon;
  small?: boolean;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[14px] bg-[#D9FBF4] text-[#0EA896] ${
        small ? 'h-9 w-9' : 'h-10 w-10'
      }`}
    >
      <Icon size={small ? 18 : 20} strokeWidth={2.1} />
    </span>
  );
}
