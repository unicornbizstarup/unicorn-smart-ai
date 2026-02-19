
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LIBRARY_DATA } from '../data/academyData';
import {
  FileText,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  Download,
  Play,
  ChevronRight,
  Filter,
  FolderOpen,
  MonitorPlay,
  FileType,
  X
} from 'lucide-react';
import { LibraryItem } from '../types';

const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<LibraryItem['category'] | 'ALL'>('ALL');
  const [activeType, setActiveType] = useState<LibraryItem['type'] | 'ALL'>('ALL');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { id: 'ALL', name: 'ทุกหมวดหมู่', icon: Filter },
    { id: 'TEACHING', name: 'สื่อการสอน', icon: Play },
    { id: 'DOCUMENTS', name: 'เอกสารการเรียนรู้', icon: FileText },
    { id: 'MARKETING', name: 'สื่อการตลาด', icon: ImageIcon },
    { id: 'CLIPS', name: 'คลิปสั้นเรียนรู้', icon: Video },
    { id: 'GUIDELINES', name: 'แนวทางการใช้งาน', icon: LinkIcon },
  ];

  const mediaTypes = [
    { id: 'ALL', name: 'ทุกรูปแบบ', icon: FileType },
    { id: 'PDF', name: 'PDF Documents', icon: FileText },
    { id: 'VIDEO', name: 'วิดีโอ', icon: MonitorPlay },
    { id: 'IMAGE', name: 'รูปภาพ', icon: ImageIcon },
    { id: 'LINK', name: 'ลิงก์ภายนอก', icon: LinkIcon },
  ];

  const filteredItems = useMemo(() => {
    return LIBRARY_DATA.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
      const matchesType = activeType === 'ALL' || item.type === activeType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchTerm, activeCategory, activeType]);

  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    const lowerSearch = searchTerm.toLowerCase();
    return LIBRARY_DATA
      .filter(item => item.title.toLowerCase().includes(lowerSearch))
      .map(item => item.title)
      .slice(0, 5);
  }, [searchTerm]);

  const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-amber-100 text-amber-900 font-bold rounded px-0.5">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const getIcon = (type: LibraryItem['type']) => {
    switch (type) {
      case 'PDF': return <FileText size={24} className="text-red-500" />;
      case 'VIDEO': return <Video size={24} className="text-blue-500" />;
      case 'IMAGE': return <ImageIcon size={24} className="text-emerald-500" />;
      case 'LINK': return <LinkIcon size={24} className="text-amber-500" />;
      default: return <FileText size={24} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 px-2 lg:px-0">
      {/* Header & Search */}
      <section className="glass-card rounded-[3rem] p-10 lg:p-14 border border-white/40 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-colors duration-1000" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 bg-amber-500 rounded-full" />
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">คลังสื่อและเอกสาร</h2>
            </div>
            <p className="text-slate-500 text-lg font-bold opacity-80">รวมสื่อการสอนและเครื่องมือทางการตลาดเพื่อนักธุรกิจ Unicorn</p>
          </div>

          <div className="relative w-full md:w-[400px]" ref={suggestionRef}>
            <div className="relative">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-500 ${searchTerm ? 'text-amber-500 scale-110' : 'text-slate-400'}`} size={22} />
              <input
                type="text"
                placeholder="ค้นหาชื่อสื่อหรือเอกสาร..."
                className="w-full pl-14 pr-12 py-5 bg-slate-50/50 backdrop-blur-md border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-amber-400 focus:ring-8 focus:ring-amber-500/5 transition-all font-black text-slate-800 shadow-inner group/input"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200/50 rounded-full text-slate-400 transition-all active:scale-90"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-300">
                <div className="p-3">
                  <p className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">แนะนำสำหรับคุณ</p>
                  <div className="space-y-1">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchTerm(s);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-5 py-4 hover:bg-amber-50 rounded-2xl flex items-center gap-4 group transition-all duration-300"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                          <Search size={14} className="text-slate-300 group-hover:text-amber-500" />
                        </div>
                        <span className="text-slate-700 font-bold">
                          <HighlightedText text={s} highlight={searchTerm} />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10 relative z-10">
          {/* Category Tabs */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">หมวดหมู่เนื้อหา</p>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2 -mx-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`
                    px-8 py-4 rounded-[1.8rem] text-sm font-black flex items-center gap-3 transition-all duration-500 shrink-0 border
                    ${activeCategory === cat.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-105 -translate-y-1'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-amber-200 hover:bg-amber-50/50 hover:text-slate-900'}
                  `}
                >
                  <cat.icon size={20} className={`${activeCategory === cat.id ? 'text-amber-400' : 'text-slate-300'}`} />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Media Type Tabs */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">รูปแบบสื่อ</p>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2 -mx-2">
              {mediaTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id as any)}
                  className={`
                    px-6 py-3 rounded-2xl text-[11px] font-black flex items-center gap-2.5 transition-all duration-300 shrink-0 border uppercase tracking-wider
                    ${activeType === type.id
                      ? 'bg-amber-100 border-amber-400 text-amber-700 shadow-lg'
                      : 'bg-white/50 border-slate-200/50 text-slate-500 hover:border-slate-300'}
                  `}
                >
                  <type.icon size={16} />
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Display */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="glass-card rounded-[3rem] border border-white/40 shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden flex flex-col hover:-translate-y-2">
              {/* Card Header/Thumbnail Placeholder */}
              <div className={`h-48 flex items-center justify-center relative overflow-hidden transition-all duration-700 ${item.type === 'VIDEO' ? 'bg-blue-50/50' :
                item.type === 'PDF' ? 'bg-red-50/50' :
                  item.type === 'IMAGE' ? 'bg-emerald-50/50' : 'bg-amber-50/50'
                }`}>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
                <div className="transform group-hover:scale-[1.8] group-hover:rotate-12 transition-all duration-1000 opacity-10">
                  {getIcon(item.type)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                    {getIcon(item.type)}
                  </div>
                </div>
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 border border-white shadow-sm">
                  {item.type}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-10 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight group-hover:text-amber-600 transition-colors">
                    <HighlightedText text={item.title} highlight={searchTerm} />
                  </h3>
                  <p className="text-slate-500 text-base font-medium line-clamp-2 mb-8 opacity-80 leading-relaxed">
                    <HighlightedText text={item.description} highlight={searchTerm} />
                  </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">หมวดหมู่</span>
                    <span className="text-xs font-black text-slate-500 uppercase">
                      {categories.find(c => c.id === item.category)?.name}
                    </span>
                  </div>
                  <button className="flex items-center gap-3 bg-slate-950 text-white px-7 py-3.5 rounded-2xl text-sm font-black hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-950/20 hover-shine overflow-hidden relative">
                    {item.type === 'VIDEO' ? <Play size={18} fill="currentColor" /> : item.type === 'LINK' ? <LinkIcon size={18} /> : <Download size={18} />}
                    <span className="relative z-10">{item.type === 'VIDEO' ? 'รับชม' : item.type === 'LINK' ? 'ไปที่ลิงก์' : 'ดาวน์โหลด'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-28 text-center space-y-6 glass-card rounded-[4rem] border-dashed border-2 border-slate-200 bg-slate-50/50">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-slate-200 shadow-inner">
              <Search size={48} />
            </div>
            <div className="space-y-2">
              <p className="text-slate-900 font-black text-2xl">ไม่พบข้อมูลที่ต้องการครับ</p>
              <p className="text-slate-400 font-bold">ลองใช้คำค้นหาอื่น หรือล้างการกรองทั้งหมดดูนะครับ</p>
            </div>
            <button
              onClick={() => { setActiveCategory('ALL'); setActiveType('ALL'); setSearchTerm(''); }}
              className="px-8 py-3 bg-amber-500 text-slate-950 rounded-2xl font-black text-sm hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
            >
              ล้างการกรองทั้งหมด
            </button>
          </div>
        )}
      </div>

      {/* Systematic Guidance Tip */}
      <div className="bg-dark-gradient rounded-[4rem] p-12 lg:p-16 text-white shadow-3xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group hover-shine">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />

        <div className="w-28 h-28 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center shrink-0 border border-white/10 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
          <FolderOpen size={48} className="text-amber-400" />
        </div>
        <div className="flex-1 text-center md:text-left relative z-10">
          <h4 className="text-3xl lg:text-4xl font-black mb-4 italic tracking-tight">สื่อมาตรฐาน <span className="text-amber-400">เพื่อความเป็นหนึ่งเดียว</span></h4>
          <p className="text-indigo-100/70 text-xl font-medium leading-relaxed max-w-2xl">
            การใช้สื่อชุดเดียวกันในการส่งต่อธุรกิจ จะช่วยให้ทีมงานทำงานง่าย
            ลดความสับสน และสร้างความเป็นมืออาชีพให้กับองค์กร Unicorn ของคุณ
          </p>
        </div>
        <button className="px-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-lg hover:bg-amber-50 transition-all shadow-2xl shadow-black/20 whitespace-nowrap active:scale-95 relative z-10">
          ดูคู่มือการใช้สื่อ
        </button>
      </div>
    </div>
  );
};

  );
};

export default Library;
