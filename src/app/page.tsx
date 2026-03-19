'use client';

import { useState, useMemo, useEffect } from 'react';
import TextInput from '@/components/TextInput';
import BannerUpload from '@/components/BannerUpload';
import Preview from '@/components/Preview';
import UtmGenerator from '@/components/UtmGenerator';
import { parseJobPosting } from '@/lib/parser';
import { generateInlineHtml } from '@/lib/html-generator';

type Tab = 'publisher' | 'utm';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('publisher');
  const [rawText, setRawText] = useState('');
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const sections = useMemo(() => parseJobPosting(rawText), [rawText]);

  const absoluteBannerUrl = useMemo(() => {
    if (!bannerUrl) return undefined;
    if (bannerUrl.startsWith('data:') || bannerUrl.startsWith('http')) return bannerUrl;
    return origin ? `${origin}${bannerUrl}` : bannerUrl;
  }, [bannerUrl, origin]);

  const html = useMemo(
    () =>
      sections.length > 0
        ? generateInlineHtml(sections, absoluteBannerUrl)
        : '',
    [sections, absoluteBannerUrl]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 px-6">
        <div style={{ maxWidth: '1400px', margin: '0 auto' }} className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold tracking-widest py-4">N H N</h1>
            <nav className="flex">
              <button
                onClick={() => setActiveTab('publisher')}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer
                  ${activeTab === 'publisher'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                채용공고 퍼블리셔
              </button>
              <button
                onClick={() => setActiveTab('utm')}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer
                  ${activeTab === 'utm'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                UTM 생성기
              </button>
            </nav>
          </div>
          <div className="text-xs text-gray-300">
            {activeTab === 'publisher' && sections.length > 0 && `${sections.length}개 섹션 인식`}
          </div>
        </div>
      </header>

      {/* Main */}
      {activeTab === 'publisher' && (
        <main className="flex-1 w-full px-6 py-6" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="grid gap-6 h-[calc(100vh-100px)]" style={{ gridTemplateColumns: '380px 1fr' }}>
            <div className="flex flex-col">
              <BannerUpload bannerUrl={bannerUrl} onChange={setBannerUrl} />
              <div className="flex-1">
                <TextInput value={rawText} onChange={setRawText} />
              </div>
            </div>
            <Preview html={html} />
          </div>
        </main>
      )}

      {activeTab === 'utm' && (
        <main className="flex-1 w-full px-6 py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <UtmGenerator />
        </main>
      )}
    </div>
  );
}
