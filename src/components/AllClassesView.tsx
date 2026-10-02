import React from 'react';
import { Sparkles, Users } from 'lucide-react';
import { getTimetableData, getDeptName, checkNonClassDay } from '../data/timetableStore';
import { getSubjectCategory, formatYmdToKorean } from '../utils/subjectStyles';
import { EmptyScheduleState } from './EmptyScheduleState';

interface AllClassesViewProps {
  currentDate: string;
  grade: number;
  searchQuery?: string;
  onSelectClass: (classNum: number) => void;
  onGoToSchoolDay?: () => void;
}

export const AllClassesView: React.FC<AllClassesViewProps> = ({
  currentDate,
  grade,
  searchQuery = '',
  onSelectClass,
  onGoToSchoolDay,
}) => {
  const { formatted, dayOfWeekText } = formatYmdToKorean(currentDate);
  const nonClassInfo = checkNonClassDay(currentDate);
  const periods = [1, 2, 3, 4, 5, 6, 7];
  const classNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

  if (nonClassInfo.isNonClass) {
    return (
      <EmptyScheduleState
        dateStr={currentDate}
        reason={nonClassInfo.reason}
        onGoToSchoolDay={onGoToSchoolDay}
      />
    );
  }

  // 학급별 시간표 맵핑
  const classesData = classNumbers.map((classNum) => {
    const entries = getTimetableData({
      date: currentDate,
      grade,
      classNum,
    });
    const periodMap = new Map<number, string>();
    entries.forEach((e) => periodMap.set(e.period, e.subject));
    const dept = getDeptName(grade, classNum);

    return {
      classNum,
      dept,
      periodMap,
    };
  });

  const isMatchSearch = (subj: string) => {
    if (!searchQuery) return true;
    return subj.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs shadow-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {grade}학년 전체 학급(1~10반) 시간표 종합 비교표
            </h2>
            <p className="text-xs text-slate-500">
              {formatted} ({dayOfWeekText}) · 대진전자통신고등학교 1~10반
            </p>
          </div>
        </div>
      </div>

      {/* Grid Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200">
                <th className="py-3 px-3 text-xs font-bold text-slate-600 w-16 text-center border-r border-slate-200 sticky left-0 bg-slate-100 z-10">
                  학급
                </th>
                <th className="py-3 px-3 text-xs font-bold text-slate-600 w-28 text-center border-r border-slate-200">
                  학과
                </th>
                {periods.map((p) => (
                  <th
                    key={p}
                    className="py-3 px-3 text-center border-r border-slate-200 last:border-r-0 text-xs font-bold text-slate-700 w-32"
                  >
                    {p}교시
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {classesData.map((c) => (
                <tr key={c.classNum} className="hover:bg-slate-50/70 transition-colors">
                  {/* Class Badge (sticky on left) */}
                  <td
                    onClick={() => onSelectClass(c.classNum)}
                    className="py-3 px-3 text-center font-bold border-r border-slate-200 bg-white sticky left-0 z-10 cursor-pointer hover:text-blue-600 shadow-xs"
                    title={`${c.classNum}반 단독 시간표 보기`}
                  >
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-extrabold hover:bg-blue-600 hover:text-white transition-all">
                      {c.classNum}
                    </div>
                  </td>

                  {/* Dept Name */}
                  <td className="py-3 px-2.5 text-center border-r border-slate-200">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 truncate max-w-[110px]">
                      {c.dept}
                    </span>
                  </td>

                  {/* 1~7 Periods */}
                  {periods.map((p) => {
                    const subject = c.periodMap.get(p) || '수업 없음';
                    const cat = getSubjectCategory(subject);
                    const isMatch = searchQuery && isMatchSearch(subject);
                    const isDim = searchQuery && !isMatchSearch(subject);

                    return (
                      <td
                        key={p}
                        className="py-2.5 px-2 border-r border-slate-200 last:border-r-0 align-top"
                      >
                        <div
                          className={`p-2 rounded-xl border text-[11px] transition-all min-h-[58px] flex flex-col justify-between ${
                            cat.borderClass
                          } ${cat.cardBg} ${
                            isMatch ? 'ring-2 ring-blue-500 shadow-sm scale-[1.02]' : 'shadow-2xs'
                          } ${isDim ? 'opacity-30' : 'opacity-100'}`}
                        >
                          <div className="font-bold text-slate-900 leading-snug line-clamp-2">
                            {subject}
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[10px]">
                            <span className={`px-1 py-0.2 rounded font-semibold ${cat.badgeBg} ${cat.badgeText}`}>
                              {cat.label}
                            </span>
                            {subject.startsWith('*') && (
                              <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
