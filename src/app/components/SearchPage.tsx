import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { Category } from '../data/stores';

interface SearchPageProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: Category;
  tagSearch: string;
  setTagSearch: (value: string) => void;
  recentSearches: string[];
  filteredTags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string) => void;
  onStoreSelect: (storeId: string, gridIndex: number) => void;
  filteredStores: any[];
}

export default function SearchPage({
  isOpen,
  onClose,
  selectedCategory,
  tagSearch,
  setTagSearch,
  recentSearches,
  filteredTags,
  selectedTag,
  onTagSelect,
  onStoreSelect,
  filteredStores,
}: SearchPageProps) {
  const [scrollY, setScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  // 计算动画值
  const isCollapsed = scrollY > 50;
  const tabOpacity = Math.max(0, 1 - scrollY / 50);
  const cardHeight = isCollapsed ? 64 : 120;

  // 根据分类设置主题色
  const themeColor = selectedCategory === '医美' ? '#E8B4C8' : '#14B8A6';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* 顶部玻璃态卡片 */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-10"
        animate={{ height: cardHeight }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="absolute inset-0 backdrop-blur-xl bg-black/40" />

        <div className="relative h-full px-3 py-3 flex flex-col justify-between">
          {/* 搜索栏 */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/10 flex-shrink-0"
            >
              <ArrowLeft size={24} />
            </Button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
              <Input
                placeholder={
                  selectedCategory === '美食'
                    ? '搜索你想要的美食...'
                    : selectedCategory === '医美'
                    ? '搜索你想变美的地方...'
                    : '搜索你想要的...'
                }
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full h-10 pl-10 bg-white/10 border-none text-white placeholder:text-white/40 focus:bg-white/15 rounded-lg"
                autoFocus
              />
            </div>
          </div>

          {/* 分类标签 - 滚动时消失 */}
          <motion.div
            className="flex gap-2 overflow-x-auto scrollbar-hide"
            animate={{ opacity: tabOpacity }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: '-4px' }}
          >
            <Badge
              variant="secondary"
              className="text-white backdrop-blur-sm whitespace-nowrap px-3 py-1 text-xs"
              style={{
                backgroundColor: `${themeColor}cc`,
              }}
            >
              {selectedCategory}
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white/70 whitespace-nowrap px-3 py-1 text-xs">
              全部分类
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white/70 whitespace-nowrap px-3 py-1 text-xs">
              附近
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white/70 whitespace-nowrap px-3 py-1 text-xs">
              热门
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      {/* 可滚动内容区域 */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto pt-32 pb-20"
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {/* 最近搜索 */}
          {recentSearches.length > 0 && !tagSearch && (
            <div className="px-3">
              <h3 className="text-white font-semibold mb-2 text-sm">最近搜索</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <Badge
                    key={search}
                    variant="outline"
                    className="cursor-pointer px-3 py-1 border-white/30 text-white/70 hover:bg-white/10 text-xs"
                    onClick={() => onTagSelect(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 推荐标签 */}
          {!tagSearch && (
            <div className="px-3">
              <h3 className="text-white font-semibold mb-2 text-sm">推荐标签</h3>
              <div className="flex flex-wrap gap-2">
                {filteredTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'secondary'}
                    className={`cursor-pointer px-3 py-1 text-xs ${
                      selectedTag === tag
                        ? 'text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                    style={{
                      backgroundColor: selectedTag === tag ? themeColor : undefined,
                    }}
                    onClick={() => onTagSelect(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 3列网格结果 - 紧凑排列，4:5比例 */}
          <div>
            {filteredStores.length === 0 && tagSearch ? (
              <p className="text-center text-white/60 py-12">未找到匹配的店铺</p>
            ) : (
              <div className="grid grid-cols-3 gap-0.5 px-0.5">
                {filteredStores.map((store, index) => (
                  <motion.div
                    key={store.id}
                    className="aspect-[4/5] overflow-hidden bg-black relative cursor-pointer"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onStoreSelect(store.id, index);
                      onClose();
                    }}
                  >
                    {/* 视频缩略图 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <div className="text-center p-2">
                        <p className="text-white font-semibold text-xs mb-1">{store.name}</p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {store.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-[10px] text-white/60 bg-white/10 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* 播放标识 */}
                    <div className="absolute bottom-2 left-2 text-white/80 text-xs">
                      📍 {store.distance}km
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
