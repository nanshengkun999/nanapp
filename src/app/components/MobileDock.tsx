import { Heart, Map, MapPin, MessageSquare, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { ComponentType } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export type DockTab = 'map' | 'favorites' | 'services' | 'forum' | 'more';

interface MobileDockProps {
  active: DockTab;
  onFavoritesClick?: () => void;
  onMapClick?: () => void;
  mapLabel?: string;
  mapIcon?: ComponentType<{ size?: number; strokeWidth?: number }>;
}

const items: {
  id: DockTab;
  labelKey: string;
  path: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}[] = [
  { id: 'map', labelKey: 'map', path: '/', icon: Map },
  { id: 'favorites', labelKey: 'favorites', path: '/saved', icon: Heart },
  { id: 'services', labelKey: 'services', path: '/services', icon: MapPin },
  { id: 'forum', labelKey: 'forum', path: '/forum', icon: MessageSquare },
  { id: 'more', labelKey: 'more', path: '/more', icon: MoreHorizontal },
];

export default function MobileDock({
  active,
  onFavoritesClick,
  onMapClick,
  mapLabel,
  mapIcon,
}: MobileDockProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <nav className="tan-bottom-dock" aria-label={t('mainNavigation')}>
      {items.map((item) => {
        const Icon = item.id === 'map' && mapIcon ? mapIcon : item.icon;
        const isActive = active === item.id;
        const label = item.id === 'map' && mapLabel ? mapLabel : t(item.labelKey);

        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              if (item.id === 'map' && onMapClick) {
                onMapClick();
                return;
              }
              if (item.id === 'favorites' && onFavoritesClick) {
                onFavoritesClick();
                return;
              }
              navigate(item.path);
            }}
            className={`tan-dock-item tan-pressable ${isActive ? 'is-active' : ''}`}
          >
            <span>
              <Icon size={20} strokeWidth={2.1} />
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
