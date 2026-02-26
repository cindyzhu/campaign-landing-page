import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function RechargeCardRenderer({ node }: Props) {
  const {
    payAmount = 2000,
    getAmount = 2300,
    label = '',
    badgeText = '',
  } = node.props as {
    payAmount?: number;
    getAmount?: number;
    label?: string;
    badgeText?: string;
  };

  const savings = getAmount - payAmount;
  const discountPercent = payAmount > 0 ? Math.round((getAmount / payAmount) * 100) : 100;

  return (
    <div
      style={{
        padding: node.style.padding || '20px',
        margin: node.style.margin,
        backgroundColor: node.style.backgroundColor || '#FFF7ED',
        borderRadius: node.style.borderRadius || '12px',
        textAlign: (node.style.textAlign as React.CSSProperties['textAlign']) || 'center',
        color: node.style.color,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {badgeText && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: '#F97316',
            color: '#FFFFFF',
            padding: '4px 14px 4px 14px',
            fontSize: 11,
            fontWeight: 'bold',
            borderBottomLeftRadius: '8px',
          }}
        >
          {badgeText}
        </span>
      )}
      <div style={{ fontSize: 14, color: '#92400E', marginBottom: '8px' }}>
        {label || `Top-up Bonus`}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
        <span style={{ fontSize: 14, color: '#B45309' }}>Pay</span>
        <span style={{ fontSize: 32, fontWeight: 'bold', color: '#92400E' }}>{payAmount}</span>
        <span style={{ fontSize: 14, color: '#B45309' }}>Get</span>
        <span style={{ fontSize: 32, fontWeight: 'bold', color: '#DC2626' }}>{getAmount}</span>
      </div>
      <div style={{ fontSize: 13, color: '#B45309', marginTop: '8px' }}>
        <span style={{ fontWeight: 'bold', color: '#DC2626' }}>{discountPercent}%</span> value
        {savings > 0 && (
          <span> · Save <span style={{ fontWeight: 'bold', color: '#DC2626' }}>${savings}</span></span>
        )}
      </div>
    </div>
  );
}
