"use client";

import { useState, useEffect } from "react";
import { Editor, EditorProvider } from "react-simple-wysiwyg";
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, AlertCircle } from "lucide-react";
import { stripHtml } from "@/lib/utils";

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  maxLength?: number;
}

export function RichTextEditor({ name, defaultValue, maxLength = 5000 }: RichTextEditorProps) {
  const [value, setValue] = useState(defaultValue || "");
  const [textLength, setTextLength] = useState(0);

  // Update plain text length whenever the HTML changes
  useEffect(() => {
    const plainText = stripHtml(value);
    setTextLength(plainText.length);
  }, [value]);

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
  };

  const btnClass = "p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-md transition-colors";
  const Divider = () => <div className="w-px h-5 bg-slate-300 mx-1 self-center" />;

  const isOverLimit = textLength > maxLength;

  return (
    <div className={`bg-white rounded-lg border overflow-hidden transition-all ${isOverLimit ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus-within:border-brand focus-within:ring-2 focus-within:ring-orange-200'}`}>
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b border-slate-200 items-center">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('bold'); }} className={btnClass} title="Bold"><Bold className="w-4 h-4" /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('italic'); }} className={btnClass} title="Italic"><Italic className="w-4 h-4" /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('underline'); }} className={btnClass} title="Underline"><Underline className="w-4 h-4" /></button>
        
        <Divider />
        
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', '<h2>'); }} className={btnClass} title="Heading 2"><Heading2 className="w-4 h-4" /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', '<h3>'); }} className={btnClass} title="Heading 3"><Heading3 className="w-4 h-4" /></button>
        
        <Divider />
        
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }} className={btnClass} title="Bullet List"><List className="w-4 h-4" /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('insertOrderedList'); }} className={btnClass} title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
      </div>

      {/* Editor Area with Fixed Height & Scrollbar */}
      <EditorProvider>
        <Editor
          value={value}
          onChange={handleChange}
          containerProps={{ 
            style: { 
              height: '300px', 
              maxHeight: '300px', 
              overflowY: 'auto', 
              padding: '16px',
              color: '#0f172a'
            } 
          }}
        />
      </EditorProvider>
      
      {/* Footer / Character Counter */}
      <div className={`flex justify-between items-center px-4 py-2 border-t ${isOverLimit ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex-grow">
          {isOverLimit && (
            <div className="flex items-center gap-1.5 text-red-600 font-medium text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>Description exceeds the {maxLength.toLocaleString()} character limit. Please shorten it to publish.</span>
            </div>
          )}
        </div>
        
        <span className={`text-xs font-semibold ${isOverLimit ? 'text-red-600' : 'text-slate-500'}`}>
          {textLength.toLocaleString()} / {maxLength.toLocaleString()}
        </span>
      </div>

      <input type="hidden" name={name} value={value} />
    </div>
  );
}
