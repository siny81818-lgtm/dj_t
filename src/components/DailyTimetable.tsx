import React from 'react';
import { Clock, BookOpen, Printer, Sparkles, Coffee, Brush, PlusCircle } from 'lucide-react';
import { TimetableEntry } from '../types/timetable';
import { PERIOD_TIMES, getDeptName, checkNonClassDay } from '../data/timetableStore';
import { getSubjectCategory, formatYmdToKorean } from '../utils/subjectStyles';
import { EmptyScheduleState } from './EmptyScheduleState';

interface DailyTimetableProps {
  entries: TimetableEntry[];
  grade: number;
  classNum: number;
  dateStr: string;
  searchQuery?: string;
  onGoToSchoolDay?: () => void;
  onAddAssignmentForSubject?: (subjectName: string) => void;
}

export const DailyTimetable: React.FC<DailyTimetableProps> = ({
  entries,
  grade,
  classNum,
  dateStr,
  searchQuery = '',
  onGoToSchoolDay,
  onAddAssignmentForSubject,
}) => {
  const deptName = getDeptName(grade, classNum);
  const nonClassInfo = checkNonClassDay(dateStr);
  const { formatted, dayOfWeekText } = formatYmdToKorean(dateStr);

  if (nonClassInfo.isNonClass || entries.length === 0) {
    return (
      <EmptyScheduleState
        dateStr={dateStr}
        reason={nonClassInfo.reason || '휴업일'}
        onGoToSchoolDay={onGoToSchoolDay}
      />
    );
  }

  const periodMap = new Map<number, TimetableEntry>();
  entries.forEach((e) => {
    periodMap.set(e.period, e);
  });

  const handlePrint = () => {
    window.print();
  };

  const isMatchSearch = (subject: string) => {
    if (!searchQuery) return true;
    return subject.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm shadow-blue-500/20">
            {grade}-{classNum}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {grade}학년 {classNum}반 일일 시간표
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {deptName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatted} ({dayOfWeekText}) · {classNum}강의실 · 총 {entries.length}교시 배정
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="self-end sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>시간표 인쇄 / PDF</span>
        </button>
      </div>

      {/* Structured Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100/95 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4 text-center w-20 border-r border-slate-200">교시</th>
                <th className="py-3 px-4 w-36 border-r border-slate-200">수업 시간</th>
                <th className="py-3 px-5 border-r border-slate-200">과목명 / 수업 내용</th>
                <th className="py-3 px-4 w-28 text-center border-r border-slate-200">과목 구분</th>
                <th className="py-3 px-4 w-32 text-center border-r border-slate-200">학과 / 강의실</th>
                <th className="py-3 px-24 text-center">과제 등록</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {PERIOD_TIMES.map((slot) => {
                if (slot.period === 'LUNCH') {
                  return (
                    <tr key="lunch" className="bg-amber-50/50 hover:bg-amber-50 transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-xs text-amber-800 border-r border-slate-200">
                        <Coffee className="w-4 h-4 mx-auto text-amber-600" />
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-amber-700 font-semibold border-r border-slate-200">
                        {slot.start} ~ {slot.end}
                      </td>
                      <td className="py-3 px-5 font-bold text-amber-900 border-r border-slate-200" colSpan={3}>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                          <span>{slot.label} (중식)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-xs text-amber-700 font-medium">
                        {slot.duration}
                      </td>
                    </tr>
                  );
                }

                if (slot.period === 'CLEAN') {
                  return (
                    <tr key="clean" className="bg-slate-50 hover:bg-slate-100/80 transition-colors">
                      <td className="py-2.5 px-4 text-center font-bold text-xs text-slate-500 border-r border-slate-200">
                        <Brush className="w-4 h-4 mx-auto text-slate-400" />
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs text-slate-500 font-medium border-r border-slate-200">
                        {slot.start} ~ {slot.end}
                      </td>
                      <td className="py-2.5 px-5 font-semibold text-slate-700 border-r border-slate-200" colSpan={3}>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-slate-400"></span>
                          <span>{slot.label}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-center text-xs text-slate-500 font-medium">
                        {slot.duration}
                      </td>
                    </tr>
                  );
                }

                const periodNum = slot.period as number;
                const entry = periodMap.get(periodNum);
                const subject = entry ? entry.subject : '수업 없음';
                const category = getSubjectCategory(subject);
                const isMatch = searchQuery && isMatchSearch(subject);
                const isDim = searchQuery && !isMatchSearch(subject);
                const isMakeup = subject.includes('[보강]');
                const isNormalSubject = subject !== '수업 없음' && !subject.includes('휴업일') && !subject.includes('방학');

                return (
                  <tr
                    key={periodNum}
                    className={`transition-colors ${
                      isMatch
                        ? 'bg-blue-50/80 font-semibold'
                        : 'hover:bg-slate-50/80'
                    } ${isDim ? 'opacity-30' : 'opacity-100'}`}
                  >
                    {/* 교시 */}
                    <td className="py-3.5 px-4 text-center border-r border-slate-200">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-sm border border-blue-200/60 shadow-2xs">
                        {periodNum}
                      </div>
                    </td>

                    {/* 시간대 */}
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600 font-semibold border-r border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot.start} ~ {slot.end}</span>
                      </div>
                    </td>

                    {/* 과목명 */}
                    <td className="py-3.5 px-5 border-r border-slate-200">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-slate-900">
                          {subject}
                        </span>

                        {isMakeup && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                            보강
                          </span>
                        )}

                        {subject.startsWith('*') && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">
                            <Sparkles className="w-3 h-3" /> NCS실습
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 과목 구분 */}
                    <td className="py-3.5 px-4 text-center border-r border-slate-200">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${category.badgeBg} ${category.badgeText}`}
                      >
                        {category.label}
                      </span>
                    </td>

                    {/* 학과 및 강의실 */}
                    <td className="py-3.5 px-4 text-center text-xs text-slate-600 border-r border-slate-200">
                      <div className="font-semibold text-slate-800">{deptName}</div>
                      <div className="text-[11px] text-slate-400">{classNum}강의실</div>
                    </td>

                    {/* 과목별 과제 등록 버튼 */}
                    <td className="py-3.5 px-4 text-center">
                      {isNormalSubject && onAddAssignmentForSubject ? (
                        <button
                          onClick={() => onAddAssignmentForSubject(subject)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-semibold transition-colors shadow-2xs"
                          title="이 과목에 과제 등록하기"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>과제 추가</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
