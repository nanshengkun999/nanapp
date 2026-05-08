import { Fragment, useState, type ComponentType } from 'react';
import {
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Edit3,
  Eye,
  FileText,
  HelpCircle,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import MobileDock from '../components/MobileDock';
import { useLanguage } from '../contexts/LanguageContext';

type ProviderStatus = 'accepting' | 'reservation_only' | 'paused';
type ServiceIcon = 'user' | 'medical' | 'camera';

interface ProviderService {
  id: number;
  titleKey: string;
  tagKeys: string[];
  priceKey: string;
  enabled: boolean;
  icon: ServiceIcon;
}

const userProfile = {
  nameKey: 'providerName',
  verified: true,
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=220&h=220&fit=crop',
  subtitleKey: 'verifiedSubtitle',
};

const stats = {
  todayViews: 128,
  consultations: 6,
  orders: 8,
};

const initialServices: ProviderService[] = [
  {
    id: 1,
    titleKey: 'chineseGuide',
    tagKeys: ['fiveYears', 'fluentChinese'],
    priceKey: 'perDay300',
    enabled: true,
    icon: 'user',
  },
  {
    id: 2,
    titleKey: 'medicalTranslate',
    tagKeys: ['medicalProfessional', 'privacyProtection'],
    priceKey: 'tenPercentCommission',
    enabled: true,
    icon: 'medical',
  },
  {
    id: 3,
    titleKey: 'shopPhoto',
    tagKeys: ['photographyRetouch', 'localFamiliar'],
    priceKey: 'perHour80',
    enabled: false,
    icon: 'camera',
  },
];

const statusOptions: { id: ProviderStatus; labelKey: string }[] = [
  { id: 'accepting', labelKey: 'accepting' },
  { id: 'reservation_only', labelKey: 'reservationOnly' },
  { id: 'paused', labelKey: 'paused' },
];

const iconMap: Record<ServiceIcon, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  user: UserRound,
  medical: Stethoscope,
  camera: Camera,
};

export default function ServiceProviderPage() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<ProviderStatus>('accepting');
  const [services, setServices] = useState<ProviderService[]>(initialServices);

  const handleStatusChange = (nextStatus: ProviderStatus) => {
    console.log('status changed', nextStatus);
    setStatus(nextStatus);
  };

  const handleAutoOpenSchedule = () => {
    console.log('auto open schedule');
  };

  const handleReservationSchedule = () => {
    console.log('reservation schedule');
  };

  const handleMyOrders = () => {
    console.log('my provider orders');
  };

  const handleToggleService = (serviceId: number) => {
    console.log('toggle service', serviceId);
    setServices((previous) =>
      previous.map((service) =>
        service.id === serviceId ? { ...service, enabled: !service.enabled } : service
      )
    );
  };

  const handleEditService = (serviceId: number) => {
    console.log('edit service', serviceId);
  };

  const handleAddService = () => {
    console.log('add service');
  };

  const handleEditServiceCard = () => {
    console.log('edit service card');
  };

  const handleTips = () => {
    console.log('service management tips');
  };

  return (
    <main className="tan-soft-page min-h-dvh">
      <div className="px-4 pt-[calc(16px+env(safe-area-inset-top))] pb-[calc(88px+env(safe-area-inset-bottom))]">
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[32px] font-extrabold leading-none tracking-normal text-[#073238]">
              Tanmap
            </h1>
            <p className="mt-2 text-[13px] font-semibold leading-5 text-[#66789A]">
              {t('providerSubtitle')}
            </p>
          </div>
          <button
            type="button"
            aria-label={t('searchServices')}
            className="tan-pressable grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/90 text-[#073238] shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
          >
            <Search size={22} />
          </button>
        </header>

        <ServiceIdentityCard
          status={status}
          onStatusChange={handleStatusChange}
          onAutoOpenSchedule={handleAutoOpenSchedule}
          onReservationSchedule={handleReservationSchedule}
          onMyOrders={handleMyOrders}
        />

        <MyServicesCard
          services={services}
          onToggleService={handleToggleService}
          onEditService={handleEditService}
          onAddService={handleAddService}
          onEditServiceCard={handleEditServiceCard}
          onTips={handleTips}
        />

        <PublishFlowCard />
      </div>

      <MobileDock active="services" />
    </main>
  );
}

