import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function ProductGridRenderer({ node, products }: Props) {
  const { columns = 2, gap = 12 } = node.props as { columns?: number; gap?: number };
  const productIds = node.dataBinding?.productIds || [];
  const gridProducts = products.filter((p) => productIds.includes(p.id));

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        padding: node.style.padding,
        margin: node.style.margin,
      }}
    >
      {gridProducts.length > 0 ? (
        gridProducts.map((product) => (
          <a
            key={product.id}
            href={product.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-product-id={product.id}
            className="block bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <div className="aspect-square bg-gray-100 relative">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  No Image
                </div>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
            <div className="p-2">
              <h3 className="text-xs font-medium text-gray-900 line-clamp-2">{product.name}</h3>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-red-600 text-sm font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-[10px] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-400 py-8">
          No products selected
        </div>
      )}
    </div>
  );
}
