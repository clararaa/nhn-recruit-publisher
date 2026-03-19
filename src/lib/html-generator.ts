import { Section, ContentItem } from './parser';

const WIDTH = '792px';

const STYLES = {
  container: `
    width: ${WIDTH};
    margin: 0 auto;
    padding: 40px 32px;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #171717;
    background: #ffffff;
    line-height: 1.8;
  `.replace(/\n/g, '').replace(/\s+/g, ' ').trim(),

  bannerImg: `
    width: 100%;
    max-width: ${WIDTH};
    height: auto;
    display: block;
    border-radius: 8px;
    margin-bottom: 32px;
  `.replace(/\n/g, '').replace(/\s+/g, ' ').trim(),

  sectionTitle: `
    font-size: 18px;
    font-weight: 700;
    color: #000000;
    margin: 36px 0 14px 0;
    padding: 0;
    letter-spacing: -0.02em;
  `.replace(/\n/g, '').replace(/\s+/g, ' ').trim(),

  paragraph: `
    font-size: 16px;
    color: #333333;
    margin: 0 0 8px 0;
    padding: 0;
    line-height: 1.8;
  `.replace(/\n/g, '').replace(/\s+/g, ' ').trim(),

  list: `
    margin: 0 0 8px 0;
    padding: 0;
    list-style: none;
  `.replace(/\n/g, '').replace(/\s+/g, ' ').trim(),

  listItem: `
    font-size: 16px;
    color: #333333;
    margin: 0 0 8px 0;
    padding: 0;
    line-height: 1.8;
  `.replace(/\n/g, '').replace(/\s+/g, ' ').trim(),

  bullet: `
    color: #999999;
    margin-right: 6px;
  `.replace(/\n/g, '').replace(/\s+/g, ' ').trim(),

  divider: `
    border: none;
    border-top: 1px solid #e5e5e5;
    margin: 32px 0;
  `.replace(/\n/g, '').replace(/\s+/g, ' ').trim(),
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderContentItems(items: ContentItem[]): string {
  const parts: string[] = [];
  let bulletBuffer: ContentItem[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    const lis = bulletBuffer
      .map(
        (item) =>
          `<li style="${STYLES.listItem}"><span style="${STYLES.bullet}">&#8226;</span>${escapeHtml(item.value)}</li>`
      )
      .join('\n');
    parts.push(`<ul style="${STYLES.list}">\n${lis}\n</ul>`);
    bulletBuffer = [];
  };

  for (const item of items) {
    if (item.type === 'bullet') {
      bulletBuffer.push(item);
    } else {
      flushBullets();
      parts.push(`<p style="${STYLES.paragraph}">${escapeHtml(item.value)}</p>`);
    }
  }
  flushBullets();

  return parts.join('\n');
}

function renderSection(section: Section, isFirst: boolean): string {
  const titleHtml = `<h3 style="${STYLES.sectionTitle}">${escapeHtml(section.title)}</h3>`;
  const contentHtml = renderContentItems(section.content);
  const divider = !isFirst ? `<hr style="${STYLES.divider}" />` : '';

  return `${divider}\n${titleHtml}\n${contentHtml}`;
}

export function generateInlineHtml(
  sections: Section[],
  bannerImageUrl?: string
): string {
  const bannerHtml = bannerImageUrl
    ? `<img src="${escapeHtml(bannerImageUrl)}" alt="채용 공고 배너" style="${STYLES.bannerImg}" />`
    : '';

  const sectionsHtml = sections
    .map((section, i) => renderSection(section, i === 0))
    .join('\n\n');

  return `<div style="${STYLES.container}">
${bannerHtml}
${sectionsHtml}
</div>`;
}
