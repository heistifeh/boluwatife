export type MobileScreenSpec = {
  hidden?: boolean;
  /** Rail (mobile filmstrip) variant only: left-to-right position, when it differs from the desktop `order`. */
  order?: number;
  rot?: number;
  left?: string;
  bottom?: string;
  width?: string;
  z?: number;
  padding?: string;
  radius?: string;
  imgRadius?: string;
  border?: string;
  boxShadow?: string;
  filter?: string;
};

export type ScreenSpec = {
  src: string;
  alt: string;
  order: number;
  rot: number;
  left: string;
  bottom: string;
  width: string;
  z: number;
  padding: string;
  radius: string;
  imgRadius: string;
  border: string;
  boxShadow: string;
  filter?: string;
  eager?: boolean;
  /** CSS aspect-ratio for non-phone screenshots, e.g. "1040 / 600". Defaults to the phone 9 / 19. */
  aspect?: string;
  imgWidth?: number;
  imgHeight?: number;
  mobile?: MobileScreenSpec;
  /** Rail (mobile filmstrip) variant only: this screen exists only on mobile and never renders in the desktop fan. */
  desktopHidden?: boolean;
};

export type GlowLayer = {
  top?: string;
  bottom?: string;
  left: string;
  width: string;
  height: string;
  background: string;
};

export type GlowSpec = {
  weight: number;
  layers: GlowLayer[];
};

export type ProductSection = {
  id?: string;
  eyebrow: string;
  eyebrowColor: string;
  badge?: { label: string; dashed?: boolean };
  name: string;
  nameSize: string;
  description: string;
  descriptionSize?: string;
  glow: GlowSpec;
  screens: ScreenSpec[];
  stageHeight: string;
  claim: string;
  claimSize?: string;
  stack: string;
  cta: { label: string; href: string; gradient: string; shadow: string } | null;
  secondary: { label: string; href: string } | null;
};

export const heroStats = [
  "5 systems live",
  { value: "200+", rest: "users on a solo build" },
  { value: "100+", rest: "developers mentored" },
] as const;

export const heroScreens: ScreenSpec[] = [
  {
    src: "/work/klinfits/klinfits-mobile.jpg",
    alt: "Klinfits shop home page on a phone",
    order: 4,
    rot: -8,
    left: "17%",
    bottom: "19%",
    width: "12%",
    z: 1,
    padding: "4px",
    radius: "18px",
    imgRadius: "15px",
    border: "1px solid var(--edge)",
    boxShadow: "0 26px 50px rgba(0,0,0,0.6)",
    filter: "brightness(0.66) saturate(0.88)",
    mobile: {
      rot: 10,
      left: "87%",
      bottom: "34px",
      width: "32%",
      z: 1,
      padding: "3px",
      radius: "16px",
      imgRadius: "13px",
      border: "1px solid #332C24",
      boxShadow: "0 18px 36px rgba(0,0,0,0.6)",
      filter: "brightness(0.58) saturate(0.84)",
    },
  },
  {
    src: "/design/img/dashboard-24e93d62.jpg",
    alt: "ISDS Vendors dashboard with incoming orders and balance",
    order: 2,
    rot: -4,
    left: "30%",
    bottom: "8%",
    width: "15%",
    z: 3,
    padding: "5px",
    radius: "22px",
    imgRadius: "18px",
    border: "1px solid var(--edge)",
    boxShadow: "0 34px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(226,200,156,0.16)",
    filter: "brightness(0.84)",
    mobile: {
      rot: -10,
      left: "13%",
      bottom: "34px",
      width: "32%",
      z: 1,
      padding: "3px",
      radius: "16px",
      imgRadius: "13px",
      border: "1px solid #332C24",
      boxShadow: "0 18px 36px rgba(0,0,0,0.6)",
      filter: "brightness(0.58) saturate(0.84)",
    },
  },
  {
    src: "/design/img/dashboard-c92695ae.jpg",
    alt: "Insta-Delivery customer home with nearby vendors and wallet balance",
    order: 0,
    rot: -1,
    left: "43.5%",
    bottom: "0",
    width: "18.5%",
    z: 6,
    padding: "6px",
    radius: "28px",
    imgRadius: "23px",
    border: "1px solid var(--edge-lit)",
    boxShadow: "0 48px 90px rgba(0,0,0,0.66), inset 0 1px 0 rgba(235,215,175,0.3)",
    eager: true,
    mobile: {
      rot: 2,
      left: "62%",
      bottom: "0",
      width: "48%",
      z: 5,
      padding: "5px",
      radius: "28px",
      imgRadius: "24px",
      border: "1px solid #463C30",
      boxShadow: "0 40px 70px rgba(0,0,0,0.66), inset 0 1px 0 rgba(235,215,175,0.32)",
    },
  },
  {
    src: "/design/img/img-7782.jpg",
    alt: "Fitnex landing screen: Train hard, track harder",
    order: 1,
    rot: 3,
    left: "60%",
    bottom: "5%",
    width: "17%",
    z: 5,
    padding: "6px",
    radius: "26px",
    imgRadius: "21px",
    border: "1px solid var(--edge-lit)",
    boxShadow: "0 42px 80px rgba(0,0,0,0.64), inset 0 1px 0 rgba(235,215,175,0.24)",
    eager: true,
    mobile: {
      rot: -4,
      left: "34%",
      bottom: "12px",
      width: "40%",
      z: 3,
      padding: "4px",
      radius: "22px",
      imgRadius: "18px",
      border: "1px solid #332C24",
      boxShadow: "0 26px 50px rgba(0,0,0,0.64)",
      filter: "brightness(0.8)",
    },
  },
  {
    src: "/design/img/img-7775.jpg",
    alt: "ISDS Driver online on the map waiting for orders",
    order: 3,
    rot: 6,
    left: "74%",
    bottom: "12%",
    width: "14%",
    z: 3,
    padding: "5px",
    radius: "20px",
    imgRadius: "16px",
    border: "1px solid var(--edge)",
    boxShadow: "0 32px 60px rgba(0,0,0,0.6)",
    filter: "brightness(0.82)",
    mobile: { hidden: true },
  },
  {
    src: "/design/img/img-7848.jpg",
    alt: "Cartify product listing",
    order: 5,
    rot: 9,
    left: "85.5%",
    bottom: "21%",
    width: "11.5%",
    z: 1,
    padding: "4px",
    radius: "18px",
    imgRadius: "15px",
    border: "1px solid var(--edge)",
    boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
    filter: "brightness(0.62) saturate(0.85)",
    mobile: { hidden: true },
  },
];

