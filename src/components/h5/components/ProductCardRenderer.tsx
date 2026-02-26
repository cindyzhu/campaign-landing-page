import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function ProductCardRenderer({ node, products }: Props) {
  const productIds = node.dataBinding?.productIds || [];
  const product = products.find((p) => productIds.includes(p.id));

  if (!product) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg"
        style={{ ...nodeStyleToCSS(node.style), minHeight: 120 }}
      >
        No product selected
      </div>
    );
  }

  return (
    <a
      href={product.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-product-id={product.id}
      className="block bg-white rounded-lg overflow-hidden shadow-sm"
      style={nodeStyleToCSS(node.style)}
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
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            No Image
          </div>
        )}
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-red-600 font-bold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-1 text-xs text-gray-400">{product.salesCount} sold</div>
      </div>
    </a>
  );
}

function nodeStyleToCSS(style: ComponentNode['style']): React.CSSProperties {
  return {
    width: style.width,
    height: style.height,
    margin: style.margin,
    padding: style.padding,
    backgroundColor: style.backgroundColor,
    borderRadius: style.borderRadius,
    border: style.border,
    color: style.color,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight as React.CSSProperties['fontWeight'],
    textAlign: style.textAlign,
  };
}
