import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';
import type { ProductListItem } from '@/types/page';
import { formatPriceRMB } from '@/lib/utils';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function ProductListRenderer({ node, products }: Props) {
  const {
    title = 'Product List',
    items = [],
    showIndex = true,
  } = node.props as {
    title?: string;
    items?: ProductListItem[];
    showIndex?: boolean;
  };

  // If items are manually provided, use them; otherwise fall back to dataBinding
  const productIds = node.dataBinding?.productIds || [];
  const boundProducts = products.filter((p) => productIds.includes(p.id));
  const hasManualItems = items.length > 0;

  return (
    <div
      style={{
        padding: node.style.padding || '12px 16px',
        margin: node.style.margin,
        backgroundColor: node.style.backgroundColor || '#FFFFFF',
        borderRadius: node.style.borderRadius,
        color: node.style.color,
      }}
    >
      {title && (
        <div style={{ fontWeight: 'bold', fontSize: node.style.fontSize || 16, marginBottom: '12px' }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {hasManualItems
          ? items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 0',
                  borderBottom: i < items.length - 1 ? '1px solid #F3F4F6' : 'none',
                }}
              >
                {showIndex && (
                  <span style={{ width: 20, textAlign: 'center', fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                )}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                    loading="lazy"
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{item.spec}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 16 }}>
                    ¥{item.price}
                  </div>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div style={{ color: '#D1D5DB', fontSize: 11, textDecoration: 'line-through' }}>
                      ¥{item.originalPrice}
                    </div>
                  )}
                </div>
              </div>
            ))
          : boundProducts.map((product, i) => (
              <a
                key={product.id}
                href={product.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-product-id={product.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 0',
                  borderBottom: i < boundProducts.length - 1 ? '1px solid #F3F4F6' : 'none',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {showIndex && (
                  <span style={{ width: 20, textAlign: 'center', fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                )}
                <div style={{ width: 48, height: 48, borderRadius: 6, overflow: 'hidden', flexShrink: 0, backgroundColor: '#F3F4F6' }}>
                  {product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#D1D5DB' }}>
                      No Img
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 16 }}>
                    {formatPriceRMB(product.price)}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div style={{ color: '#D1D5DB', fontSize: 11, textDecoration: 'line-through' }}>
                      {formatPriceRMB(product.originalPrice)}
                    </div>
                  )}
                </div>
              </a>
            ))}
        {!hasManualItems && boundProducts.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '24px 0', fontSize: 14 }}>
            No products yet
          </div>
        )}
      </div>
    </div>
  );
}
