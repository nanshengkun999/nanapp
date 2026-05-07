import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Info,
  MapPin,
  Settings,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import type { ComponentType } from 'react';
import MobileDock from '../components/MobileDock';

const menuItems = [
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
];

export default function More() {
  const navigate = useNavigate();

  return (
    <main className="tan-soft-page">
      <div className="tan-page-content">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-[40px] font-extrabold tracking-normal text-[#111827]">更多</h1>
          <button
            type="button"
            aria-label="通知"
            className="tan-pressable tan-glass relative grid h-16 w-16 place-items-center rounded-[24px] text-[#111827]"
          >
            <Bell size={29} />
            <span className="absolute right-4 top-3 h-3 w-3 rounded-full bg-[#12B8A6]" />
          </button>
        </header>

        <section className="tan-glass mb-7 overflow-hidden rounded-[30px]">
          <div className="flex items-center gap-5 px-6 py-6">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=220&h=220&fit=crop"
              alt="咖啡探索者"
              className="h-[88px] w-[88px] rounded-full object-cover ring-4 ring-white/80"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h2 className="truncate text-[26px] font-extrabold text-[#111827]">咖啡探索者</h2>
                <span className="rounded-full bg-[#DDF8F3] px-3 py-1 text-[14px] font-extrabold text-[#0EA896]">
                  Lv.4
                </span>
              </div>
              <p className="mt-2 text-[16px] text-[#6B7280]">探索城市的每一处美好</p>
            </div>
            <button
              type="button"
              className="tan-pressable flex h-12 shrink-0 items-center gap-1 rounded-full bg-[#DDF8F3] px-4 text-[15px] font-extrabold text-[#0EA896]"
            >
              个人主页
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 border-t border-[var(--tan-divider)]">
            <ProfileMetric icon={MapPin} value="36" label="探索地点" />
            <ProfileMetric icon={CheckCircle2} value="128" label="收藏" />
            <ProfileMetric icon={User} value="12" label="打卡" />
          </div>
        </section>

        <section className="space-y-5">
          {menuItems.slice(0, 2).map((item) => (
            <MenuCard key={item.title} item={item} onClick={() => navigate(item.path)} large />
          ))}

          <div className="tan-glass grid grid-cols-2 overflow-hidden rounded-[26px]">
            {menuItems.slice(2).map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.path)}
                className={`tan-pressable flex items-center gap-4 p-5 text-left ${
                  index === 0 ? 'border-r border-[var(--tan-divider)]' : ''
                }`}
              >
                <IconBubble icon={item.icon} small />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[18px] font-extrabold text-[#111827]">{item.title}</span>
                  <span className="mt-1 block truncate text-[13px] text-[#8A94A3]">{item.subtitle}</span>
                </span>
                <ChevronRight className="shrink-0 text-[#A0A7B2]" size={22} />
              </button>
            ))}
          </div>
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
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 py-5">
      <Icon size={28} className="text-[#0EA896]" strokeWidth={2} />
      <span>
        <span className="block text-[21px] font-extrabold text-[#111827]">{value}</span>
        <span className="block text-[14px] font-medium text-[#8A94A3]">{label}</span>
      </span>
    </div>
  );
}

function MenuCard({
  item,
  onClick,
  large,
}: {
  item: (typeof menuItems)[number];
  onClick: () => void;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tan-pressable tan-card flex w-full items-center gap-6 p-6 text-left ${
        large ? 'min-h-[112px]' : ''
      }`}
    >
      <IconBubble icon={item.icon} />
      <span className="min-w-0 flex-1">
        <span className="block text-[27px] font-extrabold text-[#111827]">{item.title}</span>
        <span className="mt-1 block text-[17px] text-[#6B7280]">{item.subtitle}</span>
      </span>
      <ChevronRight className="shrink-0 text-[#A0A7B2]" size={32} />
    </button>
  );
}

function IconBubble({
  icon: Icon,
  small,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  small?: boolean;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-[#D9FBF4] text-[#0EA896] ${
        small ? 'h-14 w-14' : 'h-20 w-20'
      }`}
    >
      <Icon size={small ? 27 : 40} strokeWidth={2.1} />
    </span>
  );
}
