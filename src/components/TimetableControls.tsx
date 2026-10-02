import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Search,
  Star,
  Users,
  Grid,
  CalendarDays,
  Bookmark,
} from 'lucide-react';
import { formatYmdToKorean } from '../utils/subjectStyles';
import { getDeptName } from '../data/timetableStore';

interface TimetableControlsProps {
  currentDate: string; // YYYYMMDD
  onDateChange: (newDate: string) => void;
  selectedGrade: number; // 1, 2, 3
  onGradeChange: (grade: number) => void;
  selectedClass: number; // 1 ~ 10
  onClassChange: (classNum: number) => void;
  viewMode: 'daily' | 'weekly' | 'allClasses';
  onViewModeChange: (mode: 'daily' | 'weekly' | 'allClasses') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoriteClass: { grade: number; classNum: number } | null;
  onSetFavorite: (grade: number, classNum: number) => void;
}

export const TimetableControls: React.FC<TimetableControlsProps> = ({
  currentDate,
  onDateChange,
  selectedGrade,
  onGradeChange,
  selectedClass,
  onClassChange,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  favoriteClass,
  onSetFavorite,
}) => {
  // 날짜 계산
  const toYmdFormat = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
  };

  const parseYmd = (ymd: string) => {
    const y = parseInt(ymd.substring(0, 4), 10);
    const m = parseInt(ymd.substring(4, 6), 10) - 1;
    const d = parseInt(ymd.substring(6, 8), 10);
    return new Date(y, m, d);
  };

  const handlePrevDay = () => {
    const d = parseYmd(currentDate);
    d.setDate(d.getDate() - 1);
    onDateChange(toYmdFormat(d));
  };

  const handleNextDay = () => {
    const d = parseYmd(currentDate);
    d.setDate(d.getDate() + 1);
    onDateChange(toYmdFormat(d));
  };

  const handleToday = () => {
    const today = new Date();
    onDateChange(toYmdFormat(today));
  };

  const handleQuickDate = (dateStr: string) => {
    onDateChange(dateStr);
  };

  const isoDate = `${currentDate.substring(0, 4)}-${currentDate.substring(4, 6)}-${currentDate.substring(6, 8)}`;
  const { formatted, dayOfWeekText } = formatYmdToKorean(currentDate);
  const currentDept = getDeptName(selectedGrade, selectedClass);

  const isCurrentFavorite =
    favoriteClass &&
    favoriteClass.grade === selectedGrade &&
    favoriteClass.classNum === selectedClass;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
      {/* 1st Row: Date Navigator & View Modes */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-2xs">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              title="이전 날짜"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center px-3 py-1 font-semibold text-slate-800 text-sm sm:text-base gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              <span>{formatted}</span>
              <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                dayOfWeekText === '토요일'
                  ? 'bg-blue-100 text-blue-700'
                  : dayOfWeekText === '일요일'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-slate-200/80 text-slate-700'
              }`}>
                {dayOfWeekText}
              </span>
            </div>

            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              title="다음 날짜"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Date Picker Input */}
          <input
            type="date"
            value={isoDate}
            onChange={(e) => {
              if (e.target.value) {
                onDateChange(e.target.value.replace(/-/g, ''));
              }
            }}
            className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
          />

          {/* Quick Buttons */}
          <button
            onClick={handleToday}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            오늘
          </button>
          <button
            onClick={() => handleQuickDate('20260309')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 transition-colors"
            title="2026 1학기 정규 수업 예시"
          >
            3월 9일 (1학기)
          </button>
          <button
            onClick={() => handleQuickDate('20260108')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/60 transition-colors"
            title="졸업식 날짜"
          >
            1월 8일 (졸업식)
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 self-start lg:self-auto">
          <button
            onClick={() => onViewModeChange('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'daily'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>일간 시간표</span>
          </button>
          <button
            onClick={() => onViewModeChange('weekly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'weekly'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>주간 시간표</span>
          </button>
          <button
            onClick={() => onViewModeChange('allClasses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'allClasses'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>전 학급 비교</span>
          </button>
        </div>
      </div>

      {/* 2nd Row: Grade Tabs & Class Badges & Search */}
      <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Grade & Class Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Grade selection */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            {[1, 2, 3].map((g) => (
              <button
                key={g}
                onClick={() => onGradeChange(g)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  selectedGrade === g
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g}학년
              </button>
            ))}
          </div>

          {/* Class selection (only if not allClasses view) */}
          {viewMode !== 'allClasses' && (
            <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => {
                const isSelected = selectedClass === c;
                return (
                  <button
                    key={c}
                    onClick={() => onClassChange(c)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs scale-105'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {c}반
                  </button>
                );
              })}
            </div>
          )}

          {/* Dept Indicator & Favorite toggle */}
          {viewMode !== 'allClasses' && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                {currentDept}
              </span>

              <button
                onClick={() => onSetFavorite(selectedGrade, selectedClass)}
                className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
                  isCurrentFavorite
                    ? 'bg-amber-50 text-amber-600 border-amber-300'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
                title={isCurrentFavorite ? '내 학급으로 저장됨' : '내 학급으로 즐겨찾기 저장'}
              >
                <Star className={`w-3.5 h-3.5 ${isCurrentFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                <span className="hidden sm:inline">
                  {isCurrentFavorite ? '내 학급' : '즐겨찾기'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Subject search */}
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="과목명/활동 검색 (예: 회로, e스포츠)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
