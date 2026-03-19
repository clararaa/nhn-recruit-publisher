'use client';

import { useRef, useState } from 'react';

interface BannerUploadProps {
  bannerUrl: string | null;
  onChange: (url: string | null) => void;
}

const PRESET_BANNERS = [
  { id: 'nhn', label: 'NHN', src: '/banners/NHN.png' },
  { id: 'game', label: 'NHN Game', src: '/banners/NHN Game.png' },
  { id: 'cloud', label: 'NHN Cloud', src: '/banners/NHN Cloud.png' },
  { id: 'enterprise', label: 'NHN Enterprise', src: '/banners/NHN Enterprise.png' },
  { id: 'dooray', label: 'NHN Dooray', src: '/banners/NHN Dooray.png' },
  { id: 'comico', label: 'NHN comico Korea', src: '/banners/NHN comico Korea.png' },
];

export default function BannerUpload({ bannerUrl, onChange }: BannerUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>('nhn');
  const [isCustom, setIsCustom] = useState(false);

  const handlePresetSelect = (preset: typeof PRESET_BANNERS[0]) => {
    setSelectedPreset(preset.id);
    setIsCustom(false);
    onChange(preset.src);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedPreset(null);
      setIsCustom(true);
      onChange(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNoBanner = () => {
    setSelectedPreset(null);
    setIsCustom(false);
    onChange(null);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold tracking-tight uppercase">상단 배너</h2>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            직접 업로드
          </button>
          <button
            onClick={handleNoBanner}
            className="text-xs text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            배너 없음
          </button>
        </div>
      </div>

      {/* 법인 선택 그리드 */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {PRESET_BANNERS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetSelect(preset)}
            className={`
              relative rounded-lg border overflow-hidden cursor-pointer transition-all h-16
              ${selectedPreset === preset.id && !isCustom
                ? 'border-black ring-1 ring-black'
                : 'border-gray-200 hover:border-gray-400'
              }
            `}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preset.src}
              alt={preset.label}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="text-white text-xs font-bold drop-shadow-sm">{preset.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 커스텀 업로드 미리보기 */}
      {isCustom && bannerUrl && (
        <div className="rounded-lg border border-black ring-1 ring-black overflow-hidden h-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerUrl}
            alt="커스텀 배너"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
