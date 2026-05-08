import type { Language } from '../contexts/LanguageContext';
import type { Store } from '../data/stores';

type StoreText = {
  name: Record<Language, string>;
  address: Record<Language, string>;
  description?: Record<Language, string>;
};

const storeText: Record<string, StoreText> = {
  '1': {
    name: { 中文: '云端咖啡馆', 한국어: '구름 카페', English: 'Cloud Cafe' },
    address: { 中文: '首尔 弘大安静小巷', 한국어: '서울 홍대 조용한 골목', English: 'Quiet alley, Hongdae Seoul' },
  },
  '2': {
    name: { 中文: '花间寿司', 한국어: '하나 스시', English: 'Hana Sushi' },
    address: { 中文: '首尔 延南洞', 한국어: '서울 연남동', English: 'Yeonnam-dong, Seoul' },
  },
  '3': {
    name: { 中文: '悦颜医美诊所', 한국어: '유안 클리닉', English: 'Yueyan Clinic' },
    address: { 中文: '首尔 江南区', 한국어: '서울 강남구', English: 'Gangnam, Seoul' },
  },
  '4': {
    name: { 中文: '美妆工坊', 한국어: '뷰티 공방', English: 'Beauty Studio' },
    address: { 中文: '首尔 성수 뷰티 거리', 한국어: '서울 성수 뷰티 거리', English: 'Seongsu beauty street, Seoul' },
  },
  '5': {
    name: { 中文: '首尔烤鸭小馆', 한국어: '서울 덕 하우스', English: 'Seoul Duck House' },
    address: { 中文: '首尔 明洞小巷', 한국어: '서울 명동 골목', English: 'Myeongdong alley, Seoul' },
  },
  '6': {
    name: { 中文: '森林咖啡', 한국어: '숲 카페', English: 'Forest Cafe' },
    address: { 中文: '首尔 望远洞', 한국어: '서울 망원동', English: 'Mangwon-dong, Seoul' },
  },
  '7': {
    name: { 中文: '星光医美中心', 한국어: '스타라이트 클리닉', English: 'Starlight Clinic' },
    address: { 中文: '首尔 江南皮肤管理街', 한국어: '서울 강남 피부관리 거리', English: 'Gangnam skin care street' },
  },
  '8': {
    name: { 中文: '彩妆天堂', 한국어: '컬러 뷰티', English: 'Color Beauty' },
    address: { 中文: '首尔 明洞美妆街', 한국어: '서울 명동 뷰티 거리', English: 'Myeongdong beauty street' },
  },
  '9': {
    name: { 中文: '韩式参鸡汤', 한국어: '삼계탕 집', English: 'Samgyetang House' },
    address: { 中文: '首尔 钟路', 한국어: '서울 종로', English: 'Jongno, Seoul' },
  },
  '10': {
    name: { 中文: '釜山参鸡汤', 한국어: '부산 삼계탕', English: 'Busan Samgyetang' },
    address: { 中文: '首尔 신촌', 한국어: '서울 신촌', English: 'Sinchon, Seoul' },
  },
  '11': {
    name: { 中文: '美式汉堡屋', 한국어: '아메리칸 버거 하우스', English: 'American Burger House' },
    address: { 中文: '首尔 弘大入口', 한국어: '서울 홍대입구', English: 'Hongdae Entrance, Seoul' },
  },
  '12': {
    name: { 中文: '手工汉堡工坊', 한국어: '수제 버거 공방', English: 'Craft Burger Studio' },
    address: { 中文: '首尔 合井', 한국어: '서울 합정', English: 'Hapjeong, Seoul' },
  },
  '13': {
    name: { 中文: '美肤之光医美', 한국어: '스킨라이트 클리닉', English: 'Skin Light Clinic' },
    address: { 中文: '首尔 江南', 한국어: '서울 강남', English: 'Gangnam, Seoul' },
  },
  '14': {
    name: { 中文: '韩式轻医美', 한국어: '라이트 클리닉', English: 'Light Korean Clinic' },
    address: { 中文: '首尔 狎鸥亭', 한국어: '서울 압구정', English: 'Apgujeong, Seoul' },
  },
  '15': {
    name: { 中文: 'Neon 夜店', 한국어: 'Neon 클럽', English: 'Neon Club' },
    address: { 中文: '首尔 梨泰院', 한국어: '서울 이태원', English: 'Itaewon, Seoul' },
  },
  '16': {
    name: { 中文: 'Sky Bar', 한국어: '스카이 바', English: 'Sky Bar' },
    address: { 中文: '首尔 江南天台', 한국어: '서울 강남 루프탑', English: 'Gangnam rooftop, Seoul' },
  },
  '17': {
    name: { 中文: 'Jazz Live House', 한국어: '재즈 라이브 하우스', English: 'Jazz Live House' },
    address: { 中文: '首尔 성수 작은 공연장', 한국어: '서울 성수 작은 공연장', English: 'Small live house, Seongsu' },
  },
};

const tagText: Record<string, Record<Language, string>> = {
  美食: { 中文: '美食', 한국어: '맛집', English: 'Food' },
  咖啡: { 中文: '咖啡', 한국어: '카페', English: 'Coffee' },
  约会: { 中文: '约会', 한국어: '데이트', English: 'Date' },
  本地人常去: { 中文: '本地人常去', 한국어: '현지인 추천', English: 'Local favorite' },
  日料: { 中文: '日料', 한국어: '일식', English: 'Japanese' },
  小众: { 中文: '小众', 한국어: '숨은 곳', English: 'Hidden' },
  医美: { 中文: '医美', 한국어: '의료미용', English: 'Clinic' },
  护肤: { 中文: '护肤', 한국어: '피부관리', English: 'Skin care' },
  皮肤管理: { 中文: '皮肤管理', 한국어: '피부관리', English: 'Skin care' },
  中文沟通: { 中文: '中文沟通', 한국어: '중국어 가능', English: 'Chinese support' },
  夜生活: { 中文: '夜生活', 한국어: '나이트라이프', English: 'Nightlife' },
  组队: { 中文: '组队', 한국어: '같이 가기', English: 'Team up' },
  鸡尾酒: { 中文: '鸡尾酒', 한국어: '칵테일', English: 'Cocktail' },
  汉堡: { 中文: '汉堡', 한국어: '버거', English: 'Burger' },
  韩餐: { 中文: '韩餐', 한국어: '한식', English: 'Korean food' },
  参鸡汤: { 中文: '参鸡汤', 한국어: '삼계탕', English: 'Samgyetang' },
  彩妆: { 中文: '彩妆', 한국어: '메이크업', English: 'Makeup' },
  酒吧: { 中文: '酒吧', 한국어: '바', English: 'Bar' },
};

export function localizeStore(store: Store, language: Language): Store {
  const text = storeText[store.id];

  return {
    ...store,
    name: text?.name[language] ?? store.name,
    address: text?.address[language] ?? store.address,
    description: text?.description?.[language] ?? store.description,
    tags: store.tags.map((tag) => tagText[tag]?.[language] ?? tag),
  };
}

export function localizeTag(tag: string, language: Language) {
  return tagText[tag]?.[language] ?? tag;
}
