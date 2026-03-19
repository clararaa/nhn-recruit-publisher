'use client';

import { useRef, useState, useCallback } from 'react';

interface PreviewProps {
  html: string;
}

export default function Preview({ html }: PreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopyHtml = async () => {
    try {
      const blob = new Blob([html], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob([html], { type: 'text/plain' }),
      });
      await navigator.clipboard.write([clipboardItem]);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      await navigator.clipboard.writeText(html);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const handleDownloadImage = useCallback(async () => {
    if (!previewRef.current) return;
    setDownloading(true);

    try {
      // 동적 import로 html-to-image 로드
      const { toPng } = await import('html-to-image');

      // html-to-image는 여러 번 시도해야 안정적
      let dataUrl = '';
      for (let i = 0; i < 3; i++) {
        try {
          dataUrl = await toPng(previewRef.current, {
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            cacheBust: true,
            skipAutoScale: true,
            filter: (node: HTMLElement) => {
              // 숨겨진 요소 제외
              return node.tagName !== 'NOSCRIPT';
            },
          });
          if (dataUrl && dataUrl !== 'data:,') break;
        } catch {
          // retry
          await new Promise((r) => setTimeout(r, 200));
        }
      }

      if (dataUrl && dataUrl !== 'data:,') {
        const link = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10);
        link.download = `NHN_채용공고_${date}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('이미지 생성 실패:', err);
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setDownloading(false);
    }
  }, []);

  if (!html) {
    return (
      <div className="flex items-center justify-center h-full text-gray-300 text-sm">
        좌측에 공고 내용을 붙여넣으면 미리보기가 표시됩니다
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold tracking-tight uppercase">미리보기</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopyHtml}
            className="px-3 py-1.5 text-xs font-medium border border-black bg-black text-white
              rounded hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {copyFeedback ? '복사됨!' : 'HTML 복사'}
          </button>
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="px-3 py-1.5 text-xs font-medium border border-gray-300
              rounded hover:border-black transition-colors cursor-pointer disabled:opacity-50"
          >
            {downloading ? '생성 중...' : '이미지 다운로드'}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto border border-gray-200 rounded-lg bg-white">
        <div
          ref={previewRef}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
