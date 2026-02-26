import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function PromoSectionRenderer({ node }: Props) {
  const {
    title = 'Featured',
    subtitle = '',
    decorStyle = 'ribbon',
    accentColor = '#EF4444',
  } = node.props as {
    title?: string;
    subtitle?: string;
    decorStyle?: 'ribbon' | 'badge' | 'banner' | 'wave';
    accentColor?: string;
  };

  const renderDecor = () => {
    switch (decorStyle) {
      case 'badge':
        return (
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '8px 28px',
                borderRadius: '50px',
                backgroundColor: accentColor,
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: node.style.fontSize || 18,
                boxShadow: `0 4px 16px ${accentColor}40`,
              }}
            >
              {title}
            </span>
          </div>
        );

      case 'banner':
        return (
          <div
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: node.style.fontSize || 18,
              textAlign: 'center',
            }}
          >
            {title}
          </div>
        );

      case 'wave':
        return (
          <div style={{ textAlign: 'center', position: 'relative', padding: '8px 0' }}>
            <div
              style={{
                position: 'absolute',
                left: '10%',
                right: '10%',
                top: '50%',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              }}
            />
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
                padding: '6px 24px',
                backgroundColor: node.style.backgroundColor || '#FFFFFF',
                color: accentColor,
                fontWeight: 'bold',
                fontSize: node.style.fontSize || 18,
              }}
            >
              {title}
            </span>
          </div>
        );

      case 'ribbon':
      default:
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 24, height: 2, backgroundColor: accentColor, borderRadius: 1 }} />
              <span
                style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  backgroundColor: accentColor,
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: node.style.fontSize || 18,
                  borderRadius: '4px',
                  position: 'relative',
                }}
              >
                {title}
              </span>
              <div style={{ width: 24, height: 2, backgroundColor: accentColor, borderRadius: 1 }} />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        padding: node.style.padding || '20px 16px 12px',
        textAlign: (node.style.textAlign as React.CSSProperties['textAlign']) || 'center',
        backgroundColor: node.style.backgroundColor,
        margin: node.style.margin,
      }}
    >
      {renderDecor()}
      {subtitle && (
        <div
          style={{
            fontSize: 13,
            color: node.style.color || '#6B7280',
            marginTop: '6px',
            textAlign: 'center',
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}
