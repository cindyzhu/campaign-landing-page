'use client';

import { useState } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { mockProducts } from '@/mock/products';
import { formatPrice } from '@/lib/utils';

export default function PropertyPanel() {
  const page = useEditorStore((s) => s.page);
  const selectedId = useEditorStore((s) => s.selectedComponentId);
  const updateComponentProps = useEditorStore((s) => s.updateComponentProps);
  const updateComponentStyle = useEditorStore((s) => s.updateComponentStyle);
  const updateComponent = useEditorStore((s) => s.updateComponent);
  const [showProductPicker, setShowProductPicker] = useState(false);

  const component = page?.components.find((c) => c.id === selectedId);

  if (!component) {
    return (
      <div className="w-72 bg-white border-l border-gray-200 p-4">
        <p className="text-sm text-gray-400 text-center mt-8">Select a component to edit its properties</p>
      </div>
    );
  }

  const updateProp = (key: string, value: unknown) => updateComponentProps(component.id, { [key]: value });
  const updateStyle = (key: string, value: unknown) => updateComponentStyle(component.id, { [key]: value });

  return (
    <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">{component.type}</h2>
        <p className="text-xs text-gray-400 mt-0.5">ID: {component.id.slice(0, 8)}</p>
      </div>

      {/* Props Section */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Properties</h3>

        {component.type === 'text-block' && (
          <>
            <Field label="Content">
              <textarea className="input-field h-20 resize-none" value={(component.props.content as string) || ''} onChange={(e) => updateProp('content', e.target.value)} />
            </Field>
            <Field label="Level">
              <select className="input-field" value={(component.props.level as string) || 'p'} onChange={(e) => updateProp('level', e.target.value)}>
                <option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="p">Paragraph</option>
              </select>
            </Field>
          </>
        )}

        {component.type === 'button' && (
          <>
            <Field label="Text"><input className="input-field" value={(component.props.text as string) || ''} onChange={(e) => updateProp('text', e.target.value)} /></Field>
            <Field label="URL"><input className="input-field" value={(component.props.url as string) || ''} onChange={(e) => updateProp('url', e.target.value)} /></Field>
          </>
        )}

        {component.type === 'nav-bar' && (
          <>
            <Field label="Title"><input className="input-field" value={(component.props.title as string) || ''} onChange={(e) => updateProp('title', e.target.value)} /></Field>
            <Field label="BG Color"><input type="color" className="w-full h-8 cursor-pointer" value={(component.props.backgroundColor as string) || '#1F2937'} onChange={(e) => updateProp('backgroundColor', e.target.value)} /></Field>
            <Field label="Text Color"><input type="color" className="w-full h-8 cursor-pointer" value={(component.props.textColor as string) || '#FFFFFF'} onChange={(e) => updateProp('textColor', e.target.value)} /></Field>
          </>
        )}

        {component.type === 'image-block' && (
          <>
            <Field label="Image URL"><input className="input-field" value={(component.props.src as string) || ''} onChange={(e) => updateProp('src', e.target.value)} /></Field>
            <Field label="Alt Text"><input className="input-field" value={(component.props.alt as string) || ''} onChange={(e) => updateProp('alt', e.target.value)} /></Field>
          </>
        )}

        {component.type === 'coupon' && (
          <>
            <Field label="Code"><input className="input-field" value={(component.props.code as string) || ''} onChange={(e) => updateProp('code', e.target.value)} /></Field>
            <Field label="Discount"><input className="input-field" value={(component.props.discount as string) || ''} onChange={(e) => updateProp('discount', e.target.value)} /></Field>
            <Field label="Description"><input className="input-field" value={(component.props.description as string) || ''} onChange={(e) => updateProp('description', e.target.value)} /></Field>
          </>
        )}

        {component.type === 'countdown' && (
          <>
            <Field label="Label"><input className="input-field" value={(component.props.label as string) || ''} onChange={(e) => updateProp('label', e.target.value)} /></Field>
            <Field label="End Time"><input type="datetime-local" className="input-field" value={(component.props.endTime as string)?.slice(0, 16) || ''} onChange={(e) => updateProp('endTime', new Date(e.target.value).toISOString())} /></Field>
          </>
        )}

        {component.type === 'spacer' && (
          <Field label="Height (px)"><input type="number" className="input-field" value={(component.props.height as number) || 24} onChange={(e) => updateProp('height', Number(e.target.value))} /></Field>
        )}

        {component.type === 'product-grid' && (
          <>
            <Field label="Columns"><input type="number" min={1} max={4} className="input-field" value={(component.props.columns as number) || 2} onChange={(e) => updateProp('columns', Number(e.target.value))} /></Field>
            <Field label="Gap (px)"><input type="number" className="input-field" value={(component.props.gap as number) || 12} onChange={(e) => updateProp('gap', Number(e.target.value))} /></Field>
          </>
        )}

        {component.type === 'price-table' && (
          <>
            <Field label="Title"><input className="input-field" value={(component.props.title as string) || ''} onChange={(e) => updateProp('title', e.target.value)} /></Field>
            <Field label="Currency"><input className="input-field" value={(component.props.currency as string) || '$'} onChange={(e) => updateProp('currency', e.target.value)} /></Field>
            <div className="mb-2">
              <label className="text-xs text-gray-500 block mb-1">Discount Tiers</label>
              {((component.props.tiers as Array<{threshold: number; discount: number}>) || []).map((tier, i) => (
                <div key={i} className="flex items-center gap-1 mb-1">
                  <input type="number" className="input-field w-16" placeholder="Spend" value={tier.threshold} onChange={(e) => {
                    const tiers = [...((component.props.tiers as Array<{threshold: number; discount: number}>) || [])];
                    tiers[i] = { ...tiers[i], threshold: Number(e.target.value) };
                    updateProp('tiers', tiers);
                  }} />
                  <span className="text-xs text-gray-400">Save</span>
                  <input type="number" className="input-field w-16" placeholder="Save" value={tier.discount} onChange={(e) => {
                    const tiers = [...((component.props.tiers as Array<{threshold: number; discount: number}>) || [])];
                    tiers[i] = { ...tiers[i], discount: Number(e.target.value) };
                    updateProp('tiers', tiers);
                  }} />
                  <button className="text-red-400 hover:text-red-600 text-xs" onClick={() => {
                    const tiers = ((component.props.tiers as Array<{threshold: number; discount: number}>) || []).filter((_, idx) => idx !== i);
                    updateProp('tiers', tiers);
                  }}>x</button>
                </div>
              ))}
              <button className="text-xs text-blue-600 hover:text-blue-800" onClick={() => {
                const tiers = [...((component.props.tiers as Array<{threshold: number; discount: number}>) || []), { threshold: 100, discount: 10 }];
                updateProp('tiers', tiers);
              }}>+ Add Tier</button>
            </div>
          </>
        )}

        {component.type === 'product-list' && (
          <>
            <Field label="Title"><input className="input-field" value={(component.props.title as string) || ''} onChange={(e) => updateProp('title', e.target.value)} /></Field>
            <Field label="Show Index">
              <input type="checkbox" checked={(component.props.showIndex as boolean) ?? true} onChange={(e) => updateProp('showIndex', e.target.checked)} />
            </Field>
            <div className="mb-2">
              <label className="text-xs text-gray-500 block mb-1">Items</label>
              {((component.props.items as Array<{name: string; spec: string; price: number}>) || []).map((item, i) => (
                <div key={i} className="border border-gray-100 rounded p-1.5 mb-1">
                  <div className="flex gap-1 mb-1">
                    <input className="input-field flex-1" placeholder="Name" value={item.name} onChange={(e) => {
                      const items = [...((component.props.items as Array<{name: string; spec: string; price: number}>) || [])];
                      items[i] = { ...items[i], name: e.target.value };
                      updateProp('items', items);
                    }} />
                    <button className="text-red-400 hover:text-red-600 text-xs px-1" onClick={() => {
                      const items = ((component.props.items as Array<{name: string; spec: string; price: number}>) || []).filter((_, idx) => idx !== i);
                      updateProp('items', items);
                    }}>x</button>
                  </div>
                  <div className="flex gap-1">
                    <input className="input-field flex-1" placeholder="Spec" value={item.spec} onChange={(e) => {
                      const items = [...((component.props.items as Array<{name: string; spec: string; price: number}>) || [])];
                      items[i] = { ...items[i], spec: e.target.value };
                      updateProp('items', items);
                    }} />
                    <input type="number" className="input-field w-16" placeholder="Price" value={item.price} onChange={(e) => {
                      const items = [...((component.props.items as Array<{name: string; spec: string; price: number}>) || [])];
                      items[i] = { ...items[i], price: Number(e.target.value) };
                      updateProp('items', items);
                    }} />
                  </div>
                </div>
              ))}
              <button className="text-xs text-blue-600 hover:text-blue-800" onClick={() => {
                const items = [...((component.props.items as Array<{name: string; spec: string; price: number}>) || []), { name: '', spec: '', price: 0 }];
                updateProp('items', items);
              }}>+ Add Item</button>
            </div>
          </>
        )}

        {component.type === 'promo-section' && (
          <>
            <Field label="Title"><input className="input-field" value={(component.props.title as string) || ''} onChange={(e) => updateProp('title', e.target.value)} /></Field>
            <Field label="Subtitle"><input className="input-field" value={(component.props.subtitle as string) || ''} onChange={(e) => updateProp('subtitle', e.target.value)} /></Field>
            <Field label="Decor Style">
              <select className="input-field" value={(component.props.decorStyle as string) || 'ribbon'} onChange={(e) => updateProp('decorStyle', e.target.value)}>
                <option value="ribbon">Ribbon</option><option value="badge">Badge</option><option value="banner">Banner</option><option value="wave">Wave</option>
              </select>
            </Field>
            <Field label="Accent Color"><input type="color" className="w-full h-8 cursor-pointer" value={(component.props.accentColor as string) || '#EF4444'} onChange={(e) => updateProp('accentColor', e.target.value)} /></Field>
          </>
        )}

        {component.type === 'contact-bar' && (
          <>
            <Field label="Phone"><input className="input-field" value={(component.props.phone as string) || ''} onChange={(e) => updateProp('phone', e.target.value)} /></Field>
            <Field label="Address"><input className="input-field" value={(component.props.address as string) || ''} onChange={(e) => updateProp('address', e.target.value)} /></Field>
            <Field label="WeChat ID"><input className="input-field" value={(component.props.wechatId as string) || ''} onChange={(e) => updateProp('wechatId', e.target.value)} /></Field>
            <Field label="QR Code URL"><input className="input-field" value={(component.props.qrCodeUrl as string) || ''} onChange={(e) => updateProp('qrCodeUrl', e.target.value)} /></Field>
          </>
        )}

        {component.type === 'recharge-card' && (
          <>
            <Field label="Pay Amount"><input type="number" className="input-field" value={(component.props.payAmount as number) || 0} onChange={(e) => updateProp('payAmount', Number(e.target.value))} /></Field>
            <Field label="Get Amount"><input type="number" className="input-field" value={(component.props.getAmount as number) || 0} onChange={(e) => updateProp('getAmount', Number(e.target.value))} /></Field>
            <Field label="Label"><input className="input-field" value={(component.props.label as string) || ''} onChange={(e) => updateProp('label', e.target.value)} /></Field>
            <Field label="Badge Text"><input className="input-field" value={(component.props.badgeText as string) || ''} onChange={(e) => updateProp('badgeText', e.target.value)} /></Field>
          </>
        )}

        {component.type === 'flash-deal' && (
          <>
            <Field label="Button Text"><input className="input-field" value={(component.props.buttonText as string) || 'Buy'} onChange={(e) => updateProp('buttonText', e.target.value)} /></Field>
            <Field label="Columns"><input type="number" min={1} max={3} className="input-field" value={(component.props.columns as number) || 2} onChange={(e) => updateProp('columns', Number(e.target.value))} /></Field>
            <Field label="Show Timer">
              <input type="checkbox" checked={(component.props.showTimer as boolean) ?? true} onChange={(e) => updateProp('showTimer', e.target.checked)} />
            </Field>
            {(component.props.showTimer as boolean) && (
              <Field label="End Time"><input type="datetime-local" className="input-field" value={(component.props.endTime as string)?.slice(0, 16) || ''} onChange={(e) => updateProp('endTime', new Date(e.target.value).toISOString())} /></Field>
            )}
          </>
        )}

        {/* Product binding for product components */}
        {(component.type === 'product-card' || component.type === 'product-grid' || component.type === 'flash-deal' || component.type === 'product-list') && (
          <div className="mt-2">
            <label className="text-xs text-gray-500 block mb-1">Products</label>
            <div className="space-y-1 mb-2">
              {(component.dataBinding?.productIds || []).map((pid) => {
                const p = mockProducts.find((mp) => mp.id === pid);
                return p ? (
                  <div key={pid} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1 text-xs">
                    <span className="truncate">{p.name}</span>
                    <button className="text-red-400 hover:text-red-600 ml-1" onClick={() => {
                      const ids = (component.dataBinding?.productIds || []).filter((id) => id !== pid);
                      updateComponent(component.id, { dataBinding: { type: 'product-list', productIds: ids } });
                    }}>x</button>
                  </div>
                ) : null;
              })}
            </div>
            <button onClick={() => setShowProductPicker(!showProductPicker)} className="text-xs text-blue-600 hover:text-blue-800">
              + Add Products
            </button>
            {showProductPicker && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded">
                {mockProducts.filter((p) => !(component.dataBinding?.productIds || []).includes(p.id)).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      const ids = [...(component.dataBinding?.productIds || []), p.id];
                      updateComponent(component.id, { dataBinding: { type: 'product-list', productIds: ids } });
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs hover:bg-blue-50 border-b border-gray-100 flex justify-between"
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-gray-400 ml-1">{formatPrice(p.price)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Style Section */}
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Style</h3>
        <Field label="BG Color"><input type="color" className="w-full h-8 cursor-pointer" value={component.style.backgroundColor || '#ffffff'} onChange={(e) => updateStyle('backgroundColor', e.target.value)} /></Field>
        <Field label="Text Color"><input type="color" className="w-full h-8 cursor-pointer" value={component.style.color || '#000000'} onChange={(e) => updateStyle('color', e.target.value)} /></Field>
        <Field label="Font Size"><input type="number" className="input-field" value={component.style.fontSize || ''} onChange={(e) => updateStyle('fontSize', Number(e.target.value) || undefined)} /></Field>
        <Field label="Font Weight">
          <select className="input-field" value={component.style.fontWeight || 'normal'} onChange={(e) => updateStyle('fontWeight', e.target.value)}>
            <option value="normal">Normal</option><option value="bold">Bold</option><option value="600">Semi-Bold</option>
          </select>
        </Field>
        <Field label="Text Align">
          <select className="input-field" value={component.style.textAlign || 'left'} onChange={(e) => updateStyle('textAlign', e.target.value)}>
            <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
          </select>
        </Field>
        <Field label="Padding"><input className="input-field" value={component.style.padding || ''} onChange={(e) => updateStyle('padding', e.target.value)} placeholder="e.g. 12px 16px" /></Field>
        <Field label="Margin"><input className="input-field" value={component.style.margin || ''} onChange={(e) => updateStyle('margin', e.target.value)} placeholder="e.g. 8px 0" /></Field>
        <Field label="Border Radius"><input className="input-field" value={component.style.borderRadius || ''} onChange={(e) => updateStyle('borderRadius', e.target.value)} placeholder="e.g. 8px" /></Field>
        <Field label="Height"><input className="input-field" value={component.style.height || ''} onChange={(e) => updateStyle('height', e.target.value)} placeholder="e.g. 200px" /></Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      {children}
    </div>
  );
}
