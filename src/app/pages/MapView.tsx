import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { X, MapPin, Navigation, ArrowLeft } from 'lucide-react';
import { stores } from '../data/stores';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';

export default function MapView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storeId = searchParams.get('store');
    if (storeId) {
      setSelectedStore(storeId);
    }
  }, [searchParams]);

  const allTags = Array.from(new Set(stores.flatMap((s) => s.tags)));

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  const filteredStores =
    selectedTags.size === 0
      ? stores
      : stores.filter((store) =>
          store.tags.some((tag) => selectedTags.has(tag))
        );

  const selectedStoreData = stores.find((s) => s.id === selectedStore);

  return (
    <div className="h-screen w-full bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm p-4">
        <div className="flex items-center gap-4 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold">地图</h1>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.has(tag) ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div
        className="h-full w-full pt-28 pb-4"
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.map-container')) {
            setSelectedStore(null);
          }
        }}
      >
        <div className="relative w-full h-full bg-gray-200 rounded-lg mx-4 overflow-hidden map-container">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MapPin size={48} className="mx-auto mb-2" />
              <p>地图视图</p>
              <p className="text-sm">（集成地图 API）</p>
            </div>
          </div>

          {filteredStores.map((store) => {
            const isSelected = selectedStore === store.id;
            return (
              <button
                key={store.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all"
                style={{
                  left: `${20 + (parseFloat(store.id) - 1) * 15}%`,
                  top: `${30 + (parseFloat(store.id) - 1) * 12}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStore(store.id);
                }}
              >
                <motion.div
                  animate={{
                    scale: isSelected ? 1.3 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`${
                    isSelected ? 'bg-red-500' : 'bg-pink-500'
                  } text-white rounded-full flex items-center justify-center shadow-lg ${
                    isSelected ? 'w-14 h-14' : 'w-10 h-10'
                  }`}
                >
                  <MapPin size={isSelected ? 28 : 20} />
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedStoreData && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">
                    {selectedStoreData.name}
                  </h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-start gap-2">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{selectedStoreData.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-400">营业时间：</span>
                      <span>{selectedStoreData.hours}</span>
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedStore(null)}
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedStoreData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => navigate(`/store/${selectedStoreData.id}`)}
                  className="flex-1 bg-[#14B8A6] hover:bg-[#0D9488]"
                >
                  <Navigation size={20} className="mr-2" />
                  导航
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/store/${selectedStoreData.id}`)}
                  className="flex-1"
                >
                  查看详情
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
