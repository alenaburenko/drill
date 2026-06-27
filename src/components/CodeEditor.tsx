import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  theme?: 'vs-dark' | 'vs-light';
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  theme = 'vs-dark',
  height = '100%',
}) => {
  return (
    <div
      style={{ height }}
      className={`border rounded-xl overflow-hidden shadow-sm flex flex-col h-full w-full ${
        theme === 'vs-dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
      }`}
    >
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={value}
        onChange={(val) => onChange && onChange(val || '')}
        theme={theme}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          tabSize: 2,
          wordWrap: 'on',
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          fixedOverflowWidgets: true,
        }}
      />
    </div>
  );
};
