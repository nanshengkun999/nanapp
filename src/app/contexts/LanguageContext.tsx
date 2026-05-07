import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = '中文' | '한국어' | 'English';

interface Translations {
  [key: string]: {
    '中文': string;
    '한국어': string;
    'English': string;
  };
}

const translations: Translations = {
  // Navigation
  map: { '中文': '地图', '한국어': '지도', 'English': 'Map' },
  favorites: { '中文': '收藏', '한국어': '즐겨찾기', 'English': 'Favorites' },
  services: { '中文': '服务', '한국어': '서비스', 'English': 'Services' },
  forum: { '中文': '贴吧', '한국어': '포럼', 'English': 'Forum' },
  video: { '中文': '视频', '한국어': '비디오', 'English': 'Video' },

  // Categories
  food: { '中文': '美食', '한국어': '맛집', 'English': 'Food' },
  beauty: { '中文': '医美', '한국어': '의료미용', 'English': 'Medical Beauty' },
  nightlife: { '中文': '夜生活', '한국어': '나이트라이프', 'English': 'Nightlife' },

  // Buttons
  goHere: { '中文': '去这里', '한국어': '여기로 가기', 'English': 'Go Here' },
  bookNow: { '中文': '立即预约', '한국어': '지금 예약', 'English': 'Book Now' },
  myMap: { '中文': '我的地图', '한국어': '내 지도', 'English': 'My Map' },
  more: { '中文': '更多', '한국어': '더보기', 'English': 'More' },

  // Settings
  settings: { '中文': '设置', '한국어': '설정', 'English': 'Settings' },
  account: { '中文': '账号与个人', '한국어': '계정 및 개인정보', 'English': 'Account & Personal' },
  language: { '中文': '语言', '한국어': '언어', 'English': 'Language' },
  region: { '中文': '地区', '한국어': '지역', 'English': 'Region' },
  notifications: { '中文': '通知管理', '한국어': '알림 관리', 'English': 'Notifications' },
  privacy: { '中文': '隐私 & 安全', '한국어': '개인정보 및 보안', 'English': 'Privacy & Security' },
  contentPreference: { '中文': '内容偏好', '한국어': '콘텐츠 선호도', 'English': 'Content Preference' },
  payment: { '中文': '支付与订单', '한국어': '결제 및 주문', 'English': 'Payment & Orders' },
  becomeProvider: { '中文': '成为服务者', '한국어': '서비스 제공자 되기', 'English': 'Become a Provider' },
  other: { '中文': '其他', '한국어': '기타', 'English': 'Other' },

  // Forum
  secondHand: { '中文': '二手交易吧', '한국어': '중고거래 게시판', 'English': 'Second-hand Trading' },
  housing: { '中文': '房源租售吧', '한국어': '부동산 게시판', 'English': 'Housing & Rental' },
  party: { '中文': '蹦迪组队吧', '한국어': '클럽 파티 게시판', 'English': 'Party & Clubbing' },
  poll: { '中文': '发起投票吧', '한국어': '투표 게시판', 'English': 'Polls & Voting' },
  moderator: { '中文': '吧主', '한국어': '운영자', 'English': 'Moderator' },
  latest: { '中文': '最新', '한국어': '최신', 'English': 'Latest' },
  hot: { '中文': '热门', '한국어': '인기', 'English': 'Hot' },
  filter: { '中文': '筛选', '한국어': '필터', 'English': 'Filter' },

  // Services
  localGuide: { '中文': '地陪', '한국어': '현지 가이드', 'English': 'Local Guide' },
  guesthouse: { '中文': '民宿', '한국어': '민박', 'English': 'Guesthouse' },
  carRental: { '中文': '包车', '한국어': '차량 대여', 'English': 'Car Rental' },
  translation: { '中文': '翻译', '한국어': '통역', 'English': 'Translation' },
  photoEdit: { '中文': '修图', '한국어': '사진 편집', 'English': 'Photo Editing' },
  videoEdit: { '中文': '剪辑视频', '한국어': '영상 편집', 'English': 'Video Editing' },

  // Common
  search: { '中文': '搜索', '한국어': '검색', 'English': 'Search' },
  close: { '中文': '关闭', '한국어': '닫기', 'English': 'Close' },
  confirm: { '中文': '确认', '한국어': '확인', 'English': 'Confirm' },
  cancel: { '中文': '取消', '한국어': '취소', 'English': 'Cancel' },
  save: { '中文': '保存', '한국어': '저장', 'English': 'Save' },
  details: { '中文': '详情', '한국어': '상세정보', 'English': 'Details' },
  orders: { '中文': '订单', '한국어': '주문', 'English': 'Orders' },
  myOrders: { '中文': '我的订单', '한국어': '내 주문', 'English': 'My Orders' },

  // Common actions
  viewDetails: { '中文': '查看详情', '한국어': '상세보기', 'English': 'View Details' },
  navigation: { '中文': '导航', '한국어': '길찾기', 'English': 'Navigation' },

  // Settings page
  nickname: { '中文': '昵称', '한국어': '닉네임', 'English': 'Nickname' },
  avatar: { '中文': '头像', '한국어': '프로필 사진', 'English': 'Avatar' },
  clickToModify: { '中文': '点击修改头像和昵称', '한국어': '프로필 사진 및 닉네임 수정', 'English': 'Tap to modify avatar and nickname' },
  commentNotif: { '中文': '评论通知', '한국어': '댓글 알림', 'English': 'Comment Notifications' },
  recommendNotif: { '中文': '推荐通知', '한국어': '추천 알림', 'English': 'Recommendation Notifications' },
  orderNotif: { '中文': '服务订单通知', '한국어': '서비스 주문 알림', 'English': 'Service Order Notifications' },
  showLocation: { '中文': '是否展示位置', '한국어': '위치 표시 여부', 'English': 'Show Location' },
  allowRecommend: { '中文': '是否允许被推荐', '한국어': '추천 허용 여부', 'English': 'Allow Recommendations' },
  blacklist: { '중문': '黑名单', '한국어': '차단 목록', 'English': 'Blacklist' },
  selectCategories: { '中文': '选择你感兴趣的分类', '한국어': '관심 카테고리 선택', 'English': 'Select categories of interest' },
  tagPreference: { '中文': '标签偏好', '한국어': '태그 선호도', 'English': 'Tag Preferences' },
  tagPreferenceDesc: { '中文': '汉堡 / 烤肉 / 皮肤管理等', '한국어': '햄버거 / 바베큐 / 피부관리 등', 'English': 'Burger / BBQ / Skin care, etc.' },
  distanceRange: { '中文': '距离范围', '한국어': '거리 범위', 'English': 'Distance Range' },
  paymentMethod: { '中文': '支付方式', '한국어': '결제 수단', 'English': 'Payment Method' },
  orderHistory: { '中文': '历史订单', '한국어': '주문 내역', 'English': 'Order History' },
  invoice: { '中文': '发票', '한국어': '영수증', 'English': 'Invoice' },
  joinService: { '中文': '入驻服务', '한국어': '서비스 입점', 'English': 'Join as Provider' },
  joinServiceDesc: { '中文': '地陪 / 民宿 / 包车等', '한국어': '가이드 / 민박 / 차량대여 등', 'English': 'Guide / Accommodation / Car rental, etc.' },
  uploadCredentials: { '中文': '上传资质', '한국어': '자격증 업로드', 'English': 'Upload Credentials' },
  setPrice: { '中文': '设置价格', '한국어': '가격 설정', 'English': 'Set Price' },
  clearCache: { '中文': '清除缓存', '한국어': '캐시 삭제', 'English': 'Clear Cache' },
  aboutTanmap: { '中文': '关于 Tanmap', '한국어': 'Tanmap 정보', 'English': 'About Tanmap' },
  contactSupport: { '中文': '联系客服', '한국어': '고객센터 문의', 'English': 'Contact Support' },
  logout: { '中文': '退出登录', '한국어': '로그아웃', 'English': 'Logout' },
  selectLanguage: { '中文': '选择语言', '한국어': '언어 선택', 'English': 'Select Language' },

  // More page
  viewOrderHistory: { '中文': '查看订单历史和状态', '한국어': '주문 내역 및 상태 확인', 'English': 'View order history and status' },
  accountPrivacy: { '中文': '账号、隐私、通知等', '한국어': '계정, 개인정보, 알림 등', 'English': 'Account, privacy, notifications, etc.' },

  // Services page
  bookNowBtn: { '中文': '立即预约', '한국어': '지금 예약', 'English': 'Book Now' },
  detailsBtn: { '中文': '详情', '한국어': '상세', 'English': 'Details' },

  // Favorites
  myFavorites: { '中文': '我的收藏', '한국어': '내 즐겨찾기', 'English': 'My Favorites' },
  noFavorites: { '中文': '暂无收藏', '한국어': '즐겨찾기 없음', 'English': 'No favorites yet' },

  // Map page
  mapTitle: { '中文': '地图', '한국어': '지도', 'English': 'Map' },
  mapView: { '中文': '地图视图', '한국어': '지도 보기', 'English': 'Map View' },
  integrateMapAPI: { '中文': '（集成地图 API）', '한국어': '(지도 API 연동)', 'English': '(Integrate Map API)' },
  businessHours: { '中文': '营业时间：', '한국어': '영업시간:', 'English': 'Hours:' },

  // Store names and locations
  cloudCafe: { '中文': '云端咖啡馆', '한국어': '클라우드 카페', 'English': 'Cloud Cafe' },
  flowerSushi: { '中文': '花间寿司', '한국어': '꽃 사이 스시', 'English': 'Flower Sushi' },
  yueyenClinic: { '中文': '悦颜医美诊所', '한국어': '위엔 의료미용 클리닉', 'English': 'Yueyen Medical Beauty Clinic' },
  beautyWorkshop: { '中文': '美妆工坊', '한국어': '뷰티 워크샵', 'English': 'Beauty Workshop' },
  oldBeijingDuck: { '中文': '老北京烤鸭', '한국어': '올드 베이징 오리구이', 'English': 'Old Beijing Roast Duck' },
  koreanGinseng: { '中文': '韩式参鸡汤', '한국어': '한식 삼계탕', 'English': 'Korean Ginseng Chicken Soup' },
  busanGinseng: { '中文': '釜山参鸡汤', '한국어': '부산 삼계탕', 'English': 'Busan Ginseng Soup' },
  americanBurger: { '中文': '美式汉堡屋', '한국어': '미국식 버거 하우스', 'English': 'American Burger House' },
  handmadeBurger: { '中文': '手工汉堡工坊', '한국어': '수제 버거 공방', 'English': 'Handmade Burger Workshop' },
  forestCoffee: { '中文': '森林咖啡', '한국어': '포레스트 커피', 'English': 'Forest Coffee' },
  starMedical: { '中文': '星光医美中心', '한국어': '스타라이트 의료미용센터', 'English': 'Starlight Medical Beauty Center' },
  beautySkin: { '中文': '美肤之光医疗美容', '한국어': '뷰티 스킨 의료미용', 'English': 'Beauty Skin Medical Aesthetics' },
  koreanLight: { '中文': '韩式轻医美', '한국어': '한식 라이트 의료미용', 'English': 'Korean Light Medical Beauty' },
  makeupParadise: { '中文': '彩妆天堂', '한국어': '메이크업 파라다이스', 'English': 'Makeup Paradise' },

  // Addresses
  sanlitunAddr: { '中文': '朝阳区三里屯路11号', '한국어': '차오양구 산리툰로 11호', 'English': '11 Sanlitun Road, Chaoyang District' },
  zhongguancunAddr: { '中文': '海淀区中关村大街1号', '한국어': '하이덴구 중관촌대로 1호', 'English': '1 Zhongguancun Street, Haidian District' },
  wangfujingAddr: { '中文': '东城区王府井大街138号', '한국어': '둥청구 왕푸징대로 138호', 'English': '138 Wangfujing Street, Dongcheng District' },
  houhaiAddr: { '中文': '西城区后海北沿18号', '한국어': '시청구 허우하이 북쪽 18호', 'English': '18 North Houhai, Xicheng District' },
  caoqiaoAddr: { '中文': '丰台区草桥路8号', '한국어': '펑타이구 차오차오로 8호', 'English': '8 Caoqiao Road, Fengtai District' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('中文');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
