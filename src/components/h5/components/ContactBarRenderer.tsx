import type { ComponentNode } from '@/types/page';
import type { Product } from '@/types/product';

interface Props {
  node: ComponentNode;
  products: Product[];
}

export function ContactBarRenderer({ node }: Props) {
  const {
    phone = '',
    address = '',
    qrCodeUrl = '',
    wechatId = '',
  } = node.props as {
    phone?: string;
    address?: string;
    qrCodeUrl?: string;
    wechatId?: string;
  };

  return (
    <div
      style={{
        padding: node.style.padding || '16px',
        margin: node.style.margin,
        backgroundColor: node.style.backgroundColor || '#F9FAFB',
        borderRadius: node.style.borderRadius || '8px',
        color: node.style.color || '#374151',
        fontSize: node.style.fontSize || 13,
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            <a href={`tel:${phone}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>
              {phone}
            </a>
          </div>
        )}
        {wechatId && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>WeChat:</span>
            <span>{wechatId}</span>
          </div>
        )}
        {address && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{address}</span>
          </div>
        )}
      </div>
      {qrCodeUrl && (
        <div style={{ flexShrink: 0 }}>
          <img
            src={qrCodeUrl}
            alt="QR Code"
            style={{ width: 64, height: 64, borderRadius: 4, border: '1px solid #E5E7EB' }}
          />
        </div>
      )}
      {!qrCodeUrl && !phone && !address && (
        <div style={{ textAlign: 'center', width: '100%', color: '#9CA3AF', padding: '8px 0' }}>
          Contact Info
        </div>
      )}
    </div>
  );
}
