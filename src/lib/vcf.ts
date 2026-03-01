// ─────────────────────────────────────────────
// TapMeOnce — vCard (VCF) Generator
// Carefully crafted to avoid iPhone name/field bugs
// ─────────────────────────────────────────────

import { UserProfile, SocialLink } from '@/types';

function escapeVcfValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function formatPhone(phone: string, countryCode = '+91'): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('91') && clean.length === 12) return `+${clean}`;
  if (clean.length === 10) return `${countryCode}${clean}`;
  return phone;
}

/**
 * Generate a proper vCard 3.0 string.
 * Key rules to avoid iPhone/Android bugs:
 *  - FN must be the person's real name, not company
 *  - N field: lastname;firstname;;;
 *  - TEL type=CELL for mobile (not WORK or VOICE which can confuse)
 *  - X-SOCIALPROFILE for social links (not URL which can show as "website")
 *  - One URL only — the TapMeOnce profile page
 *  - No duplicate phone numbers (WhatsApp same as phone = single entry)
 */
export function generateVcf(profile: UserProfile, links: SocialLink[]): string {
  const nameParts = profile.full_name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const phone = formatPhone(profile.phone, profile.country_code || '+91');

  // TapMeOnce profile URL
  const profileUrl = `https://tapmeonce.com/p/${profile.username}`;

  // Find WhatsApp link — avoid duplicating if same as phone
  const waLink = links.find(l => l.platform === 'whatsapp');
  const waNumber = waLink?.url?.replace(/\D/g, '');
  const mainNumber = profile.phone?.replace(/\D/g, '');
  const whatsappIsDifferent = waNumber && mainNumber && waNumber !== mainNumber;

  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVcfValue(profile.full_name)}`,
    `N:${escapeVcfValue(lastName)};${escapeVcfValue(firstName)};;;`,
    ...(profile.designation ? [`TITLE:${escapeVcfValue(profile.designation)}`] : []),
    ...(profile.company ? [`ORG:${escapeVcfValue(profile.company)}`] : []),
    `TEL;TYPE=CELL:${phone}`,
    ...(whatsappIsDifferent ? [`TEL;TYPE=CELL:${formatPhone(waLink!.url, profile.country_code || '+91')}`] : []),
    `EMAIL:${profile.email}`,
    `URL;TYPE=TAPMEONCE:${profileUrl}`,
    ...(profile.bio ? [`NOTE:${escapeVcfValue(profile.bio.slice(0, 200))}`] : []),
    'END:VCARD',
  ];

  return lines.join('\r\n');
}

export function downloadVcf(profile: UserProfile, links: SocialLink[]): void {
  const content = generateVcf(profile, links);
  const blob = new Blob([content], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.username}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
