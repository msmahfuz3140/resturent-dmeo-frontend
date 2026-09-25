// ============================================================
// Feastora — Complete Static Demo Data (No Backend Required)
// ============================================================

import { Restaurant, MenuItem, Category, Deal, Review, Order } from "./api";

// ─── Categories ──────────────────────────────────────────────
export const mockCategories: Category[] = [
  { _id: "cat1", name: "Biryani & Kacchi", slug: "biryani-kacchi", icon: "🍛", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80", description: "Royal saffron basmati rice with slow-cooked tender meat", displayOrder: 1 },
  { _id: "cat2", name: "Burgers & Sliders", slug: "burgers-sliders", icon: "🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80", description: "Juicy handcrafted smash patties on toasted brioche", displayOrder: 2 },
  { _id: "cat3", name: "Woodfired Pizza", slug: "woodfired-pizza", icon: "🍕", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80", description: "Crisp crust, San Marzano sauce & molten buffalo mozzarella", displayOrder: 3 },
  { _id: "cat4", name: "Sushi & Ramen", slug: "sushi-ramen", icon: "🍣", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=80", description: "Delicate nigiri, sushi rolls and 18-hour simmered broths", displayOrder: 4 },
  { _id: "cat5", name: "Artisan Steaks & BBQ", slug: "artisan-steaks-bbq", icon: "🥩", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80", description: "Hickory wood smoked meats and prime cuts seared to perfection", displayOrder: 5 },
  { _id: "cat6", name: "Bengali Heritage", slug: "bengali-heritage", icon: "🍲", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80", description: "Authentic mustard hilsa, bhuna duck and aromatic rice combos", displayOrder: 6 },
  { _id: "cat7", name: "Healthy Bowls", slug: "healthy-bowls", icon: "🥗", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80", description: "Fresh superfood bowls, crisp greens and protein medleys", displayOrder: 7 },
  { _id: "cat8", name: "Desserts & Cakes", slug: "desserts-cakes", icon: "🍰", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80", description: "Velvet cheesecakes, artisanal pastries and rich chocolate truffles", displayOrder: 8 },
  { _id: "cat9", name: "Specialty Beverages", slug: "specialty-beverages", icon: "🧋", image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&auto=format&fit=crop&q=80", description: "Cold-pressed juices, matcha brews and artisanal milkshakes", displayOrder: 9 },
];

// ─── Deals / Vouchers ────────────────────────────────────────
export const mockDeals: Deal[] = [
  { _id: "deal1", code: "FEAST20", title: "20% OFF Gourmet Orders", description: "Save up to 200 BDT on dining orders over 450 BDT", discountPercent: 20, flatDiscount: 0, maxDiscount: 200, minSpend: 450, badgeText: "HOT DEAL", icon: "🔥" },
  { _id: "deal2", code: "FREEDEL", title: "Free Express Delivery", description: "Enjoy zero delivery fees on orders above 300 BDT", discountPercent: 0, flatDiscount: 49, maxDiscount: 49, minSpend: 300, badgeText: "POPULAR", icon: "🛵" },
  { _id: "deal3", code: "WELCOME100", title: "Flat 100 BDT Welcome Treat", description: "Instant 100 BDT deduction on your feast over 600 BDT", discountPercent: 0, flatDiscount: 100, maxDiscount: 100, minSpend: 600, badgeText: "NEW DINER", icon: "🎁" },
  { _id: "deal4", code: "NIGHTCRAVE", title: "Late Night 15% Bonus", description: "Midnight cravings sorted! 15% discount after 9:00 PM", discountPercent: 15, flatDiscount: 0, maxDiscount: 180, minSpend: 400, badgeText: "MIDNIGHT", icon: "🌙" },
  { _id: "deal5", code: "BIRYANI50", title: "Flat 50 BDT on Royal Kacchi", description: "Instant 50 BDT off on all Shahi Biryani orders", discountPercent: 0, flatDiscount: 50, maxDiscount: 50, minSpend: 350, badgeText: "ROYAL", icon: "🍛" },
  { _id: "deal6", code: "WEEKENDVIP", title: "25% OFF Weekend Feasts", description: "Special weekend dining privilege for families and parties", discountPercent: 25, flatDiscount: 0, maxDiscount: 300, minSpend: 800, badgeText: "VIP WEEKEND", icon: "👑" },
];

// ─── Restaurants ─────────────────────────────────────────────
export const mockRestaurants: Restaurant[] = [
  {
    _id: "r1", name: "Sultan's Heritage Kacchi", slug: "sultans-heritage-kacchi",
    tagline: "Authentic Old Dhaka Shahi Mutton Kacchi with saffron aroma",
    description: "Steeped in royal Mughal traditions, Sultan's Heritage uses prime local mutton slow-cooked with aged chinigura basmati, pure ghee, and secret family spices.",
    logo: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9, ratingCount: 3840, deliveryTime: "25-35 min", deliveryFee: 49, minOrder: 250, priceTier: "$$",
    cuisines: ["Biryani & Kacchi", "Bengali Heritage", "Mughlai"],
    area: "Gulshan 2, Dhaka", address: "House 14, Road 45, Gulshan 2, Dhaka 1212",
    openingHours: "11:00 AM - 11:30 PM", isOpen: true, isFeatured: true, isPromoted: true,
    discountText: "20% OFF with FEAST20", tags: ["Halal Certified", "Bestseller", "Royal Mughal"],
    menuCategories: ["Signature Kacchi", "Heritage Combos", "Side Delights", "Traditional Sweets", "Beverages"],
  },
  {
    _id: "r2", name: "The Charcoal Artisan Grill", slug: "charcoal-artisan-grill",
    tagline: "Gourmet smash burgers, oak-smoked brisket & loaded fries",
    description: "Dhaka's leading American smokehouse experience. We grind brisket and chuck daily for burgers and slow-smoke meats over hickory logs for 14 hours.",
    logo: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
    rating: 4.8, ratingCount: 2120, deliveryTime: "20-30 min", deliveryFee: 39, minOrder: 200, priceTier: "$$",
    cuisines: ["Burgers & Sliders", "Artisan Steaks & BBQ", "Fast Gourmet"],
    area: "Banani, Dhaka", address: "Road 11, Block D, Banani, Dhaka",
    openingHours: "12:00 PM - 12:00 AM", isOpen: true, isFeatured: true,
    discountText: "Flat 50 BDT OFF above 400", tags: ["Crispy", "Artisanal Buns", "Top Rated"],
    menuCategories: ["Smash Burgers", "Smokehouse Platters", "Loaded Sides", "Craft Shakes"],
  },
  {
    _id: "r3", name: "Bella Firenze Trattoria", slug: "bella-firenze-trattoria",
    tagline: "48-hour fermented sourdough pizzas & handmade pasta",
    description: "Direct Italian culinary mastery. Hand-stretched sourdough crusts baked in a 450°C wood stone oven, topped with imported Fior di Latte and fresh basil.",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80",
    rating: 4.7, ratingCount: 1450, deliveryTime: "30-40 min", deliveryFee: 50, minOrder: 300, priceTier: "$$$",
    cuisines: ["Woodfired Pizza", "Handmade Pasta", "Italian Dolce"],
    area: "Gulshan 1, Dhaka", address: "Avenue 3, Gulshan 1, Dhaka",
    openingHours: "12:30 PM - 11:00 PM", isOpen: true, isFeatured: true,
    discountText: "Free Delivery with FREEDEL", tags: ["Woodfired", "Italian Chef", "Artisanal"],
    menuCategories: ["Artisanal Pizzas", "Handmade Pastas", "Antipasti", "Italian Dolce"],
  },
  {
    _id: "r4", name: "Tokyo Drift Sushi & Ramen Bar", slug: "tokyo-drift-sushi-ramen",
    tagline: "Authentic Hakata Tonkotsu broth & fresh sashimi rolls",
    description: "Artisanal Japanese dining bringing the vibrant flavors of Shibuya and Ginza. From delicate sushi platters to simmered noodle broths.",
    logo: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9, ratingCount: 1890, deliveryTime: "30-40 min", deliveryFee: 50, minOrder: 400, priceTier: "$$$",
    cuisines: ["Sushi & Ramen", "Japanese", "Asian Fusion"],
    area: "Dhanmondi, Dhaka", address: "Road 27 Old, Dhanmondi, Dhaka",
    openingHours: "1:00 PM - 10:30 PM", isOpen: true, isFeatured: true,
    discountText: "15% OFF for Night Orders", tags: ["Fresh Sashimi", "Authentic Broth", "Chef Selection"],
    menuCategories: ["Simmered Ramen", "Signature Sushi Rolls", "Crispy Appetizers", "Japanese Teas"],
  },
  {
    _id: "r5", name: "Green Haven Organics", slug: "green-haven-organics",
    tagline: "Vibrant nourish bowls, cold-pressed elixirs & clean eats",
    description: "Nourish your body with nutrient-dense grain bowls, vibrant salads, and refreshing smoothies made from locally sourced organic farms.",
    logo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&auto=format&fit=crop&q=80",
    rating: 4.8, ratingCount: 920, deliveryTime: "15-25 min", deliveryFee: 35, minOrder: 200, priceTier: "$$",
    cuisines: ["Healthy Bowls", "Salads", "Smoothies"],
    area: "Gulshan 2, Dhaka", address: "Navana Tower, Gulshan 2, Dhaka",
    openingHours: "8:00 AM - 10:00 PM", isOpen: true, isFeatured: false,
    tags: ["Organic", "Gluten Free Options", "Healthy"],
    menuCategories: ["Nourish Bowls", "Cold Pressed Drinks", "High Protein Wraps"],
  },
  {
    _id: "r6", name: "Velvet Crust Artisanal Patisserie", slug: "velvet-crust-patisserie",
    tagline: "French viennoiserie, decadent cakes & artisan chocolates",
    description: "World-class French bakery crafted daily at 5 AM. Flaky laminated croissants, silky cheesecakes, and gourmet tarts.",
    logo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9, ratingCount: 2200, deliveryTime: "20-30 min", deliveryFee: 40, minOrder: 250, priceTier: "$$",
    cuisines: ["Desserts & Cakes", "Bakery", "Specialty Beverages"],
    area: "Uttara, Dhaka", address: "Sector 4, Jashimuddin Avenue, Uttara, Dhaka",
    openingHours: "8:30 AM - 11:00 PM", isOpen: true, isFeatured: false,
    tags: ["Fresh Bakes", "French Butter", "Dessert Bar"],
    menuCategories: ["Cakes & Slices", "Artisan Croissants", "Chocolates"],
  },
  {
    _id: "r7", name: "Mezban Bari Chittagong", slug: "mezban-bari-chittagong",
    tagline: "Authentic Chittagong Kala Bhuna, Akhni Polao & Chonashak",
    description: "Direct heritage from the port city of Chittagong. Rich slow-charred Beef Kala Bhuna simmered with black radhuni spices, marrow broth, and mustard greens.",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9, ratingCount: 3150, deliveryTime: "25-35 min", deliveryFee: 45, minOrder: 300, priceTier: "$$",
    cuisines: ["Bengali Heritage", "Biryani & Kacchi", "Desi"],
    area: "Dhanmondi, Dhaka", address: "Road 15, Satmasjid Road, Dhanmondi, Dhaka",
    openingHours: "11:30 AM - 11:00 PM", isOpen: true, isFeatured: true,
    discountText: "Flat 50 BDT OFF on Mezbani", tags: ["Authentic Chittagong", "Kala Bhuna Special", "Halal"],
    menuCategories: ["Mezbani Beef", "Heritage Rice", "Traditional Sides"],
  },
  {
    _id: "r8", name: "Zaatar & Olive Mediterranean", slug: "zaatar-olive-mediterranean",
    tagline: "Levantine charcoal kebabs, silky hummus & warm zaatar pita",
    description: "Authentic Eastern Mediterranean cuisine featuring spiced Turkish lamb shish, slow-roasted chicken shawarma platters, and mezze dips.",
    logo: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1200&auto=format&fit=crop&q=80",
    rating: 4.8, ratingCount: 1640, deliveryTime: "25-35 min", deliveryFee: 45, minOrder: 350, priceTier: "$$$",
    cuisines: ["Artisan Steaks & BBQ", "Healthy Bowls", "Middle Eastern"],
    area: "Banani, Dhaka", address: "Road 10, Block C, Banani, Dhaka",
    openingHours: "12:00 PM - 11:30 PM", isOpen: true, isFeatured: true,
    discountText: "20% OFF with FEAST20", tags: ["Charcoal Grill", "Pita Bakes", "Halal"],
    menuCategories: ["Charcoal Kebabs", "Mezze Platters", "Fresh Bakes"],
  },
  {
    _id: "r9", name: "El Fuego Mexican Taqueria", slug: "el-fuego-mexican-taqueria",
    tagline: "Slow-braised beef birria tacos, loaded nachos & churros",
    description: "Dhaka's premier Mexican taqueria. Crispy corn tortillas dipped in chili broth, filled with melted Oaxaca cheese and shredded beef brisket.",
    logo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&auto=format&fit=crop&q=80",
    rating: 4.8, ratingCount: 1120, deliveryTime: "20-30 min", deliveryFee: 40, minOrder: 250, priceTier: "$$",
    cuisines: ["Burgers & Sliders", "Fast Gourmet", "Mexican"],
    area: "Gulshan 2, Dhaka", address: "Road 55, Gulshan 2, Dhaka",
    openingHours: "1:00 PM - 12:00 AM", isOpen: true, isFeatured: false,
    tags: ["Authentic Tacos", "Street Food", "Cheesy"],
    menuCategories: ["Birria Tacos", "Loaded Nachos", "Desserts"],
  },
  {
    _id: "r10", name: "Cafe Botanica Artisan Roastery", slug: "cafe-botanica-roastery",
    tagline: "Specialty pour-overs, Spanish lattes, brioche brunch & bowls",
    description: "Artisanal micro-roastery and botanical café in Bashundhara. Single-origin Arabica beans roasted on site, pairing with freshly baked sourdough toast and gourmet brunch.",
    logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9, ratingCount: 980, deliveryTime: "15-25 min", deliveryFee: 30, minOrder: 180, priceTier: "$$",
    cuisines: ["Specialty Beverages", "Healthy Bowls", "Desserts & Cakes"],
    area: "Bashundhara R/A, Dhaka", address: "Block C, Main Road, Bashundhara R/A, Dhaka",
    openingHours: "7:30 AM - 11:00 PM", isOpen: true, isFeatured: false,
    tags: ["Specialty Coffee", "Brunch Spot", "Fresh Bakes"],
    menuCategories: ["Specialty Coffee", "All Day Brunch", "Artisan Sweets"],
  },
];

// ─── Menu Items ──────────────────────────────────────────────
export const mockMenuItems: MenuItem[] = [
  // R1 — Sultan's Heritage Kacchi
  { _id: "m1", restaurantId: "r1", name: "Shahi Mutton Kacchi Biryani (Full)", description: "Aged aromatic chinigura rice with 2 tender mutton shanks, roasted baby potato, and boiled egg infused with pure ghee and saffron.", price: 480, discountPrice: 430, category: "Signature Kacchi", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isPopular: true, isChefSpecial: true, dietaryTags: ["Halal", "Chef Signature"], options: [{ name: "Add On", type: "checkbox", choices: [{ label: "Extra Shahi Potato", extraPrice: 35 }, { label: "Extra Mutton Shank", extraPrice: 190 }, { label: "Shahi Borhani Glass", extraPrice: 65 }] }] },
  { _id: "m2", restaurantId: "r1", name: "Morog Polao with Roasted Chicken Leg", description: "Classic golden chicken leg roast smothered in thick onion-raisin gravy, accompanied by aromatic shahi polao.", price: 360, discountPrice: 320, category: "Heritage Combos", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Halal"] },
  { _id: "m3", restaurantId: "r1", name: "Royal Beef Tehari in Mustard Oil", description: "Authentic Old Dhaka tehari cooked with bite-sized prime beef chunks in fragrant pure cold-pressed mustard oil with green chillies.", price: 380, category: "Signature Kacchi", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Halal", "Spicy"] },
  { _id: "m4", restaurantId: "r1", name: "Traditional Spicy Borhani (500ml)", description: "Thick spiced yogurt drink blended with fresh mint, coriander, toasted cumin and black salt.", price: 110, category: "Beverages", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Vegetarian", "Probiotic"] },
  { _id: "m5", restaurantId: "r1", name: "Shahi Zafrani Firni Matka", description: "Slow-reduced creamy rice pudding garnished with saffron strands, pistachios and sliced almonds.", price: 120, category: "Traditional Sweets", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Vegetarian"] },

  // R2 — The Charcoal Artisan Grill
  { _id: "m6", restaurantId: "r2", name: "Double Truffle & Smoked Cheddar Smash", description: "Two 120g seared beef patties, melted aged cheddar, caramelized shallots, crispy beef bacon, and black truffle aioli on buttered brioche.", price: 520, discountPrice: 470, category: "Smash Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80", isPopular: true, isChefSpecial: true, dietaryTags: ["100% Beef", "Halal"], options: [{ name: "Patty Preference", choices: [{ label: "Medium Juicy", extraPrice: 0 }, { label: "Well Done Crispy Crust", extraPrice: 0 }] }, { name: "Extras", type: "checkbox", choices: [{ label: "Extra Cheddar Slice", extraPrice: 40 }, { label: "Crispy Jalapenos", extraPrice: 30 }, { label: "Fried Egg", extraPrice: 35 }] }] },
  { _id: "m7", restaurantId: "r2", name: "Nashville Hot Honey Crispy Chicken", description: "Brined chicken thigh fried extra crunchy, dipped in cayenne glaze, drizzled with hot honey, creamy slaw and dill pickles.", price: 430, category: "Smash Burgers", image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Halal", "Spicy"] },
  { _id: "m8", restaurantId: "r2", name: "Smoked Pulled Beef Loaded Fries", description: "Crispy skin-on potato fries topped with 12-hour smoked beef, molten cheese sauce, ranch, and spring onions.", price: 340, category: "Loaded Sides", image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Halal"] },
  { _id: "m9", restaurantId: "r2", name: "Nutella Salted Caramel Shake", description: "Decadent hand-spun vanilla ice cream shake blended with roasted Nutella, Maldon sea salt, and whipped cream.", price: 260, category: "Craft Shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Vegetarian"] },

  // R3 — Bella Firenze Trattoria
  { _id: "m10", restaurantId: "r3", name: "Pizza Margherita DOP (12 inch)", description: "San Marzano tomato sauce, fresh buffalo mozzarella, aromatic sweet basil, cold-pressed extra virgin olive oil.", price: 680, category: "Artisanal Pizzas", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Vegetarian", "Sourdough"] },
  { _id: "m11", restaurantId: "r3", name: "Quattro Formaggi & Hot Honey Pizza", description: "Four cheese harmony: Mozzarella, Gorgonzola, smoked Scamorza, and shaved Parmigiano finished with chili-infused honey.", price: 840, discountPrice: 760, category: "Artisanal Pizzas", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80", isChefSpecial: true, dietaryTags: ["Vegetarian"] },
  { _id: "m12", restaurantId: "r3", name: "Diavola Piccante Beef Pepperoni", description: "Fiery spicy beef pepperoni, crushed San Marzano tomatoes, fresh mozzarella, and hot Calabrian chili flakes.", price: 790, category: "Artisanal Pizzas", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Halal", "Spicy"] },
  { _id: "m13", restaurantId: "r3", name: "Truffle Mushroom Fettuccine", description: "Fresh egg pasta ribbons tossed in a velvety Parmigiano Reggiano reduction with wild porcini mushrooms and black truffle butter.", price: 620, category: "Handmade Pastas", image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281729?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Vegetarian"] },
  { _id: "m14", restaurantId: "r3", name: "Classic Espresso Tiramisu", description: "Savoiardi ladyfingers soaked in dark roast espresso, layered with whipped mascarpone cream and dusted with Valrhona cocoa.", price: 340, category: "Italian Dolce", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Vegetarian"] },

  // R4 — Tokyo Drift Sushi & Ramen
  { _id: "m15", restaurantId: "r4", name: "Black Garlic Tori Paitan Ramen", description: "Rich 12-hour chicken collagen broth, springy wheat noodles, slow-braised chashu chicken, soft ajitsuke tamago egg, nori and black garlic oil.", price: 620, discountPrice: 560, category: "Simmered Ramen", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80", isPopular: true, isChefSpecial: true, dietaryTags: ["Halal"] },
  { _id: "m16", restaurantId: "r4", name: "Dragon Dynamite Salmon Roll (8 Pcs)", description: "Tempura prawn and avocado wrapped inside, draped with torched fresh Norwegian salmon, spicy sriracha mayo, unagi sauce and tobiko.", price: 790, category: "Signature Sushi Rolls", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Seafood", "Halal"] },
  { _id: "m17", restaurantId: "r4", name: "Crispy Chicken Gyoza (6 Pcs)", description: "Pan-fried Japanese dumplings stuffed with minced spiced chicken, scallions, cabbage, served with tangy ginger soy dipping sauce.", price: 320, category: "Crispy Appetizers", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Halal"] },
  { _id: "m18", restaurantId: "r4", name: "Spicy Miso Beef Chashu Ramen", description: "Red miso blended rich broth with ground seasoned beef, bamboo shoots, wood-ear mushroom, and chili oil drizzle.", price: 650, category: "Simmered Ramen", image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Halal", "Spicy"] },

  // R5 — Green Haven Organics
  { _id: "m19", restaurantId: "r5", name: "Citrus Grilled Salmon Quinoa Bowl", description: "Pan-seared salmon fillet over fluffy organic tri-color quinoa, hass avocado, edamame, baby spinach, citrus ponzu vinaigrette.", price: 690, category: "Nourish Bowls", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80", isChefSpecial: true, dietaryTags: ["Gluten-Free", "High Protein"] },
  { _id: "m20", restaurantId: "r5", name: "Avocado Chicken & Tahini Wrap", description: "Herb-marinated grilled chicken breast, crushed avocado, crisp romaine, pickled onions, and garlic lemon tahini wrapped in spinach tortilla.", price: 390, category: "High Protein Wraps", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80", dietaryTags: ["High Protein", "Halal"] },
  { _id: "m21", restaurantId: "r5", name: "Cold-Pressed Green Immunity Elixir (350ml)", description: "Kale, green apple, cucumber, celery, ginger and fresh lemon juice. 100% raw and unpasteurized.", price: 210, category: "Cold Pressed Drinks", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Organic", "Vegan"] },

  // R6 — Velvet Crust Patisserie
  { _id: "m22", restaurantId: "r6", name: "Basque Burnt Cheesecake Slice", description: "Caramelized deeply scorched top with an ultra-creamy, molten vanilla bean custard center. Baked using French cream cheese.", price: 360, category: "Cakes & Slices", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Vegetarian"] },
  { _id: "m23", restaurantId: "r6", name: "Triple Chocolate Almond Pain au Chocolat", description: "Twice-baked butter croissant pastry loaded with dark Belgian chocolate batons and crowned with toasted almond frangipane.", price: 280, category: "Artisan Croissants", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Vegetarian"] },
  { _id: "m24", restaurantId: "r6", name: "Sicilian Pistachio Eclair", description: "Choux pastry filled with roasted Bronte pistachio cream and topped with white chocolate pistachio ganache.", price: 310, category: "Cakes & Slices", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Vegetarian"] },

  // R7 — Mezban Bari Chittagong
  { _id: "m25", restaurantId: "r7", name: "Authentic Chittagong Beef Kala Bhuna", description: "Tender beef cubes slow-braised for 6 hours until dark mahogany, infused with crushed radhuni, fried onions and mustard oil.", price: 490, discountPrice: 440, category: "Mezbani Beef", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80", isPopular: true, isChefSpecial: true, dietaryTags: ["Halal", "Spicy"] },
  { _id: "m26", restaurantId: "r7", name: "Mezbani Goshth with Aromatic Akhni Polao", description: "Spiced beef in rich, peppery gravy served alongside fragrant basmati akhni rice and Chonashak.", price: 460, category: "Heritage Rice", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Halal"] },
  { _id: "m27", restaurantId: "r7", name: "Noli Nalli Nihari Bone Marrow Bowl", description: "Slow-simmered rich shank bone marrow soup garnished with fresh ginger juliennes, cilantro and lemon.", price: 380, category: "Mezbani Beef", image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Halal"] },

  // R8 — Zaatar & Olive Mediterranean
  { _id: "m28", restaurantId: "r8", name: "Turkish Adana Lamb Kebab Platter", description: "Hand-minced prime lamb seasoned with sweet red peppers and cumin, grilled on wide iron skewers. Served with sumac onions and warm pita.", price: 640, discountPrice: 580, category: "Charcoal Kebabs", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80", isPopular: true, isChefSpecial: true, dietaryTags: ["Halal", "Grilled"] },
  { _id: "m29", restaurantId: "r8", name: "Silky Truffle Hummus with Woodfired Pita", description: "Whipped chickpeas with tahini and garlic, topped with wild mushroom saute, white truffle oil, and hot puffy pita bread.", price: 340, category: "Mezze Platters", image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Vegetarian", "Vegan"] },
  { _id: "m30", restaurantId: "r8", name: "Crisp Falafel & Halloumi Fattoush Bowl", description: "Herbed golden falafel, pan-fried Cypriot halloumi cheese, crisp romaine, pomegranate molasses, and toasted pita crisps.", price: 420, category: "Mezze Platters", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Vegetarian"] },

  // R9 — El Fuego Mexican Taqueria
  { _id: "m31", restaurantId: "r9", name: "Slow-Braised Beef Birria Tacos (3 Pcs)", description: "Grilled crispy corn tortillas stuffed with braised brisket, melted cheese, cilantro and diced onions. Served with rich dipping consomé.", price: 590, discountPrice: 530, category: "Birria Tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80", isPopular: true, isChefSpecial: true, dietaryTags: ["Halal", "Bestseller"] },
  { _id: "m32", restaurantId: "r9", name: "Supreme Loaded Queso & Beef Nachos", description: "Warm tortilla chips smothered in molten cheddar cheese sauce, spiced ground beef, guacamole, sour cream, and pico de gallo.", price: 460, category: "Loaded Nachos", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Halal"] },
  { _id: "m33", restaurantId: "r9", name: "Artisanal Cinnamon Sugar Churros (4 Pcs)", description: "Golden fried churros dusted in Mexican cinnamon sugar, served with warm dulce de leche caramel and dark chocolate dipping sauces.", price: 280, category: "Desserts", image: "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Vegetarian"] },

  // R10 — Cafe Botanica
  { _id: "m34", restaurantId: "r10", name: "Spanish Honey Saffron Iced Latte (16oz)", description: "Double shot of Colombian espresso, condensed milk, whole milk, infused with organic Spanish saffron and wild wildflower honey.", price: 280, category: "Specialty Coffee", image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&auto=format&fit=crop&q=80", isPopular: true, dietaryTags: ["Vegetarian"] },
  { _id: "m35", restaurantId: "r10", name: "Smoked Salmon & Avocado Brioche Toast", description: "Toasted French brioche topped with whipped herb cream cheese, sliced avocado, smoked Atlantic salmon, capers, and dill.", price: 490, category: "All Day Brunch", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80", isChefSpecial: true, dietaryTags: ["Seafood", "High Protein"] },
  { _id: "m36", restaurantId: "r10", name: "Salted Caramel Cold Brew Float", description: "18-hour cold brew coffee topped with sea salt cream foam and a scoop of artisanal Madagascar vanilla bean gelato.", price: 260, category: "Specialty Coffee", image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80", dietaryTags: ["Vegetarian"] },
];

// ─── Reviews ─────────────────────────────────────────────────
export const mockReviews: Review[] = [
  { _id: "rev1", restaurantId: "r1", userName: "Tariqul Islam", rating: 5, comment: "The mutton in Sultan's Kacchi was so tender it fell off the bone instantly. The aroma of saffron and ghee is unmatched!", tag: "Verified Foodie", createdAt: "2024-11-10" },
  { _id: "rev2", restaurantId: "r1", userName: "Farhana Chowdhury", rating: 5, comment: "Best Borhani in Dhaka hands down. Packaging was thermal sealed and delivery took only 24 minutes.", tag: "Verified Diner", createdAt: "2024-11-08" },
  { _id: "rev3", restaurantId: "r2", userName: "Rafsan Ahmed", rating: 5, comment: "The Double Truffle Smash burger has that incredible crispy maillard crust and juicy center. Add extra cheddar, it's heavenly.", tag: "Top Reviewer", createdAt: "2024-11-07" },
  { _id: "rev4", restaurantId: "r3", userName: "Anika Rahman", rating: 5, comment: "Real woodfired sourdough pizza! The crust is so airy and blistered. The spicy honey on the 4-cheese pizza blew my mind.", tag: "Verified Diner", createdAt: "2024-11-06" },
  { _id: "rev5", restaurantId: "r4", userName: "Zubair Hossain", rating: 5, comment: "Black garlic ramen broth was so rich and gelatinous. Felt like being transported straight to a Tokyo ramen stall.", tag: "Verified Diner", createdAt: "2024-11-05" },
  { _id: "rev6", restaurantId: "r7", userName: "Chowdhury Muntasir", rating: 5, comment: "Mezban Bari's Beef Kala Bhuna has that deep, smoky dark radhuni spice you usually only get at Chittagong weddings. Truly authentic!", tag: "Master Patron", createdAt: "2024-11-04" },
  { _id: "rev7", restaurantId: "r8", userName: "Nusrat Jahan", rating: 5, comment: "Adana lamb kebab was grilled to smoky perfection. The warm zaatar pita with truffle hummus is addictive.", tag: "Verified Foodie", createdAt: "2024-11-03" },
  { _id: "rev8", restaurantId: "r9", userName: "Abrar Shakil", rating: 5, comment: "The beef birria tacos with consomé are next-level crispy and juicy. Hands down the best Mexican in Dhaka!", tag: "Top Reviewer", createdAt: "2024-11-02" },
  { _id: "rev9", restaurantId: "r10", userName: "Dr. Samiul Huq", rating: 5, comment: "The Spanish Saffron Iced Latte is fantastic! Very peaceful ambiance and great brunch delivery in Bashundhara.", tag: "Verified Diner", createdAt: "2024-11-01" },
  { _id: "rev10", restaurantId: "r6", userName: "Sadia Sultana", rating: 5, comment: "The Basque Burnt Cheesecake is molten in the middle and deeply caramelized on top. Pure French pastry art.", tag: "Verified Foodie", createdAt: "2024-10-31" },
  { _id: "rev11", restaurantId: "r5", userName: "Mahinur Karim", rating: 5, comment: "Fresh salmon quinoa bowl was crisp, light, and very filling. Fast delivery to Gulshan 2.", tag: "Healthy Living", createdAt: "2024-10-30" },
  { _id: "rev12", restaurantId: "r2", userName: "Fahim Hasan", rating: 5, comment: "Nashville Hot Chicken was colossal and extra spicy! Thermal packaging kept the crust remarkably crunchy.", tag: "Verified Diner", createdAt: "2024-10-29" },
];

// ─── Orders ──────────────────────────────────────────────────
export const mockOrders: Order[] = [
  { _id: "o1", orderNumber: "FST-101", customerName: "Farhan Kabir", customerEmail: "farhan@client.demo", customerPhone: "+880 1711-224455", deliveryAddress: { area: "Gulshan 2, Dhaka", fullAddress: "House 14, Road 45, Apt 5B", instructions: "Leave with security reception" }, serviceType: "delivery", restaurant: { id: "r1", name: "Sultan's Heritage Kacchi" }, items: [{ menuItemId: "m1", name: "Shahi Mutton Kacchi Biryani (Full)", price: 430, quantity: 2, itemTotal: 860 }, { menuItemId: "m4", name: "Traditional Spicy Borhani (500ml)", price: 110, quantity: 2, itemTotal: 220 }], subtotal: 1080, deliveryFee: 49, discount: 200, couponCode: "FEAST20", total: 929, paymentMethod: "bkash", paymentStatus: "paid", orderStatus: "on_the_way", estimatedDeliveryTime: "10-15 min", createdAt: "2024-11-10T18:20:00Z" },
  { _id: "o2", orderNumber: "FST-102", customerName: "Sadia Sultana", customerEmail: "sadia@client.demo", customerPhone: "+880 1822-334455", deliveryAddress: { area: "Banani, Dhaka", fullAddress: "Block E, Road 11, Flat 3A", instructions: "Call upon arrival" }, serviceType: "delivery", restaurant: { id: "r2", name: "The Charcoal Artisan Grill" }, items: [{ menuItemId: "m6", name: "Double Truffle & Smoked Cheddar Smash", price: 470, quantity: 2, itemTotal: 940 }, { menuItemId: "m8", name: "Smoked Pulled Beef Loaded Fries", price: 340, quantity: 1, itemTotal: 340 }], subtotal: 1280, deliveryFee: 39, discount: 0, total: 1319, paymentMethod: "cod", paymentStatus: "pending", orderStatus: "cooking", estimatedDeliveryTime: "20-25 min", createdAt: "2024-11-10T19:05:00Z" },
  { _id: "o3", orderNumber: "FST-103", customerName: "Mahfuz Rahman", customerEmail: "mahfuz@client.demo", customerPhone: "+880 1933-445566", deliveryAddress: { area: "Dhanmondi, Dhaka", fullAddress: "Road 27 Old, Lake Drive Apt 7", instructions: "Ring doorbell twice" }, serviceType: "delivery", restaurant: { id: "r3", name: "Bella Firenze Trattoria" }, items: [{ menuItemId: "m11", name: "Quattro Formaggi & Hot Honey Pizza", price: 760, quantity: 1, itemTotal: 760 }, { menuItemId: "m14", name: "Classic Espresso Tiramisu", price: 340, quantity: 1, itemTotal: 340 }], subtotal: 1100, deliveryFee: 50, discount: 100, couponCode: "WELCOME100", total: 1050, paymentMethod: "card", paymentStatus: "paid", orderStatus: "delivered", estimatedDeliveryTime: "Delivered", createdAt: "2024-11-10T20:00:00Z" },
  { _id: "o4", orderNumber: "FST-104", customerName: "Zubair Al Mahmud", customerEmail: "zubair@client.demo", customerPhone: "+880 1712-998877", deliveryAddress: { area: "Uttara, Dhaka", fullAddress: "Sector 4, Road 7, House 22", instructions: "Please knock gently" }, serviceType: "delivery", restaurant: { id: "r6", name: "Velvet Crust Artisanal Patisserie" }, items: [{ menuItemId: "m22", name: "Basque Burnt Cheesecake Slice", price: 360, quantity: 3, itemTotal: 1080 }, { menuItemId: "m23", name: "Triple Chocolate Almond Pain au Chocolat", price: 280, quantity: 2, itemTotal: 560 }], subtotal: 1640, deliveryFee: 40, discount: 200, couponCode: "FEAST20", total: 1480, paymentMethod: "bkash", paymentStatus: "paid", orderStatus: "cooking", estimatedDeliveryTime: "25-30 min", createdAt: "2024-11-10T17:30:00Z" },
  { _id: "o5", orderNumber: "FST-105", customerName: "Nafisa Anjum", customerEmail: "nafisa@client.demo", customerPhone: "+880 1855-667788", deliveryAddress: { area: "Gulshan 1, Dhaka", fullAddress: "South Avenue, House 9, Flat 6B", instructions: "Leave with doorman" }, serviceType: "delivery", restaurant: { id: "r4", name: "Tokyo Drift Sushi & Ramen Bar" }, items: [{ menuItemId: "m15", name: "Black Garlic Tori Paitan Ramen", price: 560, quantity: 2, itemTotal: 1120 }, { menuItemId: "m17", name: "Crispy Chicken Gyoza (6 Pcs)", price: 320, quantity: 1, itemTotal: 320 }], subtotal: 1440, deliveryFee: 50, discount: 49, couponCode: "FREEDEL", total: 1441, paymentMethod: "card", paymentStatus: "paid", orderStatus: "on_the_way", estimatedDeliveryTime: "12-18 min", createdAt: "2024-11-10T18:50:00Z" },
  { _id: "o6", orderNumber: "FST-106", customerName: "Tanvir Ahmed", customerEmail: "tanvir@client.demo", customerPhone: "+880 1715-443322", deliveryAddress: { area: "Dhanmondi, Dhaka", fullAddress: "Road 15, House 34", instructions: "Call when you reach gate" }, serviceType: "delivery", restaurant: { id: "r7", name: "Mezban Bari Chittagong" }, items: [{ menuItemId: "m25", name: "Authentic Chittagong Beef Kala Bhuna", price: 440, quantity: 2, itemTotal: 880 }, { menuItemId: "m26", name: "Mezbani Goshth with Aromatic Akhni Polao", price: 460, quantity: 2, itemTotal: 920 }], subtotal: 1800, deliveryFee: 45, discount: 50, couponCode: "BIRYANI50", total: 1795, paymentMethod: "cod", paymentStatus: "pending", orderStatus: "placed", estimatedDeliveryTime: "30-35 min", createdAt: "2024-11-10T20:30:00Z" },
  { _id: "o7", orderNumber: "FST-107", customerName: "Meherun Nesa", customerEmail: "meherun@client.demo", customerPhone: "+880 1911-332211", deliveryAddress: { area: "Banani, Dhaka", fullAddress: "Road 10, Block C, Apt 4A", instructions: "Hand to customer directly" }, serviceType: "delivery", restaurant: { id: "r8", name: "Zaatar & Olive Mediterranean" }, items: [{ menuItemId: "m28", name: "Turkish Adana Lamb Kebab Platter", price: 580, quantity: 2, itemTotal: 1160 }, { menuItemId: "m29", name: "Silky Truffle Hummus with Woodfired Pita", price: 340, quantity: 1, itemTotal: 340 }], subtotal: 1500, deliveryFee: 45, discount: 200, couponCode: "FEAST20", total: 1345, paymentMethod: "bkash", paymentStatus: "paid", orderStatus: "confirmed", estimatedDeliveryTime: "25-30 min", createdAt: "2024-11-10T19:45:00Z" },
  { _id: "o8", orderNumber: "FST-108", customerName: "Kazi Rashed", customerEmail: "rashed@client.demo", customerPhone: "+880 1788-990011", deliveryAddress: { area: "Gulshan 2, Dhaka", fullAddress: "Road 55, House 18", instructions: "Ring bell" }, serviceType: "delivery", restaurant: { id: "r9", name: "El Fuego Mexican Taqueria" }, items: [{ menuItemId: "m31", name: "Slow-Braised Beef Birria Tacos (3 Pcs)", price: 530, quantity: 2, itemTotal: 1060 }, { menuItemId: "m32", name: "Supreme Loaded Queso & Beef Nachos", price: 460, quantity: 1, itemTotal: 460 }], subtotal: 1520, deliveryFee: 40, discount: 100, couponCode: "WELCOME100", total: 1460, paymentMethod: "card", paymentStatus: "paid", orderStatus: "delivered", estimatedDeliveryTime: "Delivered", createdAt: "2024-11-09T21:00:00Z" },
  { _id: "o9", orderNumber: "FST-109", customerName: "Dr. Nazmul Huda", customerEmail: "nazmul@client.demo", customerPhone: "+880 1819-776655", deliveryAddress: { area: "Bashundhara R/A, Dhaka", fullAddress: "Block C, Road 4, House 102", instructions: "Second floor" }, serviceType: "delivery", restaurant: { id: "r10", name: "Cafe Botanica Artisan Roastery" }, items: [{ menuItemId: "m34", name: "Spanish Honey Saffron Iced Latte (16oz)", price: 280, quantity: 2, itemTotal: 560 }, { menuItemId: "m35", name: "Smoked Salmon & Avocado Brioche Toast", price: 490, quantity: 2, itemTotal: 980 }], subtotal: 1540, deliveryFee: 30, discount: 49, couponCode: "FREEDEL", total: 1521, paymentMethod: "bkash", paymentStatus: "paid", orderStatus: "delivered", estimatedDeliveryTime: "Delivered", createdAt: "2024-11-09T10:30:00Z" },
  { _id: "o10", orderNumber: "FST-110", customerName: "Arman Hossain", customerEmail: "arman@client.demo", customerPhone: "+880 1733-445566", deliveryAddress: { area: "Mirpur, Dhaka", fullAddress: "Mirpur 2, Block B, Road 3", instructions: "" }, serviceType: "delivery", restaurant: { id: "r2", name: "The Charcoal Artisan Grill" }, items: [{ menuItemId: "m6", name: "Double Truffle & Smoked Cheddar Smash", price: 470, quantity: 1, itemTotal: 470 }], subtotal: 470, deliveryFee: 39, discount: 0, total: 509, paymentMethod: "cod", paymentStatus: "pending", orderStatus: "cancelled", estimatedDeliveryTime: "Cancelled", createdAt: "2024-11-08T22:15:00Z" },
];

// ─── Table Reservations ───────────────────────────────────────
export const mockReservations = [
  { _id: "res1", confirmationCode: "FST-RES-7821", restaurantName: "Sultan's Heritage Kacchi", customerName: "Tanvir Hasan", customerPhone: "+880 1711-889900", customerEmail: "tanvir@client.demo", guests: "4 Guests", date: "Today, 7:30 PM", seatingArea: "Window View", occasion: "Family Dinner", specialRequests: "High chair needed for child", status: "confirmed" },
  { _id: "res2", confirmationCode: "FST-RES-9412", restaurantName: "The Charcoal Artisan Grill", customerName: "Dr. Nazmul Huda", customerPhone: "+880 1819-776655", customerEmail: "nazmul@client.demo", guests: "2 Guests", date: "Today, 8:15 PM", seatingArea: "Chef's Table", occasion: "Anniversary", specialRequests: "Quiet corner table", status: "seated" },
  { _id: "res3", confirmationCode: "FST-RES-5531", restaurantName: "Bella Firenze Trattoria", customerName: "Farzana Yasmin", customerPhone: "+880 1722-334411", customerEmail: "farzana@client.demo", guests: "6 Guests", date: "Today, 9:00 PM", seatingArea: "Terrace / Outdoor", occasion: "Birthday Celebration", specialRequests: "Arrange candle on dessert", status: "confirmed" },
  { _id: "res4", confirmationCode: "FST-RES-3829", restaurantName: "Tokyo Drift Sushi & Ramen Bar", customerName: "Shahriar Kabir", customerPhone: "+880 1933-778899", customerEmail: "shahriar@client.demo", guests: "2 Guests", date: "Tomorrow, 1:30 PM", seatingArea: "Window View", occasion: "Business Lunch", specialRequests: "Fast serving requested", status: "confirmed" },
  { _id: "res5", confirmationCode: "FST-RES-6614", restaurantName: "Mezban Bari Chittagong", customerName: "Barrister Rafiqul Islam", customerPhone: "+880 1713-556677", customerEmail: "rafiqul@client.demo", guests: "8+ Guests", date: "Tomorrow, 8:00 PM", seatingArea: "Window View", occasion: "Family Reunion", specialRequests: "Pre-order 2 full Mezban bowls", status: "confirmed" },
  { _id: "res6", confirmationCode: "FST-RES-4482", restaurantName: "Zaatar & Olive Mediterranean", customerName: "Imran Hossain", customerPhone: "+880 1844-112233", customerEmail: "imran@client.demo", guests: "4 Guests", date: "This Friday, 7:45 PM", seatingArea: "Terrace / Outdoor", occasion: "Weekend Dinner", specialRequests: "Terrace heating if chilly", status: "confirmed" },
  { _id: "res7", confirmationCode: "FST-RES-8820", restaurantName: "El Fuego Mexican Taqueria", customerName: "Nafisa Anjum", customerPhone: "+880 1855-667788", customerEmail: "nafisa@client.demo", guests: "3 Guests", date: "This Friday, 8:30 PM", seatingArea: "Chef's Table", occasion: "Casual Dining", specialRequests: "Extra nachos for table", status: "seated" },
  { _id: "res8", confirmationCode: "FST-RES-1193", restaurantName: "Cafe Botanica Artisan Roastery", customerName: "Tahsin Zaman", customerPhone: "+880 1718-223344", customerEmail: "tahsin@client.demo", guests: "2 Guests", date: "Saturday, 10:30 AM", seatingArea: "Window View", occasion: "Brunch", specialRequests: "Window corner for natural light", status: "confirmed" },
];

// ─── Admin Stats ──────────────────────────────────────────────
export const mockStats = {
  restaurants: 10,
  items: 36,
  orders: 10,
  deals: 6,
  reservations: 8,
  reviews: 12,
  totalRevenue: 13348,
};

// ─── Helper — get restaurant details (menu + reviews) by slug ─
export function getMockRestaurantDetails(slugOrId: string) {
  const restaurant = mockRestaurants.find(
    (r) => r.slug === slugOrId || r._id === slugOrId
  );
  if (!restaurant) return null;

  const allItems = mockMenuItems.filter((m) => m.restaurantId === restaurant._id);
  const reviews = mockReviews.filter((rv) => rv.restaurantId === restaurant._id);

  // Group menu by category
  const categoryMap = new Map<string, MenuItem[]>();
  for (const item of allItems) {
    if (!categoryMap.has(item.category)) categoryMap.set(item.category, []);
    categoryMap.get(item.category)!.push(item);
  }
  const groupedMenu = Array.from(categoryMap.entries()).map(([category, items]) => ({ category, items }));

  return { restaurant, groupedMenu, allItems, reviews };
}

// ─── Mock coupon validator (no backend needed) ────────────────
export function validateMockCoupon(code: string, subtotal: number): { success: boolean; deal?: { code: string; discountAmount: number }; message?: string } {
  const deal = mockDeals.find((d) => d.code.toUpperCase() === code.toUpperCase());
  if (!deal) return { success: false, message: "Invalid voucher code. Try FEAST20, FREEDEL, WELCOME100, BIRYANI50, NIGHTCRAVE, or WEEKENDVIP." };
  if (subtotal < deal.minSpend) return { success: false, message: `Minimum spend of ${deal.minSpend} BDT required for this voucher.` };

  let discountAmount = 0;
  if (deal.discountPercent > 0) {
    discountAmount = Math.min((subtotal * deal.discountPercent) / 100, deal.maxDiscount);
  } else {
    discountAmount = Math.min(deal.flatDiscount, deal.maxDiscount);
  }
  return { success: true, deal: { code: deal.code, discountAmount: Math.round(discountAmount) } };
}
