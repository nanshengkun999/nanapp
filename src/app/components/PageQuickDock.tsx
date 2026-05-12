import { Video } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import HomeQuickDock from './HomeQuickDock';
import { useLanguage } from '../contexts/LanguageContext';

type QuickDockTarget = 'favorites' | 'search' | 'goHere' | 'more';

interface PageQuickDockProps {
  current?: QuickDockTarget;
}

export default function PageQuickDock({ current }: PageQuickDockProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const closeToVideo = () => {
    navigate('/');
  };

  const openOrClose = (target: QuickDockTarget, path: string) => {
    if (current === target || location.pathname === path) {
      closeToVideo();
      return;
    }
    navigate(path);
  };

  return (
    <HomeQuickDock
      onOpenFavorites={() => openOrClose('favorites', '/saved')}
      onOpenSearch={() => navigate('/?search=1')}
      onOpenMap={closeToVideo}
      onGoHere={() => openOrClose('goHere', '/?mode=map')}
      onOpenMore={() => openOrClose('more', '/more')}
      centerIcon={Video}
      labels={{
        favorites: t('favorites'),
        search: t('search'),
        map: t('video'),
        goHere: t('goHere'),
        more: t('more'),
      }}
    />
  );
}
