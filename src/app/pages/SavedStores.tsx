import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin } from 'lucide-react';
import { stores } from '../data/stores';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function SavedStores() {
  const navigate = useNavigate();

  // TODO: 这里应该从localStorage或状态管理中获取已保存的店铺
  const savedStoreIds = new Set<string>(['3']); // 示例数据
  const savedStores = stores.filter((store) => savedStoreIds.has(store.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold">我的地图</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {savedStores.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>还没有收藏的店铺</p>
            <p className="text-sm mt-2">去首页发现更多好店吧</p>
          </div>
        ) : (
          savedStores.map((store) => (
            <div
              key={store.id}
              onClick={() => navigate(`/store/${store.id}`)}
              className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2">{store.name}</h2>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {store.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-start gap-2">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{store.address}</span>
                    </p>
                    <p className="text-gray-500">{store.distance}km</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
