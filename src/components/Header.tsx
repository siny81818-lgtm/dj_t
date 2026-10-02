import React from 'react';
import { Calendar, School, Key, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { SCHOOL_INFO } from '../types/timetable';

interface HeaderProps {
  onOpenPrd: () => void;
  onOpenNeisConfig: () => void;
  isApiConfigured: boolean;
  onRefresh: () => void;
  isLoading: boolean;
  dataSourceText: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPrd,
  onOpenNeisConfig,
  isApiConfigured,
  onRefresh,
  isLoading,
  dataSourceText,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & School Name */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <School className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {SCHOOL_INFO.schoolName}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                  시간표 조회
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                부산광역시교육청 (코드: {SCHOOL_INFO.officeCode}) · 표준코드: {SCHOOL_INFO.schoolCode} · {SCHOOL_INFO.type}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Status indicator */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{dataSourceText}</span>
            </div>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="시간표 새로고침"
              className="p-2 sm:px-3 sm:py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
              <span className="hidden sm:inline">새로고침</span>
            </button>

            {/* NEIS API Config Button */}
            <button
              onClick={onOpenNeisConfig}
              className={`flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg text-xs font-medium border transition-colors ${
                isApiConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>NEIS API</span>
              {isApiConfigured && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              )}
            </button>

            {/* PRD Document Button */}
            <button
              onClick={onOpenPrd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shadow-blue-500/20 transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PRD 기획서</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
