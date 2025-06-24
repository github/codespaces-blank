export interface Plan {
	id: string;
	title: string;
	price: string;
	guests: string;
	roomType: string;
	isFeatured?: boolean;
	badge?: string;
}

// プランデータの定義
export const featuredPlan: Plan = {
	id: "featured-001",
	title: "お得な特典付きプラン",
	price: "大人1名7,000円",
	guests: "1名様から",
	roomType: "スタンダードツイン",
	isFeatured: true,
	badge: "本日限り",
};

export const regularPlans: Plan[] = [
	{
		id: "plan-001",
		title: "素泊まり",
		price: "大人1名5,500円",
		guests: "1名様から",
		roomType: "シングル",
	},
	{
		id: "plan-002",
		title: "出張ビジネスプラン",
		price: "大人1名7,500円",
		guests: "1名様から",
		roomType: "シングル",
	},
	{
		id: "plan-003",
		title: "エステ・マッサージプラン",
		price: "大人1名9,000円",
		guests: "1名様から",
		roomType: "部屋指定なし",
	},
	{
		id: "plan-004",
		title: "貸し切り露天風呂プラン",
		price: "大人1名9,000円",
		guests: "1名様から",
		roomType: "部屋指定なし",
	},
	{
		id: "plan-005",
		title: "カップル限定プラン",
		price: "大人1名8,000円",
		guests: "2名様から",
		roomType: "プレミアムツイン",
	},
	{
		id: "plan-006",
		title: "テーマパーク優待プラン",
		price: "大人1名10,000円",
		guests: "1名様から",
		roomType: "部屋指定なし",
	},
];
