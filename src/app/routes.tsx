import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import MapView from './pages/MapView';
import StoreDetail from './pages/StoreDetail';
import SavedStores from './pages/SavedStores';
import Services from './pages/Services';
import ServiceProviderPage from './pages/ServiceProviderPage';
import Forum from './pages/Forum';
import Settings from './pages/Settings';
import More from './pages/More';
import NightlifeMeetups from './pages/NightlifeMeetups';
import FoodMeetups from './pages/FoodMeetups';
import { useLanguage } from './contexts/LanguageContext';

function OrdersPlaceholder() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">{t('ordersComingSoon')}</p>
    </div>
  );
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/map',
    Component: MapView,
  },
  {
    path: '/store/:id',
    Component: StoreDetail,
  },
  {
    path: '/saved',
    Component: SavedStores,
  },
  {
    path: '/services',
    Component: Services,
  },
  {
    path: '/services/provider',
    Component: ServiceProviderPage,
  },
  {
    path: '/forum',
    Component: Forum,
  },
  {
    path: '/nightlife/meetups',
    Component: NightlifeMeetups,
  },
  {
    path: '/food/meetups',
    Component: FoodMeetups,
  },
  {
    path: '/settings',
    Component: Settings,
  },
  {
    path: '/more',
    Component: More,
  },
  {
    path: '/orders',
    Component: OrdersPlaceholder,
  },
], { basename });
