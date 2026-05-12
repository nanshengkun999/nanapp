import { Heart, MapPin, MoreHorizontal, Search, Send, type LucideIcon } from 'lucide-react';

interface HomeQuickDockProps {
  onOpenFavorites: () => void;
  onOpenSearch: () => void;
  onOpenMap: () => void;
  onGoHere: () => void;
  onOpenMore: () => void;
  centerIcon?: LucideIcon;
  labels: {
    favorites: string;
    search: string;
    map: string;
    goHere: string;
    more: string;
  };
}

export default function HomeQuickDock({
  onOpenFavorites,
  onOpenSearch,
  onOpenMap,
  onGoHere,
  onOpenMore,
  centerIcon: CenterIcon = MapPin,
  labels,
}: HomeQuickDockProps) {
  return (
    <nav
      className="fixed left-1/2 bottom-[calc(10px+env(safe-area-inset-bottom))] z-[80] grid h-[56px] w-[min(calc(100%_-_22px),402px)] -translate-x-1/2 grid-cols-5 items-end rounded-full border border-white/80 bg-white/92 px-2 pb-1 pt-1 shadow-[0_10px_24px_rgba(0,0,0,0.13)] backdrop-blur-2xl"
      aria-label="home quick navigation"
    >
      <HomeQuickDockButton icon={Heart} label={labels.favorites} onClick={onOpenFavorites} />
      <HomeQuickDockButton icon={Search} label={labels.search} onClick={onOpenSearch} />
      <button
        type="button"
        onClick={onOpenMap}
        aria-label={labels.map}
        className="tan-pressable -mt-8 flex min-h-[70px] flex-col items-center justify-start text-[#0EA896]"
      >
        <span className="grid h-[68px] w-[68px] place-items-center rounded-full border border-white/75 bg-[radial-gradient(circle_at_35%_30%,#74F8EA,#12B8A6_56%,#078D80)] text-white shadow-[0_0_0_8px_rgba(18,184,166,0.16),0_0_28px_rgba(18,184,166,0.56),0_10px_22px_rgba(0,0,0,0.18)]">
          <CenterIcon size={28} fill={CenterIcon === MapPin ? 'white' : 'none'} strokeWidth={2.25} />
        </span>
        <span className="-mt-5 text-[11px] font-extrabold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.38)]">
          {labels.map}
        </span>
      </button>
      <HomeQuickDockButton icon={Send} label={labels.goHere} onClick={onGoHere} />
      <HomeQuickDockButton icon={MoreHorizontal} label={labels.more} onClick={onOpenMore} />
    </nav>
  );
}

function HomeQuickDockButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tan-pressable flex min-h-[48px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-[17px] text-[#5F6673]"
    >
      <Icon size={22} strokeWidth={2.05} />
      <span className="text-[10px] font-extrabold leading-none">{label}</span>
    </button>
  );
}
