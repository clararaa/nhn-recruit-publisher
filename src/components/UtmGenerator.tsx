'use client';

import { useState, useMemo } from 'react';

const PLATFORMS = [
  { name: '사람인', source: 'saramin' },
  { name: '리멤버', source: 'remember' },
  { name: '게임잡', source: 'gamejob' },
  { name: '링크드인', source: 'linkedin' },
  { name: '자소설', source: 'jasoseol' },
  { name: '링커리어', source: 'linkareer' },
  { name: '인디스워크', source: 'indiswork' },
  { name: '캐치', source: 'catch' },
  { name: '슈퍼루키', source: 'superrookie' },
  { name: '잡코리아', source: 'jobkorea' },
];

interface UtmLink {
  platform: string;
  source: string;
  url: string;
}

export default function UtmGenerator() {
  const [baseUrl, setBaseUrl] = useState('');
  const [campaign, setCampaign] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [bannerSource, setBannerSource] = useState('');
  const [bannerCampaign, setBannerCampaign] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const links = useMemo<UtmLink[]>(() => {
    if (!baseUrl || !campaign) return [];

    const base = baseUrl.includes('?') ? baseUrl + '&' : baseUrl + '?';

    const platformLinks: UtmLink[] = PLATFORMS.map((p) => ({
      platform: p.name,
      source: p.source,
      url: `${base}utm_source=${encodeURIComponent(p.source)}&utm_medium=jobposting&utm_campaign=${encodeURIComponent(campaign)}`,
    }));

    if (showBanner && bannerSource) {
      platformLinks.push({
        platform: '배너 광고',
        source: bannerSource,
        url: `${base}utm_source=${encodeURIComponent(bannerSource)}&utm_medium=display&utm_campaign=${encodeURIComponent(bannerCampaign || campaign)}`,
      });
    }

    return platformLinks;
  }, [baseUrl, campaign, showBanner, bannerSource, bannerCampaign]);

  const handleCopy = async (url: string, index: number) => {
    await navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCopyAll = async () => {
    const text = links
      .map((l) => `${l.platform}\t${l.url}`)
      .join('\n');
    await navigator.clipboard.writeText(text);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 입력 영역 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-bold mb-1">채용공고 URL<span className="text-red-500 ml-0.5">*</span></label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://careers.nhn.com/recruit/view?recruitId=..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
              focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">캠페인명<span className="text-red-500 ml-0.5">*</span></label>
          <input
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="법인_직군"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
              focus:outline-none focus:border-black transition-colors"
          />
          <p className="mt-1 text-xs text-gray-400">예: NHN_Corporate, NHN_Game Art, NHN Cloud_Tech</p>
        </div>
      </div>

      {/* 배너 광고 토글 */}
      <div className="mb-6">
        <button
          onClick={() => setShowBanner(!showBanner)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <span className={`inline-block w-4 h-4 border rounded transition-colors
            ${showBanner ? 'bg-black border-black' : 'border-gray-300'}`}
          >
            {showBanner && <span className="text-white text-xs flex items-center justify-center">✓</span>}
          </span>
          배너 광고 UTM 추가
        </button>
        {showBanner && (
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-sm font-bold mb-1">배너 출처</label>
              <input
                type="text"
                value={bannerSource}
                onChange={(e) => setBannerSource(e.target.value)}
                placeholder="예: naver_banner"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                  focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">배너 캠페인명 (미입력 시 기본 캠페인명 사용)</label>
              <input
                type="text"
                value={bannerCampaign}
                onChange={(e) => setBannerCampaign(e.target.value)}
                placeholder={campaign || '기본 캠페인명과 동일'}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                  focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* 결과 테이블 */}
      {links.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">{links.length}개 플랫폼 UTM 생성됨</span>
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 text-xs font-medium border border-black bg-black text-white
                rounded hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {allCopied ? '복사됨!' : '전체 복사'}
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2 font-bold w-28">플랫폼</th>
                  <th className="text-left px-4 py-2 font-bold">UTM URL</th>
                  <th className="w-20"></th>
                </tr>
              </thead>
              <tbody>
                {links.map((link, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-100 last:border-0
                      ${link.platform === '배너 광고' ? 'bg-yellow-50' : ''}`}
                  >
                    <td className="px-4 py-2 font-medium whitespace-nowrap">{link.platform}</td>
                    <td className="px-4 py-2 text-gray-500 break-all text-xs">{link.url}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleCopy(link.url, i)}
                        className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer
                          ${copiedIndex === i
                            ? 'bg-green-500 text-white border-green-500'
                            : 'border-gray-300 hover:border-black'
                          }`}
                      >
                        {copiedIndex === i ? '완료' : '복사'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
