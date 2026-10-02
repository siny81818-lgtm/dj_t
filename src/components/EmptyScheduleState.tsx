import React from 'react';
import { CalendarX, Calendar, ArrowRight } from 'lucide-react';
import { formatYmdToKorean } from '../utils/subjectStyles';

interface EmptyScheduleStateProps {
  dateStr: string;
  reason?: string;
  onGoToSchoolDay?: () => void;
}

export const EmptyScheduleState: React.FC<EmptyScheduleStateProps> = ({
  dateStr,
  reason,
  onGoToSchoolDay,
}) => {
  const { formatted, dayOfWeekText } = formatYmdToKorean(dateStr);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Upper Information Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>선택 일자: <strong className="text-slate-700">{formatted} ({dayOfWeekText})</strong></span>
        </div>
        {reason && (
          <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
            {reason}
          </span>
        )}
      </div>

      {/* Main Empty Message Box (사용자 요청 지정 문구) */}
      <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
          <CalendarX className="w-8 h-8" />
        </div>

        <div className="max-w-md space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            해당 일자에는 시간표 정보가 없습니다 (주말, 공휴일 또는 방학).
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            주말, 공휴일, 개교기념일 또는 방학 기간에는 시간표가 제공되지 않습니다.
          </p>
        </div>

        {onGoToSchoolDay && (
          <div className="pt-2">
            <button
              onClick={onGoToSchoolDay}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <span>정규 수업일(3월 9일) 시간표 바로가기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Guide Footer */}
      <div className="bg-slate-50/70 border-t border-slate-100 px-5 py-3 text-center text-xs text-slate-400">
        대진전자통신고등학교 학사일정에 따라 정규 수업이 배정된 평일(월~금)을 선택해주세요.
      </div>
    </div>
  );
};
