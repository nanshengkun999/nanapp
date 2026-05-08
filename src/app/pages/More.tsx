import {
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
import MobileDock from '../components/MobileDock';

const stats = [
  { icon: MapPin, value: '36', label: '探索地点' },
  { icon: CheckCircle2, value: '128', label: '收藏' },
  { icon: User, value: '12', label: '打卡' },
];

const quickActions = [
  { title: '钱包', subtitle: '余额与支付', icon: WalletCards, path: '/settings' },
  { title: '优惠券', subtitle: '3 张可用', icon: Ticket, path: '/settings' },
];

const menuGroups = [
  {
    title: '常用',
    items: [
      {
        title: '我的订单',
        subtitle: '查看订单历史和状态',
        icon: ShoppingBag,
        path: '/orders',
      },
      {
        title: '设置',
        subtitle: '账号、隐私、通知等',
        icon: Settings,
        path: '/settings',
      },
    ],
  },
  {
    title: '支持',
    items: [
      {
        title: '帮助与反馈',
        subtitle: '常见问题与反馈',
        icon: Headphones,
        path: '/settings',
      },
      {
        title: '关于 Tanmap',
        subtitle: '版本信息与介绍',
        icon: Info,
        path: '/settings',
      },
    ],
  },
];

export default function More() {
  const navigate = useNavigate();

  return (
    <main className="tan-soft-page min-h-dvh">
      <div className="px-5 pt-[calc(18px+env(safe-area-inset-top))] pb-[calc(112px+env(safe-area-inset-bottom))]">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-extrabold text-[#10a696]">Tanmap</p>
            <h1 className="mt-1 text-[36px] font-extrabold leading-none tracking-normal text-[#14313a]">
              我的
            </h1>
          </div>
          <button
            type="button"
            aria-label="通知"
            className="tan-pressable relative grid h-[52px] w-[52px] place-items-center rounded-full bg-white/86 text-[#14313a] shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          >
            <Bell size={26} />
            <span className="absolute right-3.5 top-3 h-3 w-3 rounded-full border-2 border-white bg-[#12B8A6]" />
          </button>
        </header>

        <section className="mb-4 overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#ffffff,#e9fbf8)] shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=220&h=220&fit=crop"
                alt="咖啡探索者"
                className="h-[72px] w-[72px] shrink-0 rounded-[24px] object-cover ring-4 ring-white/80"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex min-w-0 items-center gap-2">
                  <h2 className="truncate text-[23px] font-extrabold leading-tight text-[#14313a]">
                    咖啡探索者
                  </h2>
                  <span className="shrink-0 rounded-full bg-[#DDF8F3] px-2.5 py-1 text-[12px] font-extrabold text-[#0EA896]">
                    Lv.4
                  </span>
                </div>
                <p className="line-clamp-2 text-[14px] font-semibold leading-5 text-[#6B7B83]">
                  探索城市的每一处美好
                </p>
              </div>
              <button
                type="button"
                className="tan-pressable grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#DDF8F3] text-[#0EA896]"
                aria-label="打开个人主页"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-[22px] bg-white/58 p-2">
              {stats.map((item) => (
                <ProfileMetric key={item.label} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section className="mb-4 grid grid-cols-2 gap-3">
          {quickActions.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate(item.path)}
              className="tan-pressable flex min-h-[78px] items-center gap-3 rounded-[24px] bg-white/86 p-3 text-left shadow-[0_8px_22px_rgba(15,23,42,0.06)]"
            >
              <IconBubble icon={item.icon} small />
              <span className="min-w-0">
                <span className="block truncate text-[16px] font-extrabold text-[#14313a]">
                  {item.title}
                </span>
                <span className="mt-1 block truncate text-[12px] font-bold text-[#8A94A3]">
                  {item.subtitle}
                </span>
              </span>
            </button>
          ))}
        </section>

        <section className="space-y-4">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-2 px-1 text-[13px] font-extrabold text-[#7b8c86]">
                {group.title}
              </h2>
              <div className="overflow-hidden rounded-[26px] bg-white/86 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
                {group.items.map((item, index) => (
                  <MenuRow
                    key={item.title}
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

      <MobileDock active="more" />
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
    <div className="flex min-w-0 flex-col items-center justify-center rounded-[18px] bg-white/72 px-1 py-2 text-center">
      <Icon size={20} className="mb-1 text-[#0EA896]" strokeWidth={2.1} />
      <span className="text-[18px] font-extrabold leading-none text-[#14313a]">{value}</span>
      <span className="mt-1 truncate text-[11px] font-bold leading-none text-[#7b8c86]">
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
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tan-pressable flex w-full items-center gap-3 p-4 text-left ${
        withDivider ? 'border-b border-[#e7efec]' : ''
      }`}
    >
      <IconBubble icon={item.icon} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[18px] font-extrabold text-[#14313a]">
          {item.title}
        </span>
        <span className="mt-1 block truncate text-[13px] font-semibold text-[#8A94A3]">
          {item.subtitle}
        </span>
      </span>
      <ChevronRight className="shrink-0 text-[#9aa8a4]" size={22} />
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
      className={`grid shrink-0 place-items-center rounded-2xl bg-[#D9FBF4] text-[#0EA896] ${
        small ? 'h-11 w-11' : 'h-12 w-12'
      }`}
    >
      <Icon size={small ? 22 : 24} strokeWidth={2.1} />
    </span>
  );
}
