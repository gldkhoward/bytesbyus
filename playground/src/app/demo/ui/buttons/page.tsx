// src/app/demo/ui/buttons/page.tsx
import React from 'react';
import { Button } from '@/components/common/buttons/Button';
import { ExternalLink, Mail, Loader2, Plus, Upload, ArrowRight } from 'lucide-react';

export default function ButtonDemo() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="space-y-12">
        {/* Header */}
        <div className="border-b border-stone-200 pb-6">
          <h1 className="text-3xl font-bold text-stone-800">Button Component</h1>
          <p className="mt-2 text-stone-600">A demonstration of all button variants and states in the BytesByUs design system.</p>
        </div>

        {/* Variants Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">Variants</h2>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-4 p-4 border border-stone-200 rounded-lg">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link Button</Button>
              <Button size="link" variant="basicLink">Basic Link Button</Button>
            </div>
          </div>
        </section>

        {/* Sizes Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">Sizes</h2>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-4 p-4 border border-stone-200 rounded-lg">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </section>

        {/* States Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">States</h2>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-4 p-4 border border-stone-200 rounded-lg">
              <Button disabled>Disabled</Button>
              <Button variant="secondary" disabled>Disabled</Button>
              <Button className="cursor-wait">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </Button>
            </div>
          </div>
        </section>

        {/* With Icons Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">With Icons</h2>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-4 p-4 border border-stone-200 rounded-lg">
              <Button>
                <Mail className="mr-2 h-4 w-4" /> Email
              </Button>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" /> New Item
              </Button>
              <Button variant="outline">
                Upload <Upload className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="link">
                Documentation <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Common Use Cases Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">Common Use Cases</h2>
          <div className="space-y-4">
            {/* Form Actions */}
            <div className="p-4 border border-stone-200 rounded-lg">
              <h3 className="text-sm font-medium mb-4 text-stone-600">Form Actions</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="p-4 border border-stone-200 rounded-lg">
              <h3 className="text-sm font-medium mb-4 text-stone-600">Dialog Actions</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </div>
            </div>

            {/* Call to Action */}
            <div className="p-4 border border-stone-200 rounded-lg">
              <h3 className="text-sm font-medium mb-4 text-stone-600">Call to Action</h3>
              <div className="flex flex-wrap gap-4">
                <Button size="lg">Get Started</Button>
                <Button variant="outline" size="lg">Learn More</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">Usage</h2>
          <div className="p-4 bg-stone-900 text-stone-50 rounded-lg">
            <pre className="text-sm">
              {`import { Button } from '@/components/common/buttons/Button'

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With icons
<Button>
  <Mail className="mr-2 h-4 w-4" /> Email
</Button>`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}