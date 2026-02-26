import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function CouponRenderer({ node }: Props) {
  const { code = 'CODE', discount = '20% OFF', description = '' } = node.props as {
    code?: string;
    discount?: string;
    description?: string;
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        margin: node.style.margin,
        padding: node.style.padding || '16px',
        backgroundColor: node.style.backgroundColor || '#FEF3C7',
        borderRadius: node.style.borderRadius || '12px',
        color: node.style.color,
        textAlign: (node.style.textAlign as React.CSSProperties['textAlign']) || 'center',
      }}
    >
      <div className="text-2xl font-bold">{discount}</div>
      <div className="mt-1 text-sm opacity-80">{description}</div>
      <div className="mt-3 inline-block px-4 py-1.5 bg-white/30 rounded-full text-sm font-mono font-bold tracking-wider">
        {code}
      </div>
    </div>
  );
}