function ServiceIdentityCard({
  status,
  onStatusChange,
  onAutoOpenSchedule,
  onReservationSchedule,
  onMyOrders,
}: {
  status: ProviderStatus;
  onStatusChange: (status: ProviderStatus) => void;
  onAutoOpenSchedule: () => void;
  onReservationSchedule: () => void;
  onMyOrders: () => void;
}) {
  const { t } = useLanguage();

  return (
    <section className="mb-3 rounded-[24px] bg-white/92 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-center gap-3">
        <img
          src={userProfile.avatar}
          alt={t(userProfile.nameKey)}
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex min-w-0 items-center gap-2">
            <h2 className="truncate text-[20px] font-extrabold text-[#102A43]">{t('providerIdentity')}</h2>
            {userProfile.verified && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#DDF8F3] px-2 py-1 text-[10px] font-extrabold text-[#0EA896]">
                <ShieldCheck size={13} fill="#0EA896" className="text-[#0EA896]" />
                {t('verified')}
              </span>
            )}
          </div>
          <p className="line-clamp-1 text-[12px] font-semibold text-[#66789A]">{t(userProfile.subtitleKey)}</p>
        </div>
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[22px] bg-[linear-gradient(135deg,#B8FFF3,#6EE7D8)] text-white shadow-[0_10px_24px_rgba(16,191,165,0.18)]">
          <Check size={30} strokeWidth={3} />
        </span>
      </div>

      <h3 className="mb-2 text-[16px] font-extrabold text-[#102A43]">{t('orderStatus')}</h3>
      <StatusSelector value={status} onChange={onStatusChange} />

      <ScheduleSettings
        onAutoOpenSchedule={onAutoOpenSchedule}
        onReservationSchedule={onReservationSchedule}
      />

      <StatsPanel onMyOrders={onMyOrders} />
    </section>
  );
}

function StatusSelector({
  value,
  onChange,
}: {
  value: ProviderStatus;
  onChange: (status: ProviderStatus) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="mb-3 grid grid-cols-3 rounded-full border border-[#E5EEEA] bg-white p-1 shadow-[inset_0_1px_6px_rgba(15,23,42,0.04)]">
      {statusOptions.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`tan-pressable flex h-10 items-center justify-center gap-1.5 rounded-full text-[12px] font-extrabold ${
              active ? 'border border-[#10BFA5] bg-[#EAFBF8] text-[#0EA896]' : 'text-[#7A8CA0]'
            }`}
          >
            {active ? (
              <span className="h-2.5 w-2.5 rounded-full bg-[#10BFA5]" />
            ) : (
              <Circle size={12} />
            )}
            {t(option.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

function ScheduleSettings({
  onAutoOpenSchedule,
  onReservationSchedule,
}: {
  onAutoOpenSchedule: () => void;
  onReservationSchedule: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="mb-3 rounded-[20px] border border-[#E5EEEA] bg-white/70 p-3">
      <h3 className="mb-2 text-[14px] font-extrabold text-[#102A43]">{t('scheduleSettings')}</h3>
      <ScheduleRow
        icon={Clock3}
        title={t('autoOpen')}
        subtitle={t('autoOpenDesc')}
        onClick={onAutoOpenSchedule}
      />
      <div className="my-2 h-px bg-[#E5EEEA]" />
      <ScheduleRow
        icon={CalendarDays}
        title={t('reservationTime')}
        subtitle={t('reservationTimeDesc')}
        onClick={onReservationSchedule}
      />
    </div>
  );
}

function ScheduleRow({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="tan-pressable flex w-full items-center gap-3 text-left">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#DDF8F3] text-[#0EA896]">
        <Icon size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-extrabold text-[#102A43]">{title}</span>
        <span className="mt-0.5 block truncate text-[12px] font-semibold text-[#66789A]">{subtitle}</span>
      </span>
      <ChevronRight size={18} className="text-[#7E90B2]" />
    </button>
  );
}

function StatsPanel({ onMyOrders }: { onMyOrders: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-3 gap-2 rounded-[20px] bg-[#F8FBFA] p-2">
      <StatBlock icon={Eye} label={t('todayViews')} value={stats.todayViews} />
      <StatBlock icon={MessageCircle} label={t('consultations')} value={stats.consultations} />
      <button
        type="button"
        onClick={onMyOrders}
        className="tan-pressable flex min-w-0 items-center justify-center gap-2 rounded-[16px] border border-[#10BFA5] bg-white/72 p-2 text-[#0EA896]"
      >
        <FileText size={18} />
        <span>
          <span className="block text-[11px] font-bold text-[#66789A]">{t('myOrders')}</span>
          <span className="block text-[20px] font-extrabold leading-none">{stats.orders}</span>
        </span>
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

function StatBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  value: number;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex min-w-0 flex-col items-center justify-center rounded-[16px] bg-white/62 p-2 text-center">
      <Icon size={18} className="text-[#7E90B2]" />
      <span className="mt-1 text-[11px] font-bold text-[#66789A]">{label}</span>
      <span className="text-[20px] font-extrabold leading-none text-[#0EA896]">{value}</span>
    </div>
  );
}

function MyServicesCard({
  services,
  onToggleService,
  onEditService,
  onAddService,
  onEditServiceCard,
  onTips,
}: {
  services: ProviderService[];
  onToggleService: (serviceId: number) => void;
  onEditService: (serviceId: number) => void;
  onAddService: () => void;
  onEditServiceCard: () => void;
  onTips: () => void;
}) {
  return (
    <section className="mb-3 rounded-[24px] bg-white/92 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold text-[#102A43]">{t('myServices')}</h2>
        <button
          type="button"
          onClick={onTips}
          className="tan-pressable flex items-center gap-1 text-[12px] font-bold text-[#66789A]"
        >
          {t('tips')}
          <HelpCircle size={14} />
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#E5EEEA]">
        {services.map((service, index) => (
          <ServiceItem
            key={service.id}
            service={service}
            withDivider={index < services.length - 1}
            onToggle={() => onToggleService(service.id)}
            onEdit={() => onEditService(service.id)}
          />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onAddService}
          className="tan-pressable flex h-11 items-center justify-center gap-2 rounded-[16px] bg-[linear-gradient(135deg,#12B8A6,#0EA896)] text-[15px] font-extrabold text-white shadow-[var(--tan-cta-shadow)]"
        >
          <Plus size={18} />
          {t('addService')}
        </button>
        <button
          type="button"
          onClick={onEditServiceCard}
          className="tan-pressable flex h-11 items-center justify-center gap-2 rounded-[16px] border border-[#10BFA5] bg-white text-[15px] font-extrabold text-[#0EA896]"
        >
          <Edit3 size={17} />
          {t('editServiceCard')}
        </button>
      </div>
    </section>
  );
}

function ServiceItem({
  service,
  withDivider,
  onToggle,
  onEdit,
}: {
  service: ProviderService;
  withDivider?: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const { t } = useLanguage();
  const Icon = iconMap[service.icon];
  const tone =
    service.icon === 'medical'
      ? 'bg-[#EEE5FF] text-[#7C3AED]'
      : service.icon === 'camera'
      ? 'bg-[#FFEADB] text-[#F97316]'
      : 'bg-[#DDF8F3] text-[#0EA896]';

  return (
    <button
      type="button"
      onClick={onEdit}
      className={`tan-pressable flex w-full items-center gap-3 p-3 text-left ${
        withDivider ? 'border-b border-[#E5EEEA]' : ''
      }`}
    >
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${tone}`}>
        <Icon size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px] font-extrabold text-[#102A43]">{t(service.titleKey)}</span>
        <span className="mt-1 flex gap-1.5">
          {service.tagKeys.map((tag) => (
            <span key={tag} className="rounded-md bg-[#DDF8F3] px-1.5 py-0.5 text-[10px] font-bold text-[#0EA896]">
              {t(tag)}
            </span>
          ))}
        </span>
      </span>
      <span className="shrink-0 text-[16px] font-extrabold text-[#0EA896]">{t(service.priceKey)}</span>
      <span
        role="switch"
        aria-checked={service.enabled}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          service.enabled ? 'bg-[#10BFA5]' : 'bg-[#E5E7EB]'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            service.enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
      <ChevronRight size={18} className="shrink-0 text-[#8A9AB0]" />
    </button>
  );
}

function PublishFlowCard() {
  const { t } = useLanguage();
  const steps = [
    { title: t('verifyIdentity'), desc: t('verifyIdentityDesc') },
    { title: t('setCommission'), desc: t('setCommissionDesc') },
    { title: t('publishOrders'), desc: t('publishOrdersDesc') },
  ];

  return (
    <section className="rounded-[24px] bg-white/88 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
      <h2 className="mb-3 flex items-center gap-2 text-[18px] font-extrabold text-[#102A43]">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-[#10BFA5] text-white">
          <FileText size={15} />
        </span>
        {t('publishFlow')}
      </h2>
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
        {steps.map((step, index) => (
          <Fragment key={step.title}>
            <div className="rounded-[16px] bg-[#F8FBFA] p-2 text-center">
              <span className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-[#10BFA5] text-[12px] font-extrabold text-white">
                {index + 1}
              </span>
              <p className="mt-1 text-[13px] font-extrabold text-[#102A43]">{step.title}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-[#66789A]">{step.desc}</p>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight size={16} className="text-[#7E90B2]" />
            )}
          </Fragment>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] font-semibold text-[#66789A]">
        {t('identityPrivacyNote')}
      </p>
    </section>
  );
}
