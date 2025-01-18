// src/app/demo/ui/cards/page.tsx
import React from 'react';
import { ContentCard } from '@/components/common/cards/ContentCard';

const demoContent = [
  {
    title: "Thai-Inspired Chicken Salad",
    description: "A fresh and vibrant salad combining tender chicken with Thai herbs and a zesty lime dressing. Perfect for summer days...",
    image: "/examples/food/chicken-salad.jpg",
    tags: [
      { text: "Healthy", isPrimary: true },
      { text: "Thai Cuisine", isPrimary: false }
    ],
    stats: {
      forks: 42,
      stars: 189,
      version: "v2.3"
    }
  },
  {
    title: "Sri Lankan Hoppers",
    description: "Traditional Sri Lankan rice flour pancakes with crispy edges and a soft center. Served with curry and sambol...",
    image: "/examples/food/hoppers.jpeg",
    tags: [
      { text: "Traditional", isPrimary: true },
      { text: "Sri Lankan", isPrimary: false }
    ],
    stats: {
      forks: 28,
      stars: 156,
      version: "v1.2"
    }
  },
  {
    title: "Prawn Curry",
    description: "Rich and aromatic prawn curry made with coconut milk, fresh spices, and tender prawns. A perfect comfort dish...",
    image: "/examples/food/prawn_curry.jpeg",
    tags: [
      { text: "Seafood", isPrimary: true },
      { text: "Curry", isPrimary: false }
    ],
    stats: {
      forks: 35,
      stars: 212,
      version: "v2.1"
    }
  },
  {
    title: "Vodka Pasta",
    description: "Creamy tomato vodka pasta with a rich sauce made from San Marzano tomatoes, heavy cream, and a touch of vodka...",
    image: "/examples/food/vodka_pasta.jpg",
    tags: [
      { text: "Italian", isPrimary: true },
      { text: "Pasta", isPrimary: false }
    ],
    stats: {
      forks: 56,
      stars: 245,
      version: "v3.0"
    }
  }
];

export default function CardDemo() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans">
      <div className="space-y-12">
        {/* Header */}
        <div className="border-b border-stone-200 pb-6">
          <h1 className="text-3xl font-bold text-stone-800">Recipe Cards</h1>
          <p className="mt-2 text-stone-600">Showcasing our recipe card components with real-world examples from the BytesByUs community.</p>
        </div>

        {/* Featured Recipe Card */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-stone-800">Featured Recipe</h2>
          <div className="max-w-2xl">
            <ContentCard {...demoContent[0]} />
          </div>
        </section>

        {/* Recipe Grid */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-stone-800">Recipe Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoContent.map((content, index) => (
              <ContentCard key={index} {...content} />
            ))}
          </div>
        </section>

        {/* Different Layouts */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-stone-800">Layout Variations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Side by Side */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-stone-700">Compact View</h3>
              <ContentCard {...demoContent[1]} />
            </div>
            {/* With Extra Content */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-stone-700">Extended Description</h3>
              <ContentCard
                {...demoContent[2]}
                description={`${demoContent[2].description} An authentic recipe passed down through generations, featuring fresh caught prawns and hand-ground spices. Perfect with steamed rice or crusty bread.`}
              />
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">Implementation</h2>
          <div className="p-4 bg-stone-900 text-stone-50 rounded-lg">
            <pre className="text-sm">
              {`import { ContentCard } from '@/components/common/cards/ContentCard';

<ContentCard
  title="Recipe Title"
  description="Recipe description..."
  image="/path/to/image.jpg"
  tags={[
    { text: "Category", isPrimary: true },
    { text: "Cuisine", isPrimary: false }
  ]}
  stats={{
    forks: 42,
    stars: 189,
    version: "v2.3"
  }}
/>`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}