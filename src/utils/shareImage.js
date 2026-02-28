import { formatCurrency } from './calculations';

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const W = 375;   // logical canvas width
const SCALE = 2; // retina
const P = 28;    // horizontal padding

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Generate a share-card PNG (data URL) for one person's breakdown.
 * Uses the Canvas API — no DOM elements, works reliably on iOS Safari.
 *
 * @param {object} person   - result from calculateSplit for this person
 * @param {string} colorHex - e.g. '#7c3aed'
 * @param {string} hostVenmo - host's Venmo username (can be empty)
 */
export function generatePersonImage(person, colorHex, hostVenmo) {
  const hasTax = person.tax > 0.005;
  const hasTip = person.tip > 0.005;
  const hasTaxTip = hasTax || hasTip;

  // ── Calculate total canvas height ──────────────────────────────────────
  let H = P;           // top padding
  H += 52;             // logo row
  H += 62;             // person avatar + name
  H += 22;             // divider + gap

  for (const item of person.items) {
    H += item.splitWith ? 50 : 40;
  }
  H += 8;              // gap after items

  if (hasTaxTip) {
    H += 8 + (hasTax ? 28 : 0) + (hasTip ? 28 : 0) + 8 + 10;
  }

  H += 10;             // gap before total line
  H += 58;             // total row
  if (hostVenmo) H += 74; // venmo block
  H += 44;             // footer
  H += P;              // bottom padding

  // ── Create canvas ──────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  let y = P;

  // ── Logo row ────────────────────────────────────────────────────────────
  // Indigo pill behind icon
  ctx.fillStyle = '#4f46e5';
  roundRect(ctx, P, y + 8, 34, 34, 9);
  ctx.fill();

  // Fork icon (drawn as paths — no emoji dependency)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  // Left tine
  ctx.beginPath(); ctx.moveTo(P + 12, y + 14); ctx.lineTo(P + 12, y + 28); ctx.stroke();
  // Middle tine
  ctx.beginPath(); ctx.moveTo(P + 17, y + 14); ctx.lineTo(P + 17, y + 24); ctx.stroke();
  // Right tine
  ctx.beginPath(); ctx.moveTo(P + 22, y + 14); ctx.lineTo(P + 22, y + 28); ctx.stroke();
  // Handle bar
  ctx.beginPath(); ctx.moveTo(P + 12, y + 14); ctx.lineTo(P + 22, y + 14); ctx.stroke();

  ctx.font = `bold 17px ${FONT}`;
  ctx.fillStyle = '#4f46e5';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('SplitTab', P + 42, y + 30);
  y += 52;

  // ── Person header ────────────────────────────────────────────────────────
  // Avatar circle
  ctx.beginPath();
  ctx.arc(P + 22, y + 22, 22, 0, Math.PI * 2);
  ctx.fillStyle = colorHex;
  ctx.fill();

  ctx.font = `bold 17px ${FONT}`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((person.name || '?')[0].toUpperCase(), P + 22, y + 22);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  ctx.font = `bold 18px ${FONT}`;
  ctx.fillStyle = '#111827';
  ctx.fillText(`${person.name}'s Bill`, P + 52, y + 17);

  ctx.font = `13px ${FONT}`;
  ctx.fillStyle = '#6b7280';
  ctx.fillText(`${person.items.length} item${person.items.length !== 1 ? 's' : ''}`, P + 52, y + 36);
  y += 62;

  // ── Divider ─────────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(P, y + 4);
  ctx.lineTo(W - P, y + 4);
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.stroke();
  y += 22;

  // ── Items ────────────────────────────────────────────────────────────────
  const maxNameW = W - P * 2 - 80;
  ctx.lineCap = 'butt';

  for (const item of person.items) {
    // Truncate long names
    ctx.font = `500 14px ${FONT}`;
    let name = item.name;
    while (ctx.measureText(name).width > maxNameW && name.length > 3) {
      name = name.slice(0, -1);
    }
    if (name !== item.name) name += '…';

    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'left';
    ctx.fillText(name, P, y + 16);

    if (item.splitWith) {
      ctx.font = `11px ${FONT}`;
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(`split ${item.splitWith} ways`, P, y + 31);
      ctx.font = `500 14px ${FONT}`;
    }

    ctx.font = `600 14px ${FONT}`;
    ctx.fillStyle = '#111827';
    ctx.textAlign = 'right';
    ctx.fillText(formatCurrency(item.share), W - P, y + 16);
    ctx.textAlign = 'left';

    y += item.splitWith ? 50 : 40;
  }

  y += 8;

  // ── Tax / Tip block ──────────────────────────────────────────────────────
  if (hasTaxTip) {
    const bgH = 8 + (hasTax ? 28 : 0) + (hasTip ? 28 : 0) + 8;
    ctx.fillStyle = '#f9fafb';
    roundRect(ctx, P, y, W - P * 2, bgH, 8);
    ctx.fill();
    y += 8;

    if (hasTax) {
      ctx.font = `13px ${FONT}`;
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'left';
      ctx.fillText('Tax (your share)', P + 12, y + 15);
      ctx.textAlign = 'right';
      ctx.fillText(formatCurrency(person.tax), W - P - 12, y + 15);
      y += 28;
    }
    if (hasTip) {
      ctx.font = `13px ${FONT}`;
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'left';
      ctx.fillText('Tip (your share)', P + 12, y + 15);
      ctx.textAlign = 'right';
      ctx.fillText(formatCurrency(person.tip), W - P - 12, y + 15);
      y += 28;
    }
    y += 18;
  }

  y += 10;

  // ── Total row ────────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(P, y);
  ctx.lineTo(W - P, y);
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 2;
  ctx.stroke();
  y += 12;

  ctx.font = `bold 15px ${FONT}`;
  ctx.fillStyle = '#111827';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Total', P, y + 22);

  ctx.font = `bold 26px ${FONT}`;
  ctx.fillStyle = colorHex;
  ctx.textAlign = 'right';
  ctx.fillText(formatCurrency(person.total), W - P, y + 24);
  ctx.textAlign = 'left';
  y += 58;

  // ── Venmo block ──────────────────────────────────────────────────────────
  if (hostVenmo) {
    ctx.fillStyle = '#eef2ff';
    roundRect(ctx, P, y, W - P * 2, 62, 10);
    ctx.fill();

    ctx.font = `bold 14px ${FONT}`;
    ctx.fillStyle = '#4f46e5';
    ctx.textAlign = 'center';
    ctx.fillText(`Venmo @${hostVenmo}  ${formatCurrency(person.total)}`, W / 2, y + 26);

    ctx.font = `12px ${FONT}`;
    ctx.fillStyle = '#818cf8';
    ctx.fillText('Note: SplitTab — Dinner', W / 2, y + 46);
    ctx.textAlign = 'left';
    y += 74;
  }

  // ── Footer ───────────────────────────────────────────────────────────────
  ctx.font = `11px ${FONT}`;
  ctx.fillStyle = '#d1d5db';
  ctx.textAlign = 'center';
  ctx.fillText('Split fairly with SplitTab', W / 2, y + 20);

  return canvas.toDataURL('image/png');
}
