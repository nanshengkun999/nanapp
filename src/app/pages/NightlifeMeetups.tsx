import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  House,
  Info,
  Link2,
  LockKeyhole,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Star,
  UsersRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

type RegionStatus = 'active' | 'coming_soon' | 'planned';

type Region = {
  id: string;
  name: string;
  status: RegionStatus;
  label: string;
  areas: string[];
};

type NightlifeMeetup = {
  id: string;
  regionId: string;
  storeName: string;
  location: string;
  distanceText: string;
  tags: string[];
  currentPeople: number;
  maxPeople: number;
  time: string;
  imageTone: string;
  status: 'open';
};

const regions: Region[] = [
  {
    id: 'hongdae',
    name: '弘大生活圈',
    status: 'active',
    label: '已开放',
    areas: ['弘大', '延南', '合井', '上水'],
  },
  {
    id: 'seongsu',
    name: '圣水生活圈',
    status: 'coming_soon',
    label: '即将开放',
    areas: ['圣水', '纛岛', '首尔林'],
  },
  {
    id: 'geondae',
    name: '建大生活圈',
    status: 'coming_soon',
    label: '即将开放',
    areas: ['建大', '华阳', '儿童大公园'],
  },
  {
    id: 'gangnam',
    name: '江南生活圈',
    status: 'planned',
    label: '计划开放',
    areas: ['江南', '新沙', '狎鸥亭', '论岘'],
  },
];

const nightlifeMeetups: NightlifeMeetup[] = [
  {
    id: 'm2-hongdae',
    regionId: 'hongdae',
    storeName: 'M2 CLUB 弘大店',
    location: '弘大入口站',
    distanceText: '步行 4 分钟',
    tags: ['电音', '热门夜店', '本地人常去'],
    currentPeople: 2,
    maxPeople: 4,
    time: '今晚 22:30',
    imageTone: 'm2',
    status: 'open',
  },
  {
    id: 'b1-lounge',
    regionId: 'hongdae',
    storeName: 'B1 LOUNGE BAR',
    location: '弘大入口站',
    distanceText: '步行 6 分钟',
    tags: ['酒吧', '女生局', '轻松喝酒'],
    currentPeople: 1,
    maxPeople: 3,
    time: '今晚 23:00',
    imageTone: 'b1',
    status: 'open',
  },
  {
    id: 'nb2-hongdae',
    regionId: 'hongdae',
    storeName: 'NB2 弘大',
    location: '弘大入口站',
    distanceText: '步行 7 分钟',
    tags: ['蹦迪', '人气夜店', '周末局'],
    currentPeople: 3,
    maxPeople: 5,
    time: '今天 23:30',
    imageTone: 'nb2',
    status: 'open',
  },
];

const categoryTabs = ['地图', '美食', '医美', '夜生活'];

const avatarGradients = [
  'linear-gradient(135deg,#2EDBFF,#C02BFF)',
  'linear-gradient(135deg,#FF4FD8,#6A5CFF)',
  'linear-gradient(135deg,#F7D8FF,#1B1242)',
];

