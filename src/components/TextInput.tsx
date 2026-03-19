'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold tracking-tight uppercase">공고 내용 입력</h2>
        {value && (
          <button
            onClick={() => onChange('')}
            className="text-xs text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            초기화
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"채용 공고 내용을 여기에 붙여넣으세요.\n\ncareers.nhn.com에서 공고 텍스트를 복사하여 붙여넣기하면\n자동으로 섹션이 인식됩니다."}
        className="flex-1 w-full p-4 border border-gray-200 rounded-lg resize-none text-sm leading-relaxed
          placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
      />
    </div>
  );
}