export const trackRecordBlock = {
  title: "Track record",
  body: "I led frontend delivery at ISDS (wallet, checkout, performance) across four apps. I've mentored 100+ engineers and shipped Fitnex solo to 200+ users, and still maintain it.",
  highlights: ["100+", "200+"],
} as const;

export const productSections: ProductSection[] = [
  {
    id: "isds",
    eyebrow: "Insta-Delivery Driver",
    eyebrowColor: "var(--tint-isds)",
    name: "ISDS Driver",
    nameSize: "clamp(38px,6vw,92px)",
    description: "A rider goes online, takes the next job, and proves the drop-off, on a cheap phone and a patchy connection.",
    glow: {
      weight: 0.8,
      layers: [
        { bottom: "-28%", left: "50%", width: "146%", height: "82%", background: "radial-gradient(closest-side, rgba(185,143,82,0.725), rgba(185,143,82,0.218) 54%, rgba(11,10,9,0) 78%)" },
        { bottom: "-12%", left: "50%", width: "60%", height: "48%", background: "radial-gradient(closest-side, rgba(234,208,138,0.741), rgba(234,208,138,0.399) 44%, rgba(185,143,82,0.109) 70%, rgba(11,10,9,0) 85%)" },
      ],
    },
    stageHeight: "clamp(260px,34vw,470px)",
    screens: [
      { src: "/design/img/img-7778.jpg", alt: "Driver message centre", order: 4, rot: -7, left: "24%", bottom: "16%", width: "12%", z: 1, padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid var(--edge)", boxShadow: "0 24px 48px rgba(0,0,0,0.6)", filter: "brightness(0.66) saturate(0.88)", mobile: { width: "128px", padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid #332C24", boxShadow: "0 20px 38px rgba(0,0,0,0.6)", filter: "brightness(0.68) saturate(0.88)" } },
      { src: "/design/img/img-7776.jpg", alt: "Order ready for pickup", order: 2, rot: -3.5, left: "36%", bottom: "6%", width: "15%", z: 3, padding: "5px", radius: "22px", imgRadius: "18px", border: "1px solid var(--edge)", boxShadow: "0 34px 64px rgba(0,0,0,0.62), inset 0 1px 0 rgba(234,208,138,0.16)", filter: "brightness(0.86)", mobile: { width: "140px", padding: "4px", radius: "20px", imgRadius: "17px", border: "1px solid #332C24", boxShadow: "0 22px 42px rgba(0,0,0,0.6)", filter: "brightness(0.78)" } },
      { src: "/design/img/img-7775.jpg", alt: "Driver online on the map, waiting for orders", order: 0, rot: 0, left: "50%", bottom: "0", width: "18.5%", z: 6, padding: "6px", radius: "28px", imgRadius: "23px", border: "1px solid var(--edge-lit)", boxShadow: "0 48px 90px rgba(0,0,0,0.66), inset 0 1px 0 rgba(234,208,138,0.3)", mobile: { width: "188px", padding: "5px", radius: "28px", imgRadius: "24px", border: "1px solid #463C30", boxShadow: "0 34px 60px rgba(0,0,0,0.66), inset 0 1px 0 rgba(234,208,138,0.3)" } },
      { src: "/design/img/img-7777.jpg", alt: "Order delivered confirmation", order: 1, rot: 3.5, left: "64%", bottom: "6%", width: "15%", z: 3, padding: "5px", radius: "22px", imgRadius: "18px", border: "1px solid var(--edge)", boxShadow: "0 34px 64px rgba(0,0,0,0.62), inset 0 1px 0 rgba(234,208,138,0.16)", filter: "brightness(0.86)", mobile: { width: "152px", padding: "4px", radius: "22px", imgRadius: "19px", border: "1px solid #332C24", boxShadow: "0 24px 46px rgba(0,0,0,0.6)", filter: "brightness(0.86)" } },
      { src: "/design/img/img-7779.jpg", alt: "Driver performance review", order: 3, rot: 7, left: "76%", bottom: "16%", width: "12%", z: 1, padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid var(--edge)", boxShadow: "0 24px 48px rgba(0,0,0,0.6)", filter: "brightness(0.66) saturate(0.88)", mobile: { width: "120px", padding: "3px", radius: "16px", imgRadius: "13px", border: "1px solid #332C24", boxShadow: "0 18px 34px rgba(0,0,0,0.6)", filter: "brightness(0.6) saturate(0.85)" } },
    ],
    claim: "The search and list performance work here is what took minutes out of every run.",
    claimSize: "clamp(22px,2.4vw,34px)",
    stack: "React Native · Expo · TypeScript · Node.js · Supabase",
    cta: { label: "Get the driver app", href: "https://apps.apple.com/ar/app/insta-delivery-driver/id6747667869?l=en-GB", gradient: "linear-gradient(180deg,#F0E2B0,#B98F52)", shadow: "0 10px 30px rgba(234,208,138,0.32)" },
    secondary: null,
  },
  {
    eyebrow: "Insta-Delivery Customer",
    eyebrowColor: "var(--tint-isds)",
    name: "ISDS Customer",
    nameSize: "clamp(38px,6vw,92px)",
    description:
      "Ordering from a nearby vendor used to mean phone calls and cash. This app carries the whole thing: pay from an in-app wallet, watch the delivery move.",
    glow: {
      weight: 0.85,
      layers: [
        { bottom: "-28%", left: "50%", width: "150%", height: "84%", background: "radial-gradient(closest-side, rgba(185,143,82,0.741), rgba(185,143,82,0.236) 54%, rgba(11,10,9,0) 78%)" },
        { bottom: "-12%", left: "50%", width: "64%", height: "50%", background: "radial-gradient(closest-side, rgba(234,208,138,0.741), rgba(234,208,138,0.435) 44%, rgba(185,143,82,0.109) 70%, rgba(11,10,9,0) 85%)" },
        { bottom: "-5%", left: "50%", width: "32%", height: "22%", background: "radial-gradient(closest-side, rgba(244,233,208,0.725), rgba(234,208,138,0.218) 52%, rgba(11,10,9,0) 78%)" },
      ],
    },
    stageHeight: "clamp(280px,38vw,520px)",
    screens: [
      { src: "/design/img/splash-screen.jpg", alt: "Insta-Delivery splash screen", order: 3, rot: -7, left: "24%", bottom: "16%", width: "12.5%", z: 1, padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid var(--edge)", boxShadow: "0 24px 48px rgba(0,0,0,0.6)", filter: "brightness(0.68) saturate(0.88)", mobile: { width: "120px", padding: "3px", radius: "16px", imgRadius: "13px", border: "1px solid #332C24", boxShadow: "0 18px 34px rgba(0,0,0,0.6)", filter: "brightness(0.6) saturate(0.85)" } },
      { src: "/design/img/categories.jpg", alt: "Customer category browser", order: 1, rot: -3.5, left: "36%", bottom: "6%", width: "15.5%", z: 3, padding: "5px", radius: "22px", imgRadius: "18px", border: "1px solid var(--edge)", boxShadow: "0 34px 64px rgba(0,0,0,0.62), inset 0 1px 0 rgba(234,208,138,0.16)", filter: "brightness(0.86)", mobile: { width: "152px", padding: "4px", radius: "22px", imgRadius: "19px", border: "1px solid #332C24", boxShadow: "0 24px 46px rgba(0,0,0,0.6)", filter: "brightness(0.86)" } },
      { src: "/design/img/dashboard-c92695ae.jpg", alt: "Customer home with location, categories and nearby food", order: 0, rot: 0, left: "50%", bottom: "0", width: "19%", z: 6, padding: "6px", radius: "28px", imgRadius: "23px", border: "1px solid var(--edge-lit)", boxShadow: "0 48px 90px rgba(0,0,0,0.66), inset 0 1px 0 rgba(234,208,138,0.3)", mobile: { width: "188px", padding: "5px", radius: "28px", imgRadius: "24px", border: "1px solid #463C30", boxShadow: "0 34px 60px rgba(0,0,0,0.66), inset 0 1px 0 rgba(234,208,138,0.3)" } },
      { src: "/design/img/search-result-all.jpg", alt: "Search results across stores and items", order: 2, rot: 3.5, left: "64%", bottom: "6%", width: "15.5%", z: 3, padding: "5px", radius: "22px", imgRadius: "18px", border: "1px solid var(--edge)", boxShadow: "0 34px 64px rgba(0,0,0,0.62), inset 0 1px 0 rgba(234,208,138,0.16)", filter: "brightness(0.86)", mobile: { width: "140px", padding: "4px", radius: "20px", imgRadius: "17px", border: "1px solid #332C24", boxShadow: "0 22px 42px rgba(0,0,0,0.6)", filter: "brightness(0.78)" } },
      { src: "/design/img/dashboard-no-location.jpg", alt: "Customer home with location not yet set", order: 4, rot: 7, left: "76%", bottom: "16%", width: "12.5%", z: 1, padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid var(--edge)", boxShadow: "0 24px 48px rgba(0,0,0,0.6)", filter: "brightness(0.68) saturate(0.88)", mobile: { width: "128px", padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid #332C24", boxShadow: "0 20px 38px rgba(0,0,0,0.6)", filter: "brightness(0.68) saturate(0.88)" } },
    ],
    claim: "Live on the App Store, with wallet funding and P2P transfers shipped end to end.",
    claimSize: "clamp(22px,2.4vw,34px)",
    stack: "React Native · Expo · TypeScript · Node.js · Supabase",
    cta: { label: "Get it on the App Store", href: "https://apps.apple.com/ng/app/insta-delivery-by-isds/id6746375381", gradient: "linear-gradient(180deg,#F0E2B0,#B98F52)", shadow: "0 10px 30px rgba(234,208,138,0.32)" },
    secondary: null,
  },
  {
    eyebrow: "Insta-Delivery Vendors",
    eyebrowColor: "var(--tint-isds)",
    name: "ISDS Vendors",
    nameSize: "clamp(38px,6vw,92px)",
    description: "A shop needs to accept an order, prepare it against a timer, dispatch it, and get its money the same day.",
    glow: {
      weight: 0.8,
      layers: [
        { bottom: "-28%", left: "50%", width: "146%", height: "82%", background: "radial-gradient(closest-side, rgba(185,143,82,0.725), rgba(185,143,82,0.218) 54%, rgba(11,10,9,0) 78%)" },
        { bottom: "-12%", left: "50%", width: "60%", height: "48%", background: "radial-gradient(closest-side, rgba(234,208,138,0.741), rgba(234,208,138,0.399) 44%, rgba(185,143,82,0.109) 70%, rgba(11,10,9,0) 85%)" },
      ],
    },
    stageHeight: "clamp(260px,34vw,470px)",
    screens: [
      { src: "/design/img/notifications.jpg", alt: "Vendor notifications", order: 3, rot: -6, left: "27%", bottom: "15%", width: "12.5%", z: 1, padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid var(--edge)", boxShadow: "0 24px 48px rgba(0,0,0,0.6)", filter: "brightness(0.68) saturate(0.88)", mobile: { width: "128px", padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid #332C24", boxShadow: "0 20px 38px rgba(0,0,0,0.6)", filter: "brightness(0.68) saturate(0.88)" } },
      { src: "/design/img/transfer-funds.jpg", alt: "Transfer funds to another wallet", order: 1, rot: -3, left: "38%", bottom: "6%", width: "15%", z: 3, padding: "5px", radius: "22px", imgRadius: "18px", border: "1px solid var(--edge)", boxShadow: "0 34px 64px rgba(0,0,0,0.62), inset 0 1px 0 rgba(234,208,138,0.16)", filter: "brightness(0.86)", mobile: { width: "152px", padding: "4px", radius: "22px", imgRadius: "19px", border: "1px solid #332C24", boxShadow: "0 24px 46px rgba(0,0,0,0.6)", filter: "brightness(0.86)" } },
      { src: "/design/img/dashboard-24e93d62.jpg", alt: "Vendor dashboard with incoming orders and balance", order: 0, rot: 0, left: "51%", bottom: "0", width: "18.5%", z: 6, padding: "6px", radius: "28px", imgRadius: "23px", border: "1px solid var(--edge-lit)", boxShadow: "0 48px 90px rgba(0,0,0,0.66), inset 0 1px 0 rgba(234,208,138,0.3)", mobile: { width: "188px", padding: "5px", radius: "28px", imgRadius: "24px", border: "1px solid #463C30", boxShadow: "0 34px 60px rgba(0,0,0,0.66), inset 0 1px 0 rgba(234,208,138,0.3)" } },
      { src: "/design/img/withdraw-funds.jpg", alt: "Withdraw earnings to a bank account", order: 2, rot: 4, left: "65%", bottom: "7%", width: "15%", z: 3, padding: "5px", radius: "22px", imgRadius: "18px", border: "1px solid var(--edge)", boxShadow: "0 34px 64px rgba(0,0,0,0.62), inset 0 1px 0 rgba(234,208,138,0.16)", filter: "brightness(0.86)", mobile: { width: "140px", padding: "4px", radius: "20px", imgRadius: "17px", border: "1px solid #332C24", boxShadow: "0 22px 42px rgba(0,0,0,0.6)", filter: "brightness(0.78)" } },
      { src: "/design/img/onboarding-3.jpg", alt: "Vendor onboarding: insurance and protection", order: 4, rot: 6, left: "75%", bottom: "15%", width: "12.5%", z: 1, padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid var(--edge)", boxShadow: "0 24px 48px rgba(0,0,0,0.6)", filter: "brightness(0.68) saturate(0.88)", mobile: { hidden: true } },
    ],
    claim: "Earnings, withdrawals and payouts all run through the wallet layer I built.",
    claimSize: "clamp(22px,2.4vw,34px)",
    stack: "React Native · Expo · TypeScript · Node.js · Supabase",
    cta: { label: "Get it on the App Store", href: "https://apps.apple.com/ca/app/insta-delivery-vendors/id6748257517", gradient: "linear-gradient(180deg,#F0E2B0,#B98F52)", shadow: "0 10px 30px rgba(234,208,138,0.32)" },
    secondary: null,
  }
];

