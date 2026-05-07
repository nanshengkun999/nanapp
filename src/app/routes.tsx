import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import MapView from './pages/MapView';
import StoreDetail from './pages/StoreDetail';
import SavedStores from './pages/SavedStores';
import Services from './pages/Services';
import Forum from './pages/Forum';
import Settings from './pages/Settings';
import More from './pages/More';

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
    path: '/forum',
    Component: Forum,
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
    Component: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">订单页面开发中...</p>
      </div>
    ),
  },
]);
