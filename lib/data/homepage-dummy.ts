export type BrandInfo = {
  name: string;
  tagline: string;
  description: string;
};

export type Collection = {
  title: string;
  slug: string;
  season: string;
  summary: string;
  priceEur: number;
  coverImage: string;
  images: string[];
  inventory: CollectionInventory[];
};

export type CollectionInventory = {
  size: string;
  stock: number;
};

export type Event = {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
};

export type HomepageData = {
  brand: BrandInfo;
  collections: Collection[];
  events: Event[];
};

export function buildCollectionImages(slug: string) {
  return {
    coverImage: `https://picsum.photos/seed/${slug}-cover/900/1200`,
    images: [
      `https://picsum.photos/seed/${slug}-1/1200/1500`,
      `https://picsum.photos/seed/${slug}-2/1200/1500`,
      `https://picsum.photos/seed/${slug}-3/1200/1500`,
      `https://picsum.photos/seed/${slug}-4/1200/1500`
    ]
  };
}

export function buildEventImage(slug: string) {
  return `https://picsum.photos/seed/${slug}-event-cover/1200/1500`;
}

export function getCollectionSoldOut(inventory: CollectionInventory[]) {
  return inventory.every((item) => item.stock === 0);
}

export function formatEuroPrice(price: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price);
}

export const homepageDummyData: HomepageData = {
  brand: {
    name: 'SNIPERZ',
    tagline: 'Formed in Seoul. Framed in Contrast.',
    description:
      'SNIPERZ는 구조적인 실루엣과 실험적인 그래픽을 기반으로 일상의 긴장감을 옷으로 번역하는 브랜드입니다. 시즌마다 도시와 감정의 충돌을 주제로 룩을 전개합니다.'
  },
  collections: [
    {
      title: 'Fractured Basics',
      slug: 'fractured-basics',
      season: '25FW',
      summary: '데일리웨어의 비율을 비틀어 만든 테일러드 아우터와 와이드 팬츠 캡슐.',
      priceEur: 280,
      ...buildCollectionImages('fractured-basics'),
      inventory: [
        { size: 'S', stock: 0 },
        { size: 'M', stock: 2 },
        { size: 'L', stock: 1 },
        { size: 'XL', stock: 0 }
      ]
    },
    {
      title: 'Night Workshop',
      slug: 'night-workshop',
      season: '26SS',
      summary: '공업 소재와 빈티지 워싱을 결합해 야간 도시의 질감을 담은 라인.',
      priceEur: 340,
      ...buildCollectionImages('night-workshop'),
      inventory: [
        { size: 'S', stock: 0 },
        { size: 'M', stock: 0 },
        { size: 'L', stock: 0 },
        { size: 'XL', stock: 0 }
      ]
    },
    {
      title: 'Ghost Uniform',
      slug: 'ghost-uniform',
      season: '26SUMMER',
      summary: '유니폼 아카이브에서 출발한 레이어드 셔츠와 기능성 셋업 시리즈.',
      priceEur: 220,
      ...buildCollectionImages('ghost-uniform'),
      inventory: [
        { size: 'S', stock: 3 },
        { size: 'M', stock: 5 },
        { size: 'L', stock: 2 },
        { size: 'XL', stock: 1 }
      ]
    }
  ],
  events: [
    {
      title: 'Silence in Concrete',
      slug: 'silence-in-concrete',
      description: '거친 콘크리트 공간 위에 절제된 무브먼트를 얹어 조형감을 강조한 이벤트.',
      coverImage: buildEventImage('silence-in-concrete')
    },
    {
      title: 'Negative Summer',
      slug: 'negative-summer',
      description: '과노출 필름 톤과 어두운 테일러링의 대비를 활용한 시즌 이벤트 비주얼.',
      coverImage: buildEventImage('negative-summer')
    }
  ]
};