export default function NightlifeMeetups() {
  const navigate = useNavigate();
  const [selectedRegionId, setSelectedRegionId] = useState('hongdae');
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const selectedRegion = regions.find((region) => region.id === selectedRegionId) ?? regions[0];
  const visibleMeetups = useMemo(
    () => nightlifeMeetups.filter((meetup) => meetup.regionId === selectedRegionId).slice(0, 3),
    [selectedRegionId]
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/?category=nightlife');
  };

  const handleTopAction = (label: string) => {
    if (label === '小圈子') navigate('/forum');
    if (label === '本地搭子') toast.info('当前已在找蹦迪搭子页');
    if (label === '我的') navigate('/more');
    if (label === '收藏夹') navigate('/saved');
  };

  const handleCategorySelect = (tab: string) => {
    const routes: Record<string, string> = {
      地图: '/?mode=map',
      美食: '/?category=food',
      医美: '/?category=medical',
      夜生活: '/?category=nightlife',
    };
    navigate(routes[tab] ?? '/?category=nightlife');
  };

  const handleRegionSelect = () => {
    setIsRegionMenuOpen((current) => !current);
  };

  const handleRegionOptionSelect = (region: Region) => {
    if (region.status !== 'active') {
      toast.info(`${region.name}${region.label}`);
      return;
    }

    setSelectedRegionId(region.id);
    setIsRegionMenuOpen(false);
  };

  const handleJoinMeetup = (meetupId: string) => {
    const meetup = nightlifeMeetups.find((item) => item.id === meetupId);
    toast.success(`已发送加入申请：${meetup?.storeName ?? '蹦迪组队'}`);
  };

  const handleStoreLink = (meetupId: string) => {
    const meetup = nightlifeMeetups.find((item) => item.id === meetupId);
    toast.info(`${meetup?.storeName ?? '店铺'}详情页稍后开放`);
  };

  const handleCreateMeetup = () => {
    toast.info('发起组队功能准备中');
  };

  const handleSave = () => {
    setIsSaved((current) => {
      toast.success(current ? '已取消收藏' : '已收藏找蹦迪搭子页');
      return !current;
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('链接已复制');
    } catch {
      toast.error('复制失败，请稍后再试');
    }
  };

  return (
    <main className="theme-nightlife tan-mobile-frame relative h-dvh overflow-hidden bg-[var(--night-bg)] text-[var(--text-main)]">
      <video
        src={`${import.meta.env.BASE_URL}videos/tanmap-nightlife.mp4`}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
        muted
        loop
        playsInline
        autoPlay
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,5,15,0.78)_0%,rgba(3,5,15,0.26)_32%,rgba(3,5,15,0.36)_62%,rgba(3,5,15,0.88)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(192,43,255,0.24),transparent_34%),radial-gradient(circle_at_22%_58%,rgba(46,219,255,0.12),transparent_32%)]" />

      <header className="absolute inset-x-0 top-0 z-30 px-5 pt-[calc(12px+env(safe-area-inset-top))]">
        <div className="flex min-h-8 items-center gap-2">
          <button type="button" onClick={() => navigate('/?category=nightlife')} className="shrink-0 bg-[linear-gradient(135deg,#FF4FD8_0%,#C02BFF_45%,#2EDBFF_100%)] bg-clip-text text-[22px] font-extrabold leading-none tracking-normal text-transparent drop-shadow-[0_0_10px_rgba(192,43,255,0.8)]">
            Tanmap
          </button>
          <div className="ml-auto flex min-w-0 max-w-[calc(100vw-128px)] items-center justify-end gap-1 overflow-x-auto tan-scrollbar-hide">
            {['小圈子', '本地搭子', '我的', '收藏夹'].map((label) => (
              <button key={label} type="button" onClick={() => handleTopAction(label)} className="top-pill h-7 shrink-0 px-2 text-[11px] font-semibold min-[410px]:h-8 min-[410px]:px-2.5 min-[410px]:text-[12px]">
                {label}
              </button>
            ))}
            <button type="button" aria-label="搜索" onClick={() => navigate('/?search=1')} className="top-pill grid h-7 w-7 shrink-0 place-items-center rounded-full min-[410px]:h-8 min-[410px]:w-8">
              <Search size={16} strokeWidth={1.9} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[22px_1fr_22px] items-center gap-1">
          <button type="button" onClick={() => handleCategorySelect('医美')} className="grid h-7 w-6 place-items-center text-white/78">
            <ChevronRight className="rotate-180" size={23} />
          </button>
          <nav className="grid grid-cols-4 items-start">
            {categoryTabs.map((tab) => {
              const active = tab === '夜生活';
              return (
                <div key={tab} className="relative flex h-11 flex-col items-center justify-start">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(tab)}
                    className={`flex h-8 flex-col items-center justify-start text-[15px] font-semibold tracking-normal ${
                      active ? 'text-white' : 'text-white/68'
                    }`}
                  >
                    <span className={active ? 'nightlife-tab-active' : ''}>{tab}</span>
                    {active && <span className="mt-1 h-[3px] w-10 rounded-full bg-[linear-gradient(90deg,#FF4FD8,#C02BFF,#2EDBFF)] shadow-[0_0_8px_rgba(192,43,255,0.9),0_0_16px_rgba(46,219,255,0.45)]" />}
                  </button>
                  {tab !== '地图' && (
                    <House
                      size={14}
                      fill="currentColor"
                      className={`absolute top-7 ${active ? 'text-[#FF4FD8] drop-shadow-[0_0_8px_rgba(255,79,216,0.95)]' : 'text-white/58'}`}
                    />
                  )}
                </div>
              );
            })}
          </nav>
          <button type="button" onClick={() => handleCategorySelect('地图')} className="grid h-7 w-6 place-items-center text-white/78">
            <ChevronRight size={23} />
          </button>
        </div>
      </header>

      <section className="relative z-10 h-full overflow-y-auto px-4 pb-[calc(92px+env(safe-area-inset-bottom))] pt-[calc(136px+env(safe-area-inset-top))] tan-scrollbar-hide">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[34px] font-extrabold leading-tight tracking-normal text-white drop-shadow-[0_0_12px_rgba(192,43,255,0.75)]">
              找蹦迪搭子
            </h2>
            <p className="mt-1 text-[15px] font-medium text-white/72">一起去本地人常去的夜店</p>
          </div>
          <button type="button" onClick={() => toast.info('我的约酒功能准备中')} className="top-pill flex h-10 shrink-0 items-center gap-2 px-4 text-[13px] font-semibold">
            <Star size={17} fill="currentColor" />
            我的约酒
          </button>
        </div>

        <div className="relative mb-3">
          <button
            type="button"
            onClick={handleRegionSelect}
            aria-expanded={isRegionMenuOpen}
            className="flex h-11 w-full max-w-[368px] items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[rgba(8,10,24,0.46)] px-4 text-[15px] font-semibold text-white shadow-[0_0_16px_rgba(192,43,255,0.42)] backdrop-blur-[14px]"
          >
            <MapPin size={18} className="text-[#FF4FD8]" fill="currentColor" />
            <Check size={16} className="text-[#48F0B4]" />
            <span>{selectedRegion.name}</span>
            <span className="text-[#48F0B4]">（{selectedRegion.label}）</span>
            <ChevronDown size={18} className={`ml-auto transition-transform ${isRegionMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isRegionMenuOpen && (
            <div className="absolute left-0 right-0 top-[50px] z-40 max-w-[368px] rounded-[20px] border border-[rgba(192,43,255,0.42)] bg-[rgba(8,10,24,0.9)] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.38),0_0_18px_rgba(192,43,255,0.24)] backdrop-blur-[18px]">
              {regions.map((region) => {
                const active = region.status === 'active';
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => handleRegionOptionSelect(region)}
                    className={`flex h-11 w-full items-center justify-between rounded-[16px] px-3 text-left text-[14px] font-semibold transition ${
                      active ? 'text-white hover:bg-[rgba(192,43,255,0.16)]' : 'text-white/58 hover:bg-white/6'
                    }`}
                  >
                    <span>{active ? '✅' : '🔒'} {region.name}</span>
                    <span className={active ? 'text-[#48F0B4]' : 'text-white/48'}>（{region.label}）</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-3 flex items-center justify-between gap-2 text-[12px] font-medium text-white/68">
          <div className="flex min-w-0 items-center gap-2">
            <UsersRound size={18} className="shrink-0 text-white" />
            <span>当前可创建组队位：</span>
            <span className="text-[18px] font-extrabold text-[#48F0B4]">3个</span>
            <Info size={15} />
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <RefreshCw size={15} />
            <span>组队成功后自动空出组队位</span>
          </div>
        </div>

        <section className="rounded-[22px] border border-[var(--glass-border)] bg-[rgba(5,7,18,0.62)] p-3 shadow-[0_0_18px_rgba(192,43,255,0.3),inset_0_0_16px_rgba(255,255,255,0.035)] backdrop-blur-[18px]">
          <h3 className="mb-2 text-[18px] font-extrabold">
            正在组队 <span className="text-[13px] font-semibold text-white/58">（可加入）</span>
          </h3>
          <div className="space-y-2">
            {visibleMeetups.map((meetup) => (
              <MeetupCard
                key={meetup.id}
                meetup={meetup}
                onJoin={() => handleJoinMeetup(meetup.id)}
                onStoreLink={() => handleStoreLink(meetup.id)}
              />
            ))}
            <LockedSlot />
            <LockedSlot />
          </div>
        </section>
      </section>

      <nav className="absolute inset-x-4 bottom-[calc(14px+env(safe-area-inset-bottom))] z-30 grid h-[64px] grid-cols-[minmax(0,1fr)_166px_minmax(0,1fr)] items-center gap-1 rounded-[22px] border border-[rgba(192,43,255,0.38)] bg-[rgba(5,7,18,0.76)] px-3 shadow-[0_0_16px_rgba(192,43,255,0.35),inset_0_0_16px_rgba(255,255,255,0.04)] backdrop-blur-[18px] min-[410px]:grid-cols-[minmax(0,1fr)_184px_minmax(0,1fr)]">
        <button type="button" onClick={handleBack} className="flex h-12 justify-self-start items-center justify-center gap-1.5 rounded-full pr-2 text-[14px] font-semibold text-white">
          <ArrowLeft size={21} />
          返回
        </button>
        <button
          type="button"
          onClick={handleCreateMeetup}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/28 bg-[linear-gradient(135deg,#6A5CFF_0%,#C02BFF_52%,#FF4FD8_100%)] text-[16px] font-extrabold text-white shadow-[0_0_14px_rgba(192,43,255,0.85),0_0_28px_rgba(255,79,216,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)]"
        >
          <Plus size={19} />
          发起组队
        </button>
        <div className="flex justify-self-end items-center gap-1">
          <button type="button" onClick={handleSave} aria-label="收藏" className={`grid h-11 w-9 place-items-center ${isSaved ? 'text-[#2EDBFF]' : 'text-white/90'}`}>
            <Star size={24} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button type="button" onClick={handleShare} aria-label="分享" className="grid h-11 w-9 place-items-center text-white/90">
            <Share2 size={23} />
          </button>
          <button type="button" onClick={() => toast.info('当前已在找蹦迪搭子页')} aria-label="搭子" className="grid h-11 w-9 place-items-center rounded-full text-[#FF4FD8] shadow-[0_0_18px_rgba(192,43,255,0.4)]">
            <UsersRound size={25} fill="currentColor" />
          </button>
        </div>
      </nav>
    </main>
  );
}

function MeetupCard({
  meetup,
  onJoin,
  onStoreLink,
}: {
  meetup: NightlifeMeetup;
  onJoin: () => void;
  onStoreLink: () => void;
}) {
  return (
    <article className="grid min-h-[118px] grid-cols-[98px_1fr_92px] gap-2 rounded-[18px] border border-[rgba(192,43,255,0.36)] bg-[rgba(8,10,24,0.58)] p-2 shadow-[0_0_12px_rgba(192,43,255,0.2)] backdrop-blur-[14px]">
      <div className={`nightlife-thumb nightlife-thumb-${meetup.imageTone}`}>
        <span>{meetup.storeName.split(' ')[0]}</span>
      </div>
      <div className="min-w-0 py-1">
        <h4 className="truncate text-[17px] font-extrabold text-white">{meetup.storeName}</h4>
        <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#48F0B4]">
          <MapPin size={12} fill="currentColor" />
          <span className="truncate">{meetup.location} · {meetup.distanceText}</span>
        </p>
        <div className="mt-2 flex gap-1 overflow-hidden">
          {meetup.tags.map((tag) => (
            <span key={tag} className="shrink-0 rounded-full bg-white/7 px-2 py-1 text-[10px] font-semibold text-white/62">
              {tag}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={onStoreLink}
          className="mt-2 flex h-8 max-w-[116px] items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 text-[12px] font-semibold text-white/78"
        >
          <Link2 size={14} />
          店铺链接
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="flex flex-col items-end justify-between py-1">
        <div className="text-right text-[16px] font-extrabold">
          <span className="text-[#48F0B4]">{meetup.currentPeople}</span>
          <span className="text-white/68">/{meetup.maxPeople}人</span>
        </div>
        <div className="flex -space-x-2">
          {Array.from({ length: Math.min(meetup.currentPeople, 3) }).map((_, index) => (
            <span
              key={index}
              className="grid h-7 w-7 place-items-center rounded-full border border-white/60 text-[10px] font-bold text-white"
              style={{ background: avatarGradients[index] }}
            />
          ))}
          {meetup.maxPeople - meetup.currentPeople > 0 && (
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/24 bg-black/35 text-[11px] font-bold text-white">
              +{meetup.maxPeople - meetup.currentPeople}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onJoin}
          className="h-9 w-[86px] rounded-full border border-white/24 bg-[linear-gradient(135deg,#6A5CFF_0%,#C02BFF_52%,#FF4FD8_100%)] text-[14px] font-extrabold text-white shadow-[0_0_12px_rgba(192,43,255,0.75),0_0_20px_rgba(255,79,216,0.35)]"
        >
          一起去
        </button>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-white/62">
          <Clock3 size={13} />
          {meetup.time}
        </div>
      </div>
    </article>
  );
}

function LockedSlot() {
  return (
    <div className="grid h-[64px] grid-cols-[74px_1fr_104px] items-center gap-2 rounded-[16px] border border-white/10 bg-[rgba(12,14,24,0.52)] px-2 opacity-70">
      <span className="grid h-11 w-11 place-items-center justify-self-center rounded-full border border-dashed border-white/28 text-white/42">
        <LockKeyhole size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-bold text-white/56">锁定位</span>
        <span className="mt-0.5 block truncate text-[11px] font-medium text-white/38">会员专属组队位，敬请期待</span>
      </span>
      <button type="button" disabled className="h-9 rounded-full bg-white/8 text-[12px] font-semibold text-white/42">
        敬请期待
      </button>
    </div>
  );
}
