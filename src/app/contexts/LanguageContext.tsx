import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = '中文' | '한국어' | 'English';

type Translations = Record<string, Record<Language, string>>;

export const supportedLanguages: Language[] = ['中文', '한국어', 'English'];

const translations: Translations = {
  map: { 中文: '地图', 한국어: '지도', English: 'Map' },
  favorites: { 中文: '收藏', 한국어: '저장', English: 'Saved' },
  services: { 中文: '服务', 한국어: '서비스', English: 'Services' },
  forum: { 中文: '贴吧', 한국어: '커뮤니티', English: 'Forum' },
  more: { 中文: '更多', 한국어: '더보기', English: 'More' },
  video: { 中文: '视频', 한국어: '영상', English: 'Video' },
  search: { 中文: '搜索', 한국어: '검색', English: 'Search' },
  close: { 中文: '关闭', 한국어: '닫기', English: 'Close' },
  mainNavigation: { 中文: '主导航', 한국어: '주요 내비게이션', English: 'Main navigation' },
  back: { 中文: '返回', 한국어: '뒤로', English: 'Back' },
  clear: { 中文: '清除', 한국어: '지우기', English: 'Clear' },
  details: { 中文: '详情', 한국어: '상세', English: 'Details' },
  navigation: { 中文: '导航', 한국어: '길찾기', English: 'Navigate' },
  startNavigation: { 中文: '开始导航', 한국어: '길찾기 시작', English: 'Start navigation' },
  viewDetails: { 中文: '查看详情', 한국어: '상세 보기', English: 'View details' },
  storeNotFound: { 中文: '店铺未找到', 한국어: '가게를 찾을 수 없어요', English: 'Store not found' },
  returnHome: { 中文: '返回首页', 한국어: '홈으로 돌아가기', English: 'Back home' },
  recommendedReason: { 中文: '推荐理由', 한국어: '추천 이유', English: 'Why recommended' },
  placesUnit: { 中文: '个地点', 한국어: '곳', English: 'places' },
  allPlaces: { 中文: '全部地点', 한국어: '전체 장소', English: 'All places' },
  resultCount: { 中文: '个结果', 한국어: '개 결과', English: 'results' },
  noMatchingPlaces: { 中文: '没有找到匹配地点', 한국어: '일치하는 장소가 없어요', English: 'No matching places' },
  tryAnotherKeyword: { 中文: '换一个关键词，或者清除筛选再看看。', 한국어: '다른 검색어를 쓰거나 필터를 지워보세요.', English: 'Try another keyword or clear filters.' },
  clearFilters: { 中文: '清除筛选', 한국어: '필터 지우기', English: 'Clear filters' },
  tagFilter: { 中文: '标签筛选', 한국어: '태그 필터', English: 'Tag filter' },
  collapse: { 中文: '收起', 한국어: '접기', English: 'Collapse' },
  locate: { 中文: '定位', 한국어: '현재 위치', English: 'Locate' },
  zoomIn: { 中文: '放大', 한국어: '확대', English: 'Zoom in' },
  zoomOut: { 中文: '缩小', 한국어: '축소', English: 'Zoom out' },
  layers: { 中文: '图层', 한국어: '레이어', English: 'Layers' },
  searchStorePlaceTag: { 中文: '搜索店铺、地点、标签', 한국어: '가게, 장소, 태그 검색', English: 'Search stores, places, tags' },
  searchStorePlace: { 中文: '搜索店铺、地点', 한국어: '가게, 장소 검색', English: 'Search stores, places' },
  chooseStore: { 中文: '选择', 한국어: '선택', English: 'Choose' },
  closeStoreDetail: { 中文: '关闭店铺详情', 한국어: '가게 상세 닫기', English: 'Close store detail' },
  dining: { 中文: '餐饮', 한국어: '맛집', English: 'Dining' },
  diningSaved: { 中文: '餐饮收藏', 한국어: '맛집 저장', English: 'Dining saved' },
  clinicBooking: { 中文: '医美预约', 한국어: '의료미용 예약', English: 'Clinic booking' },
  discoverPlaces: { 中文: '去发现地点', 한국어: '장소 보러가기', English: 'Discover places' },
  aroundEightMinutes: { 中文: '约8分钟', 한국어: '약 8분', English: 'about 8 min' },
  chaoyangPark: { 中文: '朝阳公园', 한국어: '차오양 공원', English: 'Chaoyang Park' },
  wangjing: { 中文: '望京', 한국어: '왕징', English: 'Wangjing' },
  blueHarbor: { 中文: '蓝港', 한국어: '란강', English: 'Blue Harbor' },
  sanlitun: { 中文: '三里屯', 한국어: '싼리툰', English: 'Sanlitun' },
  embassyArea: { 中文: '使馆区', 한국어: '대사관 구역', English: 'Embassy Area' },
  gongti: { 中文: '工体', 한국어: '궁티', English: 'Workers Stadium' },
  guomao: { 中文: '国贸', 한국어: '궈마오', English: 'Guomao' },
  shuangjing: { 中文: '双井', 한국어: '솽징', English: 'Shuangjing' },
  taikooli: { 中文: '太古里', 한국어: '타이쿠리', English: 'Taikoo Li' },
  liangmaRiver: { 中文: '亮马河', 한국어: '량마허', English: 'Liangma River' },
  cbd: { 中文: 'CBD', 한국어: 'CBD', English: 'CBD' },
  dongdaqiao: { 中文: '东大桥', 한국어: '둥다차오', English: 'Dongdaqiao' },

  settings: { 中文: '设置', 한국어: '설정', English: 'Settings' },
  account: { 中文: '账号与个人信息', 한국어: '계정 및 개인정보', English: 'Account & Profile' },
  nickname: { 中文: '昵称', 한국어: '닉네임', English: 'Nickname' },
  clickToModify: { 中文: '修改头像和昵称', 한국어: '프로필 사진 및 닉네임 수정', English: 'Edit avatar and nickname' },
  language: { 中文: '语言', 한국어: '언어', English: 'Language' },
  region: { 中文: '地区', 한국어: '지역', English: 'Region' },
  seoul: { 中文: '首尔', 한국어: '서울', English: 'Seoul' },
  notifications: { 中文: '通知管理', 한국어: '알림 관리', English: 'Notifications' },
  commentNotif: { 中文: '评论通知', 한국어: '댓글 알림', English: 'Comment notifications' },
  recommendNotif: { 中文: '推荐通知', 한국어: '추천 알림', English: 'Recommendation notifications' },
  orderNotif: { 中文: '服务订单通知', 한국어: '서비스 주문 알림', English: 'Service order notifications' },
  privacy: { 中文: '隐私 & 安全', 한국어: '개인정보 및 보안', English: 'Privacy & Security' },
  showLocation: { 中文: '展示位置', 한국어: '위치 표시', English: 'Show location' },
  allowRecommend: { 中文: '允许被推荐', 한국어: '추천 허용', English: 'Allow recommendations' },
  blacklist: { 中文: '黑名单', 한국어: '차단 목록', English: 'Blacklist' },
  contentPreference: { 中文: '内容偏好', 한국어: '콘텐츠 선호', English: 'Content preferences' },
  selectCategories: { 中文: '选择你感兴趣的分类', 한국어: '관심 있는 카테고리를 선택하세요', English: 'Choose categories you are interested in' },
  food: { 中文: '美食', 한국어: '맛집', English: 'Food' },
  beauty: { 中文: '医美', 한국어: '의료미용', English: 'Medical beauty' },
  nightlife: { 中文: '夜生活', 한국어: '나이트라이프', English: 'Nightlife' },
  tagPreference: { 中文: '标签偏好', 한국어: '태그 선호', English: 'Tag preferences' },
  tagPreferenceDesc: { 中文: '汉堡 / 烤肉 / 皮肤管理等', 한국어: '버거 / 고기집 / 피부관리 등', English: 'Burgers / BBQ / skin care, etc.' },
  distanceRange: { 中文: '距离范围', 한국어: '거리 범위', English: 'Distance range' },
  payment: { 中文: '支付与订单', 한국어: '결제 및 주문', English: 'Payments & Orders' },
  paymentMethod: { 中文: '支付方式', 한국어: '결제 수단', English: 'Payment method' },
  orderHistory: { 中文: '历史订单', 한국어: '주문 내역', English: 'Order history' },
  ordersComingSoon: { 中文: '订单页面开发中...', 한국어: '주문 페이지 준비 중...', English: 'Orders page coming soon...' },
  invoice: { 中文: '发票', 한국어: '영수증', English: 'Invoice' },
  becomeProvider: { 中文: '成为服务者', 한국어: '서비스 제공자 되기', English: 'Become a provider' },
  joinService: { 中文: '入驻服务', 한국어: '서비스 등록', English: 'Join as provider' },
  joinServiceDesc: { 中文: '地陪 / 民宿 / 包车等', 한국어: '동행 / 숙소 / 차량 등', English: 'Guide / stay / car service, etc.' },
  uploadCredentials: { 中文: '上传资质', 한국어: '자격 자료 업로드', English: 'Upload credentials' },
  setPrice: { 中文: '设置价格', 한국어: '가격 설정', English: 'Set price' },
  other: { 中文: '其他', 한국어: '기타', English: 'Other' },
  clearCache: { 中文: '清除缓存', 한국어: '캐시 삭제', English: 'Clear cache' },
  aboutTanmap: { 中文: '关于 Tanmap', 한국어: 'Tanmap 정보', English: 'About Tanmap' },
  contactSupport: { 中文: '联系客服', 한국어: '고객센터 문의', English: 'Contact support' },
  logout: { 中文: '退出登录', 한국어: '로그아웃', English: 'Log out' },

  goHere: { 中文: '去这里', 한국어: '여기로 가기', English: 'Go' },
  favorite: { 中文: '收藏', 한국어: '저장', English: 'Save' },
  follow: { 中文: '关注', 한국어: '팔로우', English: 'Follow' },
  followSoon: { 中文: '关注功能即将开放', 한국어: '팔로우 기능은 곧 열릴 예정이에요', English: 'Follow coming soon' },
  share: { 中文: '分享', 한국어: '공유', English: 'Share' },
  comment: { 中文: '评论', 한국어: '댓글', English: 'Comment' },
  myFavorites: { 中文: '我的收藏', 한국어: '내 저장', English: 'My saved' },
  favoritesSheetSubtitle: { 中文: '不离开视频，稍后再看这些地点', 한국어: '영상을 보면서 나중에 다시 볼 장소', English: 'Keep watching and revisit these places later' },
  noFavorites: { 中文: '暂无收藏', 한국어: '아직 저장한 곳이 없어요', English: 'No saved places yet' },
  noFavoritesDesc: { 中文: '收藏喜欢的地点，稍后再看', 한국어: '마음에 드는 장소를 저장해두세요', English: 'Save places you like for later' },
  discoverFood: { 中文: '去发现美食', 한국어: '맛집 보러가기', English: 'Discover food' },
  viewHot: { 中文: '查看热门', 한국어: '인기 보기', English: 'View popular' },
  addedFavorite: { 中文: '已加入收藏', 한국어: '저장했어요', English: 'Saved' },
  removedFavorite: { 中文: '已取消收藏', 한국어: '저장을 취소했어요', English: 'Removed' },
  shareCopied: { 中文: '分享链接已复制', 한국어: '공유 링크를 복사했어요', English: 'Share link copied' },
  copyFailed: { 中文: '复制失败，请重试', 한국어: '복사에 실패했어요', English: 'Copy failed, try again' },
  commentSoon: { 中文: '评论功能即将开放', 한국어: '댓글 기능은 곧 열릴 예정이에요', English: 'Comments coming soon' },
  closeFavorites: { 中文: '关闭收藏', 한국어: '저장 목록 닫기', English: 'Close saved' },
  selected: { 中文: '精选', 한국어: '추천', English: 'Selected' },
  localFavorite: { 中文: '本地人常去', 한국어: '현지인 추천', English: 'Local favorite' },
  savedSpot: { 中文: '收藏点', 한국어: '저장 스팟', English: 'Saved spot' },
  visitSpot: { 中文: '探店', 한국어: '방문 스팟', English: 'Visit' },
  localSelectedAddress: { 中文: '首尔 本地精选', 한국어: '서울 현지 추천', English: 'Seoul local pick' },
  coffee: { 中文: '咖啡', 한국어: '카페', English: 'Coffee' },
  date: { 中文: '约会', 한국어: '데이트', English: 'Date' },
  japaneseFood: { 中文: '日料', 한국어: '일식', English: 'Japanese' },
  niche: { 中文: '小众', 한국어: '숨은 곳', English: 'Hidden' },
  skinCare: { 中文: '皮肤管理', 한국어: '피부관리', English: 'Skin care' },
  chineseSupport: { 中文: '中文沟通', 한국어: '중국어 가능', English: 'Chinese support' },
  lightBeauty: { 中文: '轻医美', 한국어: '라이트 시술', English: 'Light clinic' },
  teamUp: { 中文: '组队', 한국어: '같이 가기', English: 'Team up' },
  cocktail: { 中文: '鸡尾酒', 한국어: '칵테일', English: 'Cocktail' },

  servicesTitle: { 中文: 'Tanmap 服务', 한국어: 'Tanmap 서비스', English: 'Tanmap Services' },
  servicesSubtitle: { 中文: '本地同学顺手帮忙，简单预约就好', 한국어: '현지 친구에게 가볍게 도움을 예약하세요', English: 'Local help, simple booking' },
  all: { 中文: '全部', 한국어: '전체', English: 'All' },
  localGuide: { 中文: '地陪', 한국어: '동행', English: 'Guide' },
  translation: { 中文: '翻译', 한국어: '통역', English: 'Translate' },
  medicalCompanion: { 中文: '医美陪同', 한국어: '의료미용 동행', English: 'Clinic help' },
  pickup: { 中文: '接送', 한국어: '픽업', English: 'Pickup' },
  photoCompanion: { 中文: '陪拍', 한국어: '촬영 동행', English: 'Photo help' },
  reserve: { 中文: '预约', 한국어: '예약', English: 'Book' },
  publishService: { 中文: '发布服务', 한국어: '서비스 등록', English: 'Publish service' },
  manageService: { 中文: '管理服务', 한국어: '서비스 관리', English: 'Manage services' },
  serviceActions: { 中文: '服务操作', 한국어: '서비스 작업', English: 'Service actions' },
  searchServices: { 中文: '搜索服务', 한국어: '서비스 검색', English: 'Search services' },
  serviceCategory: { 中文: '服务分类', 한국어: '서비스 카테고리', English: 'Service categories' },
  reservePending: { 中文: '预约入口暂未接入', 한국어: '예약 기능은 준비 중입니다', English: 'Booking is not connected yet' },
  publishPending: { 中文: '发布服务入口待接入', 한국어: '서비스 등록은 준비 중입니다', English: 'Publishing is not connected yet' },
  managePending: { 中文: '管理服务入口待接入', 한국어: '서비스 관리는 준비 중입니다', English: 'Management is not connected yet' },
  servicePersonJieun: { 中文: '金智恩', 한국어: '김지은', English: 'Kim Jieun' },
  servicePersonMinseo: { 中文: '朴敏书', 한국어: '박민서', English: 'Park Minseo' },
  servicePersonJunho: { 中文: '李俊浩', 한국어: '이준호', English: 'Lee Junho' },
  servicePersonWoojin: { 中文: '崔宇镇', 한국어: '최우진', English: 'Choi Woojin' },
  servicePersonShuyan: { 中文: '林书妍', 한국어: '임서연', English: 'Lin Shuyan' },
  serviceIntroJieun: { 中文: '熟悉弘大和明洞路线，中文沟通没问题', 한국어: '홍대와 명동 동선에 익숙하고 중국어 가능', English: 'Knows Hongdae and Myeongdong, speaks Chinese' },
  serviceIntroMinseo: { 中文: '可以陪同医美沟通，做事细心一些', 한국어: '의료미용 상담 동행, 꼼꼼하게 도와드려요', English: 'Careful clinic communication support' },
  serviceIntroJunho: { 中文: '仁川机场接送，中韩沟通方便', 한국어: '인천공항 픽업, 한중 소통 가능', English: 'Incheon pickup with Korean-Chinese support' },
  serviceIntroWoojin: { 中文: '可以陪拍首尔旅行，拍照自然', 한국어: '서울 여행 동행 촬영, 자연스럽게 찍어요', English: 'Natural Seoul travel photos' },
  serviceIntroShuyan: { 中文: '韩中互译，日常沟通和资料翻译都可以', 한국어: '한중 통역, 일상 대화와 자료 번역 가능', English: 'Korean-Chinese interpreting and document help' },
  perHour120: { 中文: '¥120/小时', 한국어: '₩24,000/시간', English: '¥120/hr' },
  perHour150: { 中文: '¥150/小时', 한국어: '₩30,000/시간', English: '¥150/hr' },
  perRide80: { 中文: '¥80/次', 한국어: '₩16,000/회', English: '¥80/ride' },
  perHour100: { 中文: '¥100/小时', 한국어: '₩20,000/시간', English: '¥100/hr' },

  providerSubtitle: { 中文: '本地同学发布服务 · 简单接单更轻松', 한국어: '현지 친구의 서비스 등록 · 간단하게 주문 관리', English: 'Publish local help · manage orders easily' },
  providerIdentity: { 中文: '我的服务身份', 한국어: '내 서비스 신분', English: 'My provider profile' },
  verified: { 中文: '官方已核实', 한국어: '공식 인증 완료', English: 'Verified' },
  verifiedSubtitle: { 中文: '真实身份已核实，可自由发布与管理服务', 한국어: '실명 인증 완료, 자유롭게 서비스를 관리할 수 있어요', English: 'Identity verified. You can publish and manage services.' },
  orderStatus: { 中文: '接单状态', 한국어: '주문 상태', English: 'Availability' },
  accepting: { 中文: '接单中', 한국어: '접수 중', English: 'Accepting' },
  reservationOnly: { 中文: '只接预约', 한국어: '예약만', English: 'Booking only' },
  paused: { 中文: '暂停接单', 한국어: '일시 중지', English: 'Paused' },
  scheduleSettings: { 中文: '接单时间设置', 한국어: '접수 시간 설정', English: 'Schedule settings' },
  autoOpen: { 中文: '自动开启接单', 한국어: '자동 접수 시작', English: 'Auto open' },
  autoOpenDesc: { 中文: '每周一至周五 18:00 自动开启', 한국어: '월-금 18:00 자동 시작', English: 'Auto opens Mon-Fri at 18:00' },
  reservationTime: { 中文: '接预约时段', 한국어: '예약 가능 시간', English: 'Booking hours' },
  reservationTimeDesc: { 中文: '每周六 / 周日 12:00-20:00 可预约', 한국어: '토/일 12:00-20:00 예약 가능', English: 'Sat/Sun 12:00-20:00 available' },
  todayViews: { 中文: '今日曝光', 한국어: '오늘 노출', English: 'Views today' },
  consultations: { 中文: '收到咨询', 한국어: '문의', English: 'Inquiries' },
  myOrders: { 中文: '我的订单', 한국어: '내 주문', English: 'My orders' },
  myServices: { 中文: '我的服务', 한국어: '내 서비스', English: 'My services' },
  tips: { 中文: '管理小贴士', 한국어: '관리 팁', English: 'Tips' },
  addService: { 中文: '新增服务', 한국어: '서비스 추가', English: 'Add service' },
  editServiceCard: { 中文: '编辑服务卡', 한국어: '서비스 카드 수정', English: 'Edit service card' },
  publishFlow: { 中文: '发布服务流程', 한국어: '서비스 등록 절차', English: 'Publishing flow' },
  verifyIdentity: { 中文: '身份核实', 한국어: '신분 인증', English: 'Verify identity' },
  verifyIdentityDesc: { 中文: '官方核实真实身份', 한국어: '공식 실명 확인', English: 'Official identity check' },
  setCommission: { 中文: '设置佣金', 한국어: '수수료 설정', English: 'Set commission' },
  setCommissionDesc: { 中文: '自主定价更灵活', 한국어: '유연하게 직접 가격 설정', English: 'Flexible self pricing' },
  publishOrders: { 中文: '发布接单', 한국어: '접수 시작', English: 'Go live' },
  publishOrdersDesc: { 中文: '开启接单赚取报酬', 한국어: '접수를 열고 수익을 얻기', English: 'Accept orders and earn' },
  identityPrivacyNote: { 中文: '真实身份仅用于平台核实，不对外公开', 한국어: '실명 정보는 플랫폼 인증에만 사용되며 공개되지 않습니다', English: 'Identity is only used for verification and never shown publicly' },
  providerName: { 中文: '金智恩', 한국어: '김지은', English: 'Kim Jieun' },
  chineseGuide: { 中文: '中文地陪', 한국어: '중국어 동행', English: 'Chinese guide' },
  fiveYears: { 中文: '5年经验', 한국어: '5년 경험', English: '5 years' },
  fluentChinese: { 中文: '中文流利', 한국어: '중국어 능통', English: 'Fluent Chinese' },
  medicalTranslate: { 中文: '医美翻译', 한국어: '의료미용 통역', English: 'Clinic translator' },
  medicalProfessional: { 中文: '医美专业', 한국어: '의료미용 전문', English: 'Clinic specialist' },
  privacyProtection: { 中文: '隐私保护', 한국어: '개인정보 보호', English: 'Privacy care' },
  shopPhoto: { 中文: '探店陪拍', 한국어: '맛집 동행 촬영', English: 'Photo companion' },
  photographyRetouch: { 中文: '摄影/修图', 한국어: '촬영/보정', English: 'Photo/retouch' },
  localFamiliar: { 中文: '本地熟悉', 한국어: '현지에 익숙함', English: 'Knows local spots' },
  perDay300: { 中文: '¥300/天', 한국어: '₩60,000/일', English: '¥300/day' },
  tenPercentCommission: { 中文: '10%佣金', 한국어: '10% 수수료', English: '10% commission' },
  perHour80: { 中文: '¥80/小时', 한국어: '₩16,000/시간', English: '¥80/hr' },

  moreTitle: { 中文: '我的', 한국어: '내 정보', English: 'Me' },
  explorerName: { 中文: '咖啡探索者', 한국어: '카페 탐험가', English: 'Cafe explorer' },
  explorerBio: { 中文: '探索城市的每一处美好', 한국어: '도시의 좋은 장소를 찾아요', English: 'Exploring every good corner of the city' },
  exploredPlaces: { 中文: '探索地点', 한국어: '탐색 장소', English: 'Places' },
  checkins: { 中文: '打卡', 한국어: '체크인', English: 'Check-ins' },
  wallet: { 中文: '钱包', 한국어: '지갑', English: 'Wallet' },
  walletDesc: { 中文: '余额与支付', 한국어: '잔액 및 결제', English: 'Balance & payment' },
  coupons: { 中文: '优惠券', 한국어: '쿠폰', English: 'Coupons' },
  couponsDesc: { 中文: '3 张可用', 한국어: '3장 사용 가능', English: '3 available' },
  common: { 中文: '常用', 한국어: '자주 사용', English: 'Common' },
  support: { 中文: '支持', 한국어: '지원', English: 'Support' },
  viewOrderHistory: { 中文: '查看订单历史和状态', 한국어: '주문 내역과 상태 보기', English: 'View order history and status' },
  accountPrivacy: { 中文: '账号、隐私、通知等', 한국어: '계정, 개인정보, 알림 등', English: 'Account, privacy, notifications' },
  helpFeedback: { 中文: '帮助与反馈', 한국어: '도움말 및 피드백', English: 'Help & feedback' },
  helpFeedbackDesc: { 中文: '常见问题与反馈', 한국어: '자주 묻는 질문 및 피드백', English: 'FAQ and feedback' },
  aboutDesc: { 中文: '版本信息与介绍', 한국어: '버전 정보 및 소개', English: 'Version and information' },

  forumSearch: { 中文: '搜索帖子、吧友、内容...', 한국어: '게시글, 사용자, 내용 검색...', English: 'Search posts, people, content...' },
  secondHand: { 中文: '二手交易吧', 한국어: '중고 거래', English: 'Second-hand' },
  housing: { 中文: '房源租售吧', 한국어: '방 구하기', English: 'Housing' },
  party: { 中文: '蹦迪组队吧', 한국어: '클럽 모임', English: 'Night out' },
  poll: { 中文: '发起投票吧', 한국어: '투표 만들기', English: 'Polls' },
  moderator: { 中文: '吧主', 한국어: '관리자', English: 'Mod' },
  latest: { 中文: '最新', 한국어: '최신', English: 'Latest' },
  hot: { 中文: '热门', 한국어: '인기', English: 'Hot' },
  filter: { 中文: '筛选', 한국어: '필터', English: 'Filter' },
  recentSearches: { 中文: '最近搜索', 한국어: '최근 검색', English: 'Recent searches' },
  recommendedTags: { 中文: '推荐标签', 한국어: '추천 태그', English: 'Recommended tags' },
  allCategories: { 中文: '全部分类', 한국어: '전체 카테고리', English: 'All categories' },
  nearby: { 中文: '附近', 한국어: '근처', English: 'Nearby' },
  noStoresFound: { 中文: '未找到匹配的店铺', 한국어: '일치하는 가게가 없어요', English: 'No matching stores' },
  searchFoodPlaceholder: { 中文: '搜索你想要的美食...', 한국어: '먹고 싶은 맛집 검색...', English: 'Search food...' },
  searchBeautyPlaceholder: { 中文: '搜索你想变美的地方...', 한국어: '관리받고 싶은 곳 검색...', English: 'Search clinic spots...' },
  searchGenericPlaceholder: { 中文: '搜索你想要的...', 한국어: '원하는 것을 검색...', English: 'Search what you want...' },
  notification: { 中文: '通知', 한국어: '알림', English: 'Notifications' },
  openProfile: { 中文: '打开个人主页', 한국어: '프로필 열기', English: 'Open profile' },
  sale: { 中文: '出售', 한국어: '판매', English: 'Sale' },
  wanted: { 中文: '求购', 한국어: '구매', English: 'Wanted' },
  oneHourAgo: { 中文: '1小时前', 한국어: '1시간 전', English: '1h ago' },
  twoHoursAgo: { 中文: '2小时前', 한국어: '2시간 전', English: '2h ago' },
  moderatorXiaojin: { 中文: '小金', 한국어: '소금', English: 'Jin' },
  moderatorLeo: { 中文: '里奥', 한국어: '리오', English: 'Leo' },
  moderatorDjk: { 中文: 'DJ K', 한국어: 'DJ K', English: 'DJ K' },
  moderatorTicket: { 中文: '小票', 한국어: '표표', English: 'Piao' },
  forumAuthorAjie: { 中文: 'Seoul阿杰', 한국어: 'Seoul 아제', English: 'Seoul Ajie' },
  forumAuthorApple: { 中文: '小苹果', 한국어: '작은사과', English: 'Little Apple' },
  postCameraTitle: { 中文: '出一个几乎全新的相机', 한국어: '거의 새 카메라 판매해요', English: 'Selling a nearly new camera' },
  postCameraContent: { 中文: '因回国出 Sony ZV-E10，买了不到一个月，带原装盒子和配件，价格可小刀。', 한국어: '귀국 때문에 Sony ZV-E10 판매합니다. 구매 한 달 미만, 박스와 구성품 있어요.', English: 'Selling Sony ZV-E10 before returning home. Less than a month old, with box and accessories.' },
  postIpadTitle: { 中文: '求购 iPad Pro 11寸 M2', 한국어: 'iPad Pro 11 M2 구해요', English: 'Looking for iPad Pro 11 M2' },
  postIpadContent: { 中文: '最好是国行，成色好，配件齐全。有出的伙伴滴滴。', 한국어: '상태 좋고 구성품 있는 제품이면 좋아요. 판매하시는 분 연락주세요.', English: 'Prefer a clean unit with accessories. Message me if you have one.' },
  hongdaeEntrance: { 中文: '弘大入口站', 한국어: '홍대입구역', English: 'Hongdae Entrance' },
  gangnamStationNearby: { 中文: '江南站附近', 한국어: '강남역 근처', English: 'Near Gangnam Station' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function normalizeLanguage(value: string | null): Language | null {
  if (!value) return null;
  if (supportedLanguages.includes(value as Language)) return value as Language;
  if (['Chinese', 'zh', 'zh-CN', '中', '中文'].includes(value)) return '中文';
  if (['Korean', 'ko', 'ko-KR', '韩语', '한국어'].includes(value)) return '한국어';
  if (['English', 'en', 'en-US'].includes(value)) return 'English';
  return null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('中文');

  useEffect(() => {
    const savedLanguage = normalizeLanguage(localStorage.getItem('language'));
    if (savedLanguage) {
      setLanguageState(savedLanguage);
      localStorage.setItem('language', savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => translations[key]?.[language] ?? key;

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