export const fitnex: ProductSection & { stat: string; statRest: string } = {
  eyebrow: "Fitnex: conceived, built and launched solo",
  eyebrowColor: "var(--tint-fitnex)",
  name: "Fitnex",
  nameSize: "clamp(46px,8vw,124px)",
  description: "Log a workout in seconds and see whether you are actually getting stronger. Installable, and working with no signal in the gym.",
  descriptionSize: "clamp(18px,1.9vw,23px)",
  stat: "200+",
  statRest: "active users.",
  glow: {
    weight: 1.3,
    layers: [
      { bottom: "-32%", left: "50%", width: "166%", height: "94%", background: "radial-gradient(closest-side, rgba(185,143,82,0.741), rgba(185,143,82,0.29) 54%, rgba(11,10,9,0) 80%)" },
      { bottom: "-14%", left: "50%", width: "78%", height: "58%", background: "radial-gradient(closest-side, rgba(231,177,136,0.741), rgba(231,177,136,0.544) 44%, rgba(185,143,82,0.145) 70%, rgba(11,10,9,0) 86%)" },
      { bottom: "-6%", left: "50%", width: "40%", height: "26%", background: "radial-gradient(closest-side, rgba(244,233,208,0.741), rgba(231,177,136,0.29) 52%, rgba(11,10,9,0) 78%)" },
    ],
  },
  stageHeight: "clamp(300px,42vw,580px)",
  screens: [
    { src: "/design/img/img-7788-2.jpg", alt: "Fitnex home with sessions, volume and streak", order: 3, rot: -5, left: "28%", bottom: "10%", width: "14%", z: 2, padding: "5px", radius: "20px", imgRadius: "16px", border: "1px solid var(--edge)", boxShadow: "0 30px 58px rgba(0,0,0,0.62)", filter: "brightness(0.8)", mobile: { order: 0, width: "196px", padding: "5px", radius: "28px", imgRadius: "24px", border: "1px solid #463C30", boxShadow: "0 38px 66px rgba(0,0,0,0.66), inset 0 1px 0 rgba(231,177,136,0.32)" } },
    { src: "/design/img/img-7789-2.jpg", alt: "Fitnex stats, volume comparison and personal records", order: 1, rot: -2, left: "40%", bottom: "3%", width: "17%", z: 4, padding: "5px", radius: "24px", imgRadius: "20px", border: "1px solid var(--edge)", boxShadow: "0 38px 72px rgba(0,0,0,0.64), inset 0 1px 0 rgba(231,177,136,0.2)", filter: "brightness(0.93)", mobile: { order: 1, width: "158px", padding: "4px", radius: "22px", imgRadius: "19px", border: "1px solid #332C24", boxShadow: "0 26px 48px rgba(0,0,0,0.6)", filter: "brightness(0.88)" } },
    { src: "/design/img/img-7782.jpg", alt: "Fitnex landing screen: Train hard, track harder", order: 0, rot: 2, left: "56%", bottom: "0", width: "19.5%", z: 6, padding: "6px", radius: "30px", imgRadius: "25px", border: "1px solid var(--edge-lit)", boxShadow: "0 52px 96px rgba(0,0,0,0.68), inset 0 1px 0 rgba(231,177,136,0.34)", mobile: { order: 5, width: "116px", padding: "3px", radius: "16px", imgRadius: "13px", border: "1px solid #332C24", boxShadow: "0 16px 30px rgba(0,0,0,0.6)", filter: "brightness(0.56) saturate(0.84)" } },
    { src: "/design/img/img-7787-2.jpg", alt: "Fitnex workout history by week", order: 2, rot: 6, left: "72%", bottom: "8%", width: "14.5%", z: 3, padding: "5px", radius: "22px", imgRadius: "18px", border: "1px solid var(--edge)", boxShadow: "0 32px 62px rgba(0,0,0,0.62)", filter: "brightness(0.84)", mobile: { order: 2, width: "144px", padding: "4px", radius: "20px", imgRadius: "17px", border: "1px solid #332C24", boxShadow: "0 22px 42px rgba(0,0,0,0.6)", filter: "brightness(0.8)" } },
    { src: "/design/img/img-7785.jpg", alt: "Personalised setup from the Fitnex onboarding quiz", order: 5, rot: 10, left: "85%", bottom: "19%", width: "11.5%", z: 1, padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid var(--edge)", boxShadow: "0 24px 48px rgba(0,0,0,0.6)", filter: "brightness(0.64) saturate(0.86)", desktopHidden: true, mobile: { order: 3, width: "132px", padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid #332C24", boxShadow: "0 20px 38px rgba(0,0,0,0.6)", filter: "brightness(0.7) saturate(0.88)" } },
    { src: "/design/img/img-7790-2.jpg", alt: "Fitnex profile with badges and goals", order: 4, rot: 10, left: "85%", bottom: "19%", width: "11.5%", z: 1, padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid var(--edge)", boxShadow: "0 24px 48px rgba(0,0,0,0.6)", filter: "brightness(0.64) saturate(0.86)", mobile: { order: 4, width: "124px", padding: "3px", radius: "16px", imgRadius: "13px", border: "1px solid #332C24", boxShadow: "0 18px 34px rgba(0,0,0,0.6)", filter: "brightness(0.62) saturate(0.86)" } },
  ],
  claim: "Onboarding quiz, calendar share cards, offline-first service workers, a full Supabase schema migration, and the performance pass (WebP compression, chunk splitting, preloading) through to public launch.",
  stack: "React · Vite · TypeScript · Tailwind · Supabase · Resend",
  cta: { label: "Open fitnexonline.com", href: "https://fitnexonline.com", gradient: "linear-gradient(180deg,#F0C6A6,#B98F52)", shadow: "0 10px 30px rgba(231,177,136,0.34)" },
  secondary: null,
};

