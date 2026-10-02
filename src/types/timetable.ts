import { useState, useEffect } from 'react';

export interface TimetableEntry {
  ay: string; // 학년도 e.g. "2026"
  sem: string; // 학기 e.g. "1"
  date: string; // YYYYMMDD e.g. "20260309"
  grade: number; // 1, 2, 3
  dept: string; // 학과명 e.g. "전기전자과"
  classNum: number; // 학급(반) e.g. 1
  period: number; // 교시 1~7
  subject: string; // 수업내용 / 과목명
}

export interface TimetableDay {
  date: string; // YYYYMMDD
  formattedDate: string; // YYYY-MM-DD
  dayOfWeek: string; // 월, 화, 수, 목, 금, 토, 일
  isSpecialDay?: boolean; // 방학, 휴업일, 공휴일 등
  specialNote?: string;
  entries: TimetableEntry[];
}

export interface DepartmentInfo {
  id: string;
  name: string;
  grades: number[];
  classes: number[];
  color: string;
  badgeBg: string;
  badgeText: string;
}

export const SCHOOL_INFO = {
  officeCode: 'C10',
  officeName: '부산광역시교육청',
  schoolCode: '7150597',
  schoolName: '대진전자통신고등학교',
  address: '부산광역시 금정구 금사동',
  type: '특성화고등학교 (공업계)',
  departments: [
    { name: '전기전자과', classes: [1, 2, 3], color: 'indigo' },
    { name: 'AI소프트웨어과', classes: [4, 5], color: 'cyan' },
    { name: '컴퓨터소프트웨어과', classes: [4, 5], color: 'blue' },
    { name: '스마트콘텐츠과', classes: [6, 7, 8], color: 'emerald' },
    { name: '산업디자인과', classes: [9, 10], color: 'amber' },
  ]
};
