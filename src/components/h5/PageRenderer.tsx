'use client';

import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';
import { LazyComponent } from './LazyComponent';
import { BannerRenderer } from './components/BannerRenderer';
import { ProductCardRenderer } from './components/ProductCardRenderer';
import { ProductGridRenderer } from './components/ProductGridRenderer';
import { TextBlockRenderer } from './components/TextBlockRenderer';
import { ImageBlockRenderer } from './components/ImageBlockRenderer';
import { ButtonRenderer } from './components/ButtonRenderer';
import { CouponRenderer } from './components/CouponRenderer';
import { CountdownRenderer } from './components/CountdownRenderer';
import { DividerRenderer } from './components/DividerRenderer';
import { SpacerRenderer } from './components/SpacerRenderer';
import { NavBarRenderer } from './components/NavBarRenderer';
import { PriceTableRenderer } from './components/PriceTableRenderer';
import { ProductListRenderer } from './components/ProductListRenderer';
import { PromoSectionRenderer } from './components/PromoSectionRenderer';
import { ContactBarRenderer } from './components/ContactBarRenderer';
import { RechargeCardRenderer } from './components/RechargeCardRenderer';
import { FlashDealRenderer } from './components/FlashDealRenderer';

interface PageRendererProps {
  components: ComponentNode[];
  products: Product[];
  isSSR?: boolean;
}

const rendererMap: Record<string, React.ComponentType<{ node: ComponentNode; products: Product[] }>> = {
  'banner': BannerRenderer,
  'product-card': ProductCardRenderer,
  'product-grid': ProductGridRenderer,
  'text-block': TextBlockRenderer,
  'image-block': ImageBlockRenderer,
  'button': ButtonRenderer,
  'coupon': CouponRenderer,
  'countdown': CountdownRenderer,
  'divider': DividerRenderer,
  'spacer': SpacerRenderer,
  'nav-bar': NavBarRenderer,
  'price-table': PriceTableRenderer,
  'product-list': ProductListRenderer,
  'promo-section': PromoSectionRenderer,
  'contact-bar': ContactBarRenderer,
  'recharge-card': RechargeCardRenderer,
  'flash-deal': FlashDealRenderer,
};

export function PageRenderer({ components, products, isSSR }: PageRendererProps) {
  const visibleComponents = components.filter((c) => c.visible);

  return (
    <div className="page-container w-full min-h-screen">
      {visibleComponents.map((component, index) => {
        const Renderer = rendererMap[component.type];
        if (!Renderer) return null;

        const isCritical = component.loadPriority === 'critical' || index < 3;

        if (isSSR || isCritical) {
          return (
            <div key={component.id} data-component-id={component.id}>
              <Renderer node={component} products={products} />
            </div>
          );
        }

        return (
          <LazyComponent key={component.id} componentId={component.id}>
            <Renderer node={component} products={products} />
          </LazyComponent>
        );
      })}
    </div>
  );
}