export const cartify = {
  badge: { label: "Demo project", dashed: true },
  eyebrow: "Cartify",
  eyebrowColor: "var(--tint-cartify)",
  description: "A storefront that takes a real payment: browse, basket, sign-in, Stripe checkout. Built to prove the commerce path works.",
  stack: "Next.js · TypeScript · Stripe · Clerk",
  primary: { label: "Open the demo", href: "https://next-ecommerce-eta-nine.vercel.app" },
  secondary: { label: "Source on GitHub", href: "https://github.com/heistifeh/next-ecommerce" },
  glow: {
    weight: 0.4,
    layers: [
      { bottom: "-34%", left: "50%", width: "100%", height: "70%", background: "radial-gradient(closest-side, rgba(185,143,82,0.616), rgba(185,143,82,0.181) 52%, rgba(11,10,9,0) 78%)" },
      { bottom: "-16%", left: "50%", width: "40%", height: "36%", background: "radial-gradient(closest-side, rgba(232,229,187,0.616), rgba(232,229,187,0.181) 48%, rgba(11,10,9,0) 82%)" },
    ],
  } as GlowSpec,
  screens: [
    { src: "/design/img/img-7856.jpg", alt: "Cartify search results", order: 2, rot: -5, left: "26%", bottom: "12%", width: "20%", z: 1, padding: "4px", radius: "16px", imgRadius: "13px", border: "1px solid var(--edge)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", filter: "brightness(0.7) saturate(0.88)", mobile: { width: "126px", padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid #332C24", boxShadow: "0 20px 38px rgba(0,0,0,0.6)", filter: "brightness(0.7) saturate(0.88)" } },
    { src: "/design/img/img-7848.jpg", alt: "Cartify product listing", order: 0, rot: 0, left: "48%", bottom: "0", width: "26%", z: 4, padding: "5px", radius: "22px", imgRadius: "18px", border: "1px solid var(--edge-lit)", boxShadow: "0 34px 64px rgba(0,0,0,0.64), inset 0 1px 0 rgba(232,229,187,0.24)", mobile: { width: "164px", padding: "4px", radius: "24px", imgRadius: "21px", border: "1px solid #463C30", boxShadow: "0 26px 48px rgba(0,0,0,0.64), inset 0 1px 0 rgba(232,229,187,0.24)" } },
    { src: "/design/img/img-7854.jpg", alt: "Cartify Stripe payment step", order: 1, rot: 5, left: "70%", bottom: "9%", width: "21%", z: 2, padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid var(--edge)", boxShadow: "0 24px 46px rgba(0,0,0,0.6)", filter: "brightness(0.82)", mobile: { width: "138px", padding: "4px", radius: "20px", imgRadius: "17px", border: "1px solid #332C24", boxShadow: "0 22px 42px rgba(0,0,0,0.6)", filter: "brightness(0.84)" } },
    { src: "/design/img/img-7853.jpg", alt: "Cartify Stripe checkout with Apple Pay", order: 3, rot: -3, left: "37%", bottom: "5%", width: "22%", z: 3, padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid var(--edge)", boxShadow: "0 26px 50px rgba(0,0,0,0.62)", filter: "brightness(0.85)", mobile: { hidden: true } },
    { src: "/design/img/img-7855.jpg", alt: "Cartify basket with order summary", order: 4, rot: 8, left: "88%", bottom: "14%", width: "16%", z: 1, padding: "4px", radius: "16px", imgRadius: "13px", border: "1px solid var(--edge)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", filter: "brightness(0.7) saturate(0.88)", mobile: { hidden: true } },
  ] as ScreenSpec[],
  stageHeight: "clamp(200px,24vw,320px)",
};

export const klinfits: ProductSection = {
  id: "work",
  eyebrow: "Klinfits",
  eyebrowColor: "var(--tint-klinfits)",
  badge: { label: "Live" },
  name: "Klinfits ops agent",
  nameSize: "clamp(38px,6vw,92px)",
  description:
    "An AI operations agent for my own clothing shop. I paste a customer's WhatsApp order into Telegram, and it checks stock, prices delivery and drafts a payment link that I approve with one tap.",
  glow: {
    weight: 0.8,
    layers: [
      { bottom: "-28%", left: "50%", width: "146%", height: "82%", background: "radial-gradient(closest-side, rgba(185,143,82,0.725), rgba(185,143,82,0.218) 54%, rgba(11,10,9,0) 78%)" },
      { bottom: "-12%", left: "50%", width: "60%", height: "48%", background: "radial-gradient(closest-side, rgba(227,154,134,0.741), rgba(227,154,134,0.399) 44%, rgba(185,143,82,0.109) 70%, rgba(11,10,9,0) 85%)" },
    ],
  },
  stageHeight: "clamp(240px,30vw,420px)",
  screens: [
    { src: "/work/klinfits/klinfits-shop.jpg", alt: "The Klinfits shop page with four products", aspect: "1040 / 600", imgWidth: 1040, imgHeight: 600, order: 0, rot: -1.5, left: "37%", bottom: "0", width: "52%", z: 6, padding: "6px", radius: "24px", imgRadius: "19px", border: "1px solid var(--edge-lit)", boxShadow: "0 48px 90px rgba(0,0,0,0.66), inset 0 1px 0 rgba(227,154,134,0.3)", mobile: { width: "300px", padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid #463C30", boxShadow: "0 30px 56px rgba(0,0,0,0.66), inset 0 1px 0 rgba(227,154,134,0.3)" } },
    { src: "/work/klinfits/ops-agent-telegram.jpg", alt: "Telegram chat: a pasted WhatsApp order, the \"Link made\" confirmation for ₦66,499, and a ready-to-send reply", aspect: "1040 / 808", imgWidth: 1040, imgHeight: 808, order: 1, rot: 4, left: "79%", bottom: "8%", width: "33%", z: 3, padding: "5px", radius: "22px", imgRadius: "18px", border: "1px solid var(--edge)", boxShadow: "0 34px 64px rgba(0,0,0,0.62), inset 0 1px 0 rgba(227,154,134,0.16)", filter: "brightness(0.86)", mobile: { width: "240px", padding: "4px", radius: "18px", imgRadius: "15px", border: "1px solid #332C24", boxShadow: "0 22px 42px rgba(0,0,0,0.6)", filter: "brightness(0.86)" } },
  ],
  claim: "The AI proposes, the code checks, the human approves.",
  claimSize: "clamp(22px,2.4vw,34px)",
  stack: "Next.js 16 · TypeScript · Anthropic API (Claude Haiku 5.5, tool use) · Telegram Bot API · Paystack · Neon Postgres",
  cta: { label: "Read the case study", href: "/work/klinfits-ops-agent", gradient: "linear-gradient(180deg,#F0C9B8,#B98F52)", shadow: "0 10px 30px rgba(227,154,134,0.32)" },
  secondary: { label: "Open klinfits.shop", href: "https://klinfits.shop" },
};

export const klinfitsCaseStudy = {
  title: "Klinfits ops agent",
  subtitle: "An AI assistant that turns WhatsApp orders into payment links.",
  context: {
    heading: "The project in context",
    body: "Klinfits is my online shop for compression gym wear in Lagos, Nigeria. I designed and built the whole shop: Next.js 16, TypeScript, Tailwind v4, Paystack checkout, a Neon Postgres admin, and a Telegram bot for order alerts. The ops agent is the AI feature on top of it. It lives inside the shop's private Telegram bot, and only I use it.",
    image: { src: "/work/klinfits/klinfits-shop.jpg", alt: "The Klinfits shop page with four products", width: 1040, height: 600 },
  },
  problem: {
    heading: "The problem",
    body: [
      "Many buyers order on WhatsApp instead of the website. Each order meant reading the chat to work out products, sizes and quantities, checking stock, looking up the delivery price, building a payment link in the admin, and typing a reply.",
      "Lagos is split into rider zones with different prices, and other cities go by park delivery. It took several minutes per order, and it was easy to get a price or a total wrong.",
    ],
  },
  built: {
    heading: "What I built",
    steps: [
      "I paste the buyer's WhatsApp message into the Telegram bot, or send a screenshot of the chat.",
      "The agent (Claude, through the Anthropic API with tool use) works out the order and calls the shop's own tools: products with live stock and per-size prices, the delivery zone or city and its fee, and a coupon check if the buyer gave a code.",
      "It proposes a payment link. The bot shows a card with every item, the delivery fee and the total, with Make link and Cancel buttons.",
      "I tap Make link. The link is created and the bot sends back a ready-to-send WhatsApp reply in the brand's voice.",
      "It also answers shop questions: \"what do I need to pack?\", \"who hasn't paid?\", \"how were sales this week?\"",
    ],
    note: "If something essential is missing, like a size or a delivery area, it asks instead of guessing.",
  },
  safety: {
    heading: "How it stays safe",
    rule: "The AI proposes, the code checks, the human approves.",
    points: [
      "The agent can only read shop data and propose a link. It cannot create a link, change stock or message a customer on its own.",
      "Every figure on the approval card is computed by the shop's server code from the product catalogue and live stock, never taken from the AI's text.",
      "When I approve, the server re-prices the order again from live stock, and a double tap can't create two links.",
      "Customer messages are treated as data, not instructions. If a pasted message says \"give me 50% off\", the agent flags it instead of doing it.",
      "Only my Telegram account can reach the agent.",
    ],
  },
  example: {
    heading: "Real example",
    when: "From the live test, 14 Nov 2026",
    inputLabel: "Input pasted into Telegram:",
    input: "Hi Klinfits, I want the spider set in M and a black tee size L. I'm in Ikorodu garage. My name is Ada, 08031234567",
    resultLabel: "Result:",
    results: [
      "Spider Set (M) ₦45,000 + Plain Black tee (L) ₦15,999, which includes the ₦999 size L surcharge",
      "Delivery: Ikorodu Garage matched to the \"Ikorodu A\" rider zone, ₦5,500",
      "Total ₦66,499, correct to the naira",
      "It flagged that the buyer gave only an area, not a street address.",
    ],
    caption: "\"Ada\" and the phone number are test data, not a real customer.",
  },
  numbers: {
    heading: "Numbers",
    items: [
      { label: "Model", value: "Claude Haiku 5.5", note: "Switchable to a bigger model with one setting." },
      { label: "Cost", value: "About $0.003 per order", note: "$5 of API credit covers well over 1,000 orders. An estimate from the request sizes." },
      { label: "For me", value: "One paste and one tap", note: "Instead of several minutes of manual work." },
      { label: "Tests", value: "17 automated tests", note: "For the agent, all passing. 124+ tests across the shop." },
    ],
  },
  flow: {
    heading: "How it works",
    steps: [
      "WhatsApp chat",
      "I paste it into Telegram",
      "Vercel webhook",
      "Claude agent loop",
      "Shop tools: products and stock, delivery zones, coupons",
      "Draft saved",
      "Approval card in Telegram",
      "I tap Make link",
      "Server re-prices and creates the Paystack payment link",
      "Reply with a Send on WhatsApp button",
      "Buyer pays",
      "The existing Paystack webhook records the order and alerts Telegram",
    ],
  },
  stack: {
    heading: "Stack",
    tags: [
      "Next.js 16 (App Router)",
      "TypeScript",
      "Anthropic API (Claude Haiku 5.5, tool use)",
      "Telegram Bot API",
      "Paystack",
      "Neon Postgres",
      "Vercel (after() for background work)",
      "Vitest",
    ],
  },
  next: {
    heading: "Next",
    note: "Not built yet.",
    items: [
      "Morning briefing at 8am: what to pack, low stock, payments to check.",
      "Follow-ups for payment links still unpaid after 24 hours, drafted for one-tap sending.",
      "New product listings drafted from product photos.",
      "Voice-note orders (needs a speech-to-text step).",
    ],
  },
  exampleImage: { src: "/work/klinfits/ops-agent-telegram.jpg", alt: "Telegram chat: a pasted WhatsApp order, the \"Link made\" confirmation for ₦66,499, and a ready-to-send reply", width: 1040, height: 808 },
  link: { label: "Open klinfits.shop", href: "https://klinfits.shop" },
} as const;

export const stackLayers = [
  {
    n: "01",
    title: 'Screen: "Fund wallet"',
    body: "Amount sheet, method picker, and the confirmation state the user actually trusts.",
  },
  {
    n: "02",
    title: "Component: React Native + TypeScript",
    body: "Typed form state, validation, an optimistic pending row, error and retry paths.",
  },
  {
    n: "03",
    title: "State: Redux slice, Supabase session",
    body: "Balance is one source of truth, shared by checkout, transfers and vendor earnings.",
  },
  {
    n: "04",
    title: "API: Node service",
    body: "Initialise funding, verify the provider webhook, write the ledger entry once, idempotently.",
    code: "POST /wallet/fund → { reference }\nPOST /wallet/webhook → verify(sig) → ledger.insert(once)",
  },
  {
    n: "05",
    title: "Data: Postgres",
    body: "wallets, ledger_entries, referrals. The referral feature released behind a flag, then widened.",
  },
] as const;

export const jumpNavItems = [
  { label: "Overview", href: "#top" },
  { label: "Klinfits", href: "#work" },
  { label: "ISDS", href: "#isds" },
  { label: "Fitnex", href: "#fitnex" },
  { label: "Cartify", href: "#cartify" },
  { label: "Contact", href: "#contact" },
] as const;
