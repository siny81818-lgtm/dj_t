import React from 'react';
import { Sparkles, AlertCircle, CalendarX } from 'lucide-react';
import { getTimetableData, getDeptName, checkNonClassDay } from '../data/timetableStore';
import { getSubjectCategory } from '../utils/subjectStyles';

interface WeeklyTimetableProps {
  currentDate: string; // YYYYMMDD
  grade: number;
  classNum: number;
  searchQuery?: string;
  onSelectDate: (dateStr: string) => void;
}

export const WeeklyTimetable: React.FC<WeeklyTimetableProps> = ({
  currentDate,
  grade,
  classNum,
  searchQuery = '',
  onSelectDate,
}) => {
  const deptName = getDeptName(grade, classNum);

  // 날짜 기반으로 해당 주의 월~금(1~5) 날짜 구하기
  const y = parseInt(currentDate.substring(0, 4), 10);
  const m = parseInt(currentDate.substring(4, 6), 10) - 1;
  const d = parseInt(currentDate.substring(6, 8), 10);
  const currentObj = new Date(y, m, d);

  const currentDayOfWeek = currentObj.getDay(); // 0:일, 1:월, ... 6:토
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(currentObj);
  monday.setDate(currentObj.getDate() + mondayOffset);

  const weekDays = [0, 1, 2, 3, 4].map((offset) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + offset);
    const ymd = `${day.getFullYear()}${String(day.getMonth() + 1).padStart(2, '0')}${String(
      day.getDate()
    ).padStart(2, '0')}`;
    const dayNames = ['월', '화', '수', '목', '금'];
    const nonClassInfo = checkNonClassDay(ymd);
    return {
      date: day,
      ymd,
      dayName: dayNames[offset],
      nonClassInfo,
      isCurrent: ymd === currentDate,
    };
  });

  // 요일별 시간표 데이터 가져오기
  const weekTimetableData = weekDays.map((w) => {
    const dayEntries = getTimetableData({
      date: w.ymd,
      grade,
      classNum,
    });
    const periodMap = new Map<number, string>();
    dayEntries.forEach((e) => periodMap.set(e.period, e.subject));
    return {
      ...w,
      periodMap,
      hasClasses: dayEntries.length > 0,
    };
  });

  // 이번 주 전체가 방학인지 체크
  const isEntireWeekVacation = weekTimetableData.every((w) => w.nonClassInfo.isNonClass);

  const periods = [1, 2, 3, 4, 5, 6, 7];

  const isMatchSearch = (subj: string) => {
    if (!searchQuery) return true;
    return subj.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {grade}학년 {classNum}반 주간 시간표
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {deptName}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {weekDays[0].ymd.substring(4, 6)}월 {weekDays[0].ymd.substring(6, 8)}일(월) ~{' '}
            {weekDays[4].ymd.substring(4, 6)}월 {weekDays[4].ymd.substring(6, 8)}일(금) 주간 일정표
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span>선택한 요일: {weekDays.find(w => w.isCurrent)?.dayName || '월'}요일</span>
        </div>
      </div>

      {isEntireWeekVacation ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center space-y-3">
          <CalendarX className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            해당 주간에는 시간표 정보가 없습니다 (주말, 공휴일 또는 방학).
          </h3>
          <p className="text-xs text-slate-600">
            주말, 공휴일, 개교기념일 또는 방학 기간에는 시간표가 제공되지 않습니다.
          </p>
        </div>
      ) : (
        /* Table Container */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200">
                  <th className="py-3 px-3 sm:px-4 text-xs font-bold text-slate-600 w-16 text-center border-r border-slate-200">
                    교시
                  </th>
                  {weekTimetableData.map((day) => (
                    <th
                      key={day.ymd}
                      onClick={() => onSelectDate(day.ymd)}
                      className={`py-3 px-3 sm:px-4 text-center cursor-pointer transition-colors border-r border-slate-200 last:border-r-0 ${
                        day.isCurrent
                          ? 'bg-blue-50 text-blue-900 font-extrabold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold">
                          {day.dayName}요일
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {day.ymd.substring(4, 6)}.{day.ymd.substring(6, 8)}
                        </span>
                        {day.isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-600 text-white font-bold mt-1">
                            선택됨
                          </span>
                        )}
                        {day.nonClassInfo.isNonClass && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold mt-1 truncate max-w-[100px]">
                            {day.nonClassInfo.reason}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {periods.map((p) => {
                  return (
                    <tr key={p} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-2 sm:px-3 text-center bg-slate-50/70 border-r border-slate-200 font-bold text-xs text-slate-700">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-extrabold text-blue-700">{p}</span>
                          <span className="text-[10px] text-slate-400 font-normal">교시</span>
                        </div>
                      </td>

                      {weekTimetableData.map((day) => {
                        const isNonClass = day.nonClassInfo.isNonClass;
                        const subject = day.periodMap.get(p) || (isNonClass ? '-' : '수업 없음');
                        const cat = getSubjectCategory(subject);
                        const isMatch = searchQuery && isMatchSearch(subject);
                        const isDim = searchQuery && !isMatchSearch(subject);

                        return (
                          <td
                            key={day.ymd}
                            className={`py-2 px-2.5 sm:px-3 border-r border-slate-200 last:border-r-0 align-top ${
                              day.isCurrent ? 'bg-blue-50/30' : ''
                            } ${isNonClass ? 'bg-slate-50/60' : ''}`}
                          >
                            {isNonClass ? (
                              <div className="p-3 text-center text-xs text-slate-400 italic">
                                {p === 1 ? day.nonClassInfo.reason : '-'}
                              </div>
                            ) : (
                              <div
                                className={`p-2.5 rounded-xl border text-xs transition-all h-full flex flex-col justify-between ${
                                  cat.borderClass
                                } ${cat.cardBg} ${
                                  isMatch ? 'ring-2 ring-blue-500 shadow-md scale-[1.02]' : 'shadow-2xs'
                                } ${isDim ? 'opacity-30' : 'opacity-100'}`}
                              >
                                <div>
                                  <div className="font-bold text-slate-900 leading-tight">
                                    {subject}
                                  </div>
                                  {subject.startsWith('*') && (
                                    <div className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5 mt-1">
                                      <Sparkles className="w-2.5 h-2.5" />
                                      <span>NCS 실습</span>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                  <span
                                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${cat.badgeBg} ${cat.badgeText}`}
                                  >
                                    {cat.label}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {p}교시
                                  </span>
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
