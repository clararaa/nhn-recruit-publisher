export interface ContentItem {
  type: 'bullet' | 'text' | 'red-bullet' | 'red-text';
  value: string;
}

export interface Section {
  id: string;
  title: string;
  content: ContentItem[];
}

// 법인명 (첫 번째 섹션 제목으로 인식)
const COMPANY_NAMES = [
  'NHN',
  'NHN Cloud',
  'NHN Enterprise',
  'NHN Dooray',
  'NHN comico Korea',
];

// 고정된 섹션 제목 키워드 (포함 여부로 판단)
const SECTION_TITLE_PATTERNS = [
  '소개해요',           // 팀을 소개해요
  '이렇게 일해요',     // 우리 팀은 이렇게 일해요
  '이런 점',           // 함께하면 이런 점들이 좋아요
  '업무를 해요',       // 이 포지션은 이런 업무를 해요 (주요 업무)
  '주요 업무',
  '찾고 있어요',       // 이런 분들을 찾고 있어요 (자격 요건)
  '자격 요건',
  '더 좋아요',         // 이런 분이면 더 좋아요 (우대 사항)
  '우대 사항',
  '작성하시면 좋아요', // 지원서는 이렇게 작성하시면 좋아요
  '합류 여정',         // ~로의 합류 여정
  '확인해주세요',      // 꼭 확인해주세요
];

// 하위 내용을 모두 불릿(•)으로 표시할 섹션 키워드
const BULLET_FORCED_SECTIONS = [
  '소개해요',
  '이렇게 일해요',
  '이런 점',
  '업무를 해요',
  '주요 업무',
  '찾고 있어요',
  '자격 요건',
  '더 좋아요',
  '우대 사항',
  '작성하시면 좋아요',
  '확인해주세요',
];

function isBulletForcedSection(title: string): boolean {
  for (const pattern of BULLET_FORCED_SECTIONS) {
    if (title.includes(pattern)) return true;
  }
  return false;
}

function isSectionTitle(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 50) return false;

  // 법인명 단독 라인
  if (COMPANY_NAMES.includes(trimmed)) return true;

  // 섹션 키워드 포함 여부
  for (const pattern of SECTION_TITLE_PATTERNS) {
    if (trimmed.includes(pattern)) return true;
  }

  return false;
}

function parseBulletItem(line: string): string {
  return line.replace(/^\s*[•\-·\*▪▸►→●○■□]\s*/, '').trim();
}

function isBulletLine(line: string): boolean {
  return /^\s*[•\-·\*▪▸►→●○■□]\s/.test(line);
}

export function parseJobPosting(text: string): Section[] {
  const lines = text.split('\n');
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let introLines: ContentItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (isSectionTitle(trimmed)) {
      if (currentSection) {
        sections.push(currentSection);
      } else if (introLines.length > 0) {
        sections.push({
          id: crypto.randomUUID(),
          title: introLines[0].value,
          content: introLines.slice(1),
        });
        introLines = [];
      }

      currentSection = {
        id: crypto.randomUUID(),
        title: trimmed,
        content: [],
      };
    } else if (currentSection) {
      const value = isBulletLine(trimmed) ? parseBulletItem(trimmed) : trimmed;
      // 불릿 강제 섹션이면 모든 하위 내용을 불릿으로
      if (isBulletForcedSection(currentSection.title)) {
        currentSection.content.push({ type: 'bullet', value });
      } else if (isBulletLine(trimmed)) {
        currentSection.content.push({ type: 'bullet', value });
      } else {
        currentSection.content.push({ type: 'text', value });
      }
    } else {
      if (isBulletLine(trimmed)) {
        introLines.push({ type: 'bullet', value: parseBulletItem(trimmed) });
      } else {
        introLines.push({ type: 'text', value: trimmed });
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  } else if (introLines.length > 0) {
    sections.push({
      id: crypto.randomUUID(),
      title: introLines[0].value,
      content: introLines.slice(1),
    });
  }

  // "합류 여정" 섹션: "합류가이드" 삭제 + "입사" 이후 불릿은 빨간색
  for (const section of sections) {
    if (section.title.includes('합류 여정')) {
      section.content = section.content.filter(
        (item) => !item.value.includes('합류가이드') && !item.value.includes('합류 가이드')
      );
      let afterEntry = false;
      section.content = section.content.map((item) => {
        if (!afterEntry && item.value.includes('입사')) {
          afterEntry = true;
          return item;
        }
        if (afterEntry && item.type === 'bullet') {
          return { ...item, type: 'red-bullet' as const };
        }
        if (afterEntry && item.type === 'text') {
          return { ...item, type: 'red-text' as const };
        }
        return item;
      });
    }
  }

  return sections;
}
