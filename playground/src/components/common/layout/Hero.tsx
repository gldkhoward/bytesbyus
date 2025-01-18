// src/components/common/layout/Hero.tsx
import React from 'react';

interface HeroProps {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  description,
  imageSrc,
  imageAlt = "Hero image",
}) => {
  return (
    <div className="bg-white bg-opacity-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-stone-800">{title}</h1>
            <p className="text-lg max-w-xl text-stone-700">{description}</p>
          </div>
          {imageSrc && (
            <div className="relative w-full h-[300px] md:h-[400px]">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="object-cover rounded-lg shadow-lg w-full h-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};