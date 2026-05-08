import { Heart, Map, MapPin, MessageSquare, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { ComponentType } from 'react';

export type DockTab = 'map' | 'favorites' | 'services' | 'forum' | 'more';

interface MobileDockProps {
  active: DockTab;
  onFavoritesClick?: () => void;
}

const items: {
  id: DockTab;
  label: string;
  path: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}[] = [
  { id: 'map', label: '地图', path: '/', icon: Map },
  { id: 'favorites', label: '收藏', path: '/saved', icon: Heart },
  { id: 'services', label: '服务', path: '/services', icon: MapPin },
  { id: 'forum', label: '贴吧', path: '/forum', icon: MessageSquare },
  { id: 'more', label: '我的', path: '/more', icon: MoreHorizontal },
];

export default function MobileDock({ active, onFavoritesClick }: MobileDockProps) {
  const navigate = useNavigate();

  return (
    <nav className="tan-bottom-dock" aria-label="主导航">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              if (item.id === 'favorites' && onFavoritesClick) {
                onFavoritesClick();
                return;
              }
              navigate(item.path);
            }}
            className={`tan-dock-item tan-pressable ${isActive ? 'is-active' : ''}`}
          >
            <span>
              <Icon size={25} strokeWidth={2.1} />
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
