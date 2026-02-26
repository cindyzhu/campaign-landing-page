import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function ButtonRenderer({ node }: Props) {
  const { text = 'Button', url = '#' } = node.props as { text?: string; url?: string };

  return (
    <div style={{ margin: node.style.margin }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
        style={{
          padding: node.style.padding,
          backgroundColor: node.style.backgroundColor || '#3B82F6',
          color: node.style.color || '#FFFFFF',
          fontWeight: node.style.fontWeight as React.CSSProperties['fontWeight'] || 'bold',
          textAlign: node.style.textAlign || 'center',
          borderRadius: node.style.borderRadius || '8px',
          fontSize: node.style.fontSize || 16,
          display: 'block',
          textDecoration: 'none',
        }}
      >
        {text}
      </a>
    </div>
  );
}
