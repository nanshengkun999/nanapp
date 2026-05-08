import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Clock, MapPin, Navigation, Share2, Heart } from 'lucide-react';
import { stores } from '../data/stores';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';
import { localizeStore } from '../utils/storeI18n';

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [saved, setSaved] = useState(false);

  const storeSource = stores.find((s) => s.id === id);
  const store = storeSource ? localizeStore(storeSource, language) : undefined;

  if (!store) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('storeNotFound')}</h1>
          <Button onClick={() => navigate('/')}>{t('returnHome')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop"
          alt={store.name}
          className="w-full h-64 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          onClick={() => setSaved(!saved)}
        >
          <Heart size={24} className={saved ? 'fill-current text-pink-500' : ''} />
        </Button>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{store.name}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {store.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-0.5 flex-shrink-0 text-gray-500" />
              <div>
                <p>{store.address}</p>
                <p className="text-sm text-gray-500">{store.distance}km</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={20} className="flex-shrink-0 text-gray-500" />
              <p>{store.hours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h2 className="font-semibold mb-2">{t('recommendedReason')}</h2>
          <p className="text-gray-700">{store.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop"
            alt="Store image 1"
            className="w-full h-32 object-cover rounded-lg"
          />
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=300&fit=crop"
            alt="Store image 2"
            className="w-full h-32 object-cover rounded-lg"
          />
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=300&fit=crop"
            alt="Store image 3"
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: store.name,
                text: store.description,
              });
            }
          }}
        >
          <Share2 size={20} className="mr-2" />
          {t('share')}
        </Button>
        <Button className="flex-1">
          <Navigation size={20} className="mr-2" />
          {t('navigation')}
        </Button>
      </div>
    </div>
  );
}
