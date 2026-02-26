import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';
import type { PriceTableTier } from '@/types/page';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function PriceTableRenderer({ node }: Props) {
  const {
    title = 'Discount Tiers',
    currency = '$',
    tiers = [],
  } = node.props as {
    title?: string;
    currency?: string;
    tiers?: PriceTableTier[];
  };

  return (
    <div
      style={{
        padding: node.style.padding || '16px',
        margin: node.style.margin,
        backgroundColor: node.style.backgroundColor || '#FEF2F2',
        borderRadius: node.style.borderRadius || '12px',
        color: node.style.color,
      }}
    >
      <div
        style={{
          fontSize: node.style.fontSize || 16,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '12px',
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: '8px',
              borderLeft: '3px solid #EF4444',
            }}
          >
            <span style={{ fontSize: 14, color: '#374151' }}>
              Spend <span style={{ fontWeight: 'bold', fontSize: 18, color: '#111827' }}>{currency}{tier.threshold}</span>
            </span>
            <span
              style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              Save {currency}{tier.discount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
