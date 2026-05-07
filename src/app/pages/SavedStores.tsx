import { Compass, Flame, Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import MobileDock from '../components/MobileDock';

export default function SavedStores() {
  const navigate = useNavigate();

  return (
    <main className="tan-mobile-frame min-h-dvh bg-black text-white">
      <img
        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=1800&fit=crop"
        alt="咖啡背景"
        className="absolute inset-0 h-full w-full object-cover blur-[2px]"
      />
      <div className="absolute inset-0 bg-black/42" />
      <div className="absolute inset-x-0 top-0 z-10 px-6 pt-8">
        <div className="flex items-center justify-between">
          <h1 className="text-[38px] font-extrabold leading-none">Tanmap</h1>
          <button
            type="button"
            aria-label="关闭收藏页"
            onClick={() => navigate('/')}
            className="tan-pressable grid h-14 w-14 place-items-center rounded-full bg-white/12 text-white backdrop-blur-xl"
          >
            <X size={30} />
          </button>
        </div>
      </div>

      <motion.section
        className="tan-dark-sheet absolute inset-x-0 bottom-[calc(110px+env(safe-area-inset-bottom))] z-20 mx-auto w-full max-w-[480px] px-8 py-8"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="mb-16 flex items-center justify-between">
          <h2 className="text-[31px] font-extrabold">我的收藏</h2>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="tan-pressable grid h-12 w-12 place-items-center rounded-full bg-white/12"
          >
            <X size={25} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <Heart size={68} className="mb-7 text-[#A7FFF4]" strokeWidth={1.8} />
          <h3 className="text-[27px] font-bold">暂无收藏</h3>
          <p className="mt-3 text-[16px] text-white/64">收藏喜欢的地点，稍后再看</p>
          <div className="mt-11 flex w-full gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="tan-pressable flex h-14 flex-1 items-center justify-center gap-3 rounded-full border border-white/20 bg-white/14 text-[16px] font-bold"
            >
              <Compass size={22} className="text-[#A7FFF4]" />
              去发现美食
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="tan-pressable flex h-14 flex-1 items-center justify-center gap-3 rounded-full border border-white/20 bg-white/14 text-[16px] font-bold"
            >
              <Flame size={22} className="text-[#FF8068]" />
              查看热门
            </button>
          </div>
        </div>
      </motion.section>

      <MobileDock active="favorites" />
    </main>
  );
}
