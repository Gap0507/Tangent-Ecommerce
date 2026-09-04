export interface ProductDetails {
  id: string;
  name: string;
  subtitle: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  description: string;
  valueProps: string[];
  packPrices: {
    size: string;
    cans: number;
    price: number;
    originalPrice?: number;
    savings?: string;
  }[];
  images: {
    main: string;
    gallery: string[];
  };
  features: {
    icon: 'leaf' | 'box' | 'droplet';
    title: string;
    description: string;
  }[];
  whyLoveIt: {
    text: string;
    points: string[];
    image: string;
  };
  ingredients: {
    name: string;
    emoji: string;
  }[];
  reviews: {
    id: string;
    name: string;
    rating: number;
    text: string;
    date: string;
    verified: boolean;
  }[];
}

export function calculatePackPrices(basePrice: number) {
  return [
    { size: "Pack of 4", cans: 4, price: basePrice * 4 },
    { size: "Pack of 8", cans: 8, price: basePrice * 8 },
    { size: "Pack of 12", cans: 12, price: basePrice * 12 },
    { size: "Pack of 24", cans: 24, price: basePrice * 24 },
  ];
}

export const PRODUCTS_CATALOG_DETAILED: Record<string, ProductDetails> = {
  "watermelon-mint": {
    id: "watermelon-mint",
    name: "Watermelon Mint",
    subtitle: "Refreshing Hydration Drink",
    rating: 4.8,
    reviewsCount: 128,
    badge: "Best Seller",
    description: "A juicy blend of watermelon and cool mint that keeps you hydrated and refreshed all day long.",
    valueProps: [
      "Real fruit extracts",
      "No artificial flavors or colors",
      "Low in calories",
      "No added preservatives"
    ],
    packPrices: calculatePackPrices(149),
    images: {
      main: "/can2.png",
      gallery: [
        "/can2blogcard.png",
        "/flavourcard2.png",
        "/mobilecan2.png"
      ]
    },
    features: [
      {
        icon: "leaf",
        title: "Real Ingredients",
        description: "Made with real fruits & botanicals."
      },
      {
        icon: "box",
        title: "No Shortcuts",
        description: "No artificial flavors, colors or sweeteners."
      },
      {
        icon: "droplet",
        title: "Low Calories",
        description: "Light on calories, big on refreshment."
      }
    ],
    whyLoveIt: {
      text: "Watermelon Mint is your go-to drink for instant refreshment. It's light, hydrating, and made with real ingredients that nourish your body and delight your senses.",
      points: [
        "Made with watermelon juice & natural mint extract",
        "Contains essential vitamins like A, C & antioxidants",
        "Helps keep you hydrated and energized",
        "Perfect for workouts, weekdays, or weekend chill"
      ],
      image: "/blogdetails/can1watermelonmint/img3.png"
    },
    ingredients: [
      { name: "Watermelon Juice", emoji: "🍉" },
      { name: "Mint Extract", emoji: "🌿" },
      { name: "Lemon Juice", emoji: "🍋" },
      { name: "Cane Sugar", emoji: "🎋" },
      { name: "Pink Salt", emoji: "🧂" },
      { name: "Citric Acid", emoji: "🍋‍🟩" },
      { name: "Natural Flavors", emoji: "🍃" },
      { name: "Filtered Water", emoji: "💧" }
    ],
    reviews: [
      {
        id: "r1",
        name: "Ananya Sharma",
        rating: 5,
        text: "The perfect balance of juicy watermelon and cool mint! Keeps me refreshed throughout the day.",
        date: "May 18, 2024",
        verified: true
      },
      {
        id: "r2",
        name: "Rohit Verma",
        rating: 5,
        text: "My favorite drink after workouts. Not too sweet and super hydrating. Definitely recommend!",
        date: "May 12, 2024",
        verified: true
      },
      {
        id: "r3",
        name: "Priya Mehta",
        rating: 5,
        text: "Love that it's made with real ingredients. Tastes amazing and no guilt! A must-try.",
        date: "May 10, 2024",
        verified: true
      }
    ]
  },
  "watermelon-cranberry": {
    id: "watermelon-cranberry",
    name: "Watermelon Cranberry",
    subtitle: "Sweet & Tart Hydration",
    rating: 4.9,
    reviewsCount: 94,
    badge: "Fan Favorite",
    description: "A perfect harmony of sweet watermelon and tart cranberry to keep your tastebuds dancing and body hydrated.",
    valueProps: [
      "Real fruit extracts",
      "No artificial flavors or colors",
      "Low in calories",
      "No added preservatives"
    ],
    packPrices: calculatePackPrices(149),
    images: {
      main: "/can1.png",
      gallery: [
        "/can1blogcard.png",
        "/flavourcard1.png",
        "/mobilecan1.png"
      ]
    },
    features: [
      { icon: "leaf", title: "Real Ingredients", description: "Made with real fruits & botanicals." },
      { icon: "box", title: "No Shortcuts", description: "No artificial flavors, colors or sweeteners." },
      { icon: "droplet", title: "Low Calories", description: "Light on calories, big on refreshment." }
    ],
    whyLoveIt: {
      text: "Watermelon Cranberry is the ultimate thirst quencher. The subtle tartness of cranberry perfectly balances the sweet watermelon, creating an irresistible daily refresher.",
      points: [
        "Made with watermelon & cranberry juice",
        "Packed with Vitamin C and antioxidants",
        "Helps keep you hydrated and energized",
        "Perfect for workouts, weekdays, or weekend chill"
      ],
      image: "/blogdetails/can2watermeloncranberry/img3.png"
    },
    ingredients: [
      { name: "Watermelon Juice", emoji: "🍉" },
      { name: "Cranberry Extract", emoji: "🍒" },
      { name: "Lemon Juice", emoji: "🍋" },
      { name: "Cane Sugar", emoji: "🎋" },
      { name: "Pink Salt", emoji: "🧂" },
      { name: "Citric Acid", emoji: "🍋‍🟩" },
      { name: "Natural Flavors", emoji: "🍃" },
      { name: "Filtered Water", emoji: "💧" }
    ],
    reviews: [
      { id: "rc1", name: "Sarah L.", rating: 5, text: "The tartness is just perfect. Not too sweet!", date: "Jun 02, 2024", verified: true },
      { id: "rc2", name: "Mike T.", rating: 5, text: "My new favorite flavor. Super refreshing.", date: "May 25, 2024", verified: true },
      { id: "rc3", name: "Emily R.", rating: 4, text: "Great taste, definitely buying the 24 pack next.", date: "May 15, 2024", verified: true }
    ]
  },
  "yuzu-mint": {
    id: "yuzu-mint",
    name: "Yuzu Mint",
    subtitle: "Zesty & Cool Refreshment",
    rating: 4.7,
    reviewsCount: 82,
    badge: "New Arrival",
    description: "Experience the vibrant zest of Asian yuzu citrus blended with cool, soothing mint for an unforgettable crisp finish.",
    valueProps: [
      "Real fruit extracts",
      "No artificial flavors or colors",
      "Low in calories",
      "No added preservatives"
    ],
    packPrices: calculatePackPrices(149),
    images: {
      main: "/can4.png",
      gallery: [
        "/can4blog.png",
        "/flavourcard4.png",
        "/mobilecan4.png"
      ]
    },
    features: [
      { icon: "leaf", title: "Real Ingredients", description: "Made with real fruits & botanicals." },
      { icon: "box", title: "No Shortcuts", description: "No artificial flavors, colors or sweeteners." },
      { icon: "droplet", title: "Low Calories", description: "Light on calories, big on refreshment." }
    ],
    whyLoveIt: {
      text: "Yuzu Mint brings a unique citrusy brightness. It's an invigorating lift for your afternoons, crafted carefully for a complex but highly drinkable flavor profile.",
      points: [
        "Made with real yuzu extract and mint",
        "High in natural Vitamin C",
        "Crisp, clean, and never too sweet",
        "Perfect as a mixer or on its own"
      ],
      image: "/blogdetails/can3yulu/img3.png"
    },
    ingredients: [
      { name: "Yuzu Juice", emoji: "🍋" },
      { name: "Mint Extract", emoji: "🌿" },
      { name: "Lemon Juice", emoji: "🍋‍🟩" },
      { name: "Cane Sugar", emoji: "🎋" },
      { name: "Pink Salt", emoji: "🧂" },
      { name: "Citric Acid", emoji: "🍋‍🟩" },
      { name: "Natural Flavors", emoji: "🍃" },
      { name: "Filtered Water", emoji: "💧" }
    ],
    reviews: [
      { id: "ry1", name: "David K.", rating: 5, text: "The yuzu flavor is incredibly authentic. Love it.", date: "Jun 10, 2024", verified: true },
      { id: "ry2", name: "Lisa W.", rating: 5, text: "Very unique and refreshing. A great alternative to normal lemonades.", date: "Jun 01, 2024", verified: true },
      { id: "ry3", name: "James M.", rating: 4, text: "Crisp and minty. Perfect for summer days.", date: "May 20, 2024", verified: true }
    ]
  },
  "guava-chilli": {
    id: "guava-chilli",
    name: "Guava Chilli",
    subtitle: "Sweet with a Kick",
    rating: 4.9,
    reviewsCount: 156,
    badge: "Award Winning",
    description: "Tropical sweet guava meets a subtle, tingling chilli kick. A bold, adventurous hydration experience.",
    valueProps: [
      "Real fruit extracts",
      "No artificial flavors or colors",
      "Low in calories",
      "No added preservatives"
    ],
    packPrices: calculatePackPrices(149),
    images: {
      main: "/can3.png",
      gallery: [
        "/can3blogcard.png",
        "/flavourcard3.png",
        "/mobilecan3.png"
      ]
    },
    features: [
      { icon: "leaf", title: "Real Ingredients", description: "Made with real fruits & botanicals." },
      { icon: "box", title: "No Shortcuts", description: "No artificial flavors, colors or sweeteners." },
      { icon: "droplet", title: "Low Calories", description: "Light on calories, big on refreshment." }
    ],
    whyLoveIt: {
      text: "Guava Chilli is not your average drink. The sweet, tropical aroma of guava is perfectly complemented by a warm, lingering spice that makes every sip exciting.",
      points: [
        "Made with pink guava and real chilli extract",
        "A perfectly balanced sweet and spicy profile",
        "Awakens your senses and hydrates your body",
        "The ultimate companion for food pairings"
      ],
      image: "/blogdetails/can4guavachilli/img3.png"
    },
    ingredients: [
      { name: "Pink Guava", emoji: "🍈" },
      { name: "Chilli Extract", emoji: "🌶️" },
      { name: "Lime Juice", emoji: "🍋‍🟩" },
      { name: "Cane Sugar", emoji: "🎋" },
      { name: "Pink Salt", emoji: "🧂" },
      { name: "Citric Acid", emoji: "🍋‍🟩" },
      { name: "Natural Flavors", emoji: "🍃" },
      { name: "Filtered Water", emoji: "💧" }
    ],
    reviews: [
      { id: "rg1", name: "Carlos T.", rating: 5, text: "The spice level is perfect! Just enough kick without being overwhelming.", date: "Jun 12, 2024", verified: true },
      { id: "rg2", name: "Anita B.", rating: 5, text: "Obsessed with this flavor. It goes so well with spicy food.", date: "Jun 05, 2024", verified: true },
      { id: "rg3", name: "Tom H.", rating: 5, text: "Nothing else like it on the market. Guava shines through beautifully.", date: "May 28, 2024", verified: true }
    ]
  }
};
