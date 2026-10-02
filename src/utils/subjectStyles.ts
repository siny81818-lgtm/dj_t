export interface SubjectCategory {
  type: 'major' | 'general' | 'creative' | 'event';
  label: string;
  badgeBg: string;
  badgeText: string;
  borderClass: string;
  cardBg: string;
  iconName?: string;
}

export function getSubjectCategory(subjectName: string): SubjectCategory {
  if (!subjectName) {
    return {
      type: 'general',
      label: '일반',
      badgeBg: 'bg-slate-100 dark:bg-slate-800',
      badgeText: 'text-slate-700 dark:text-slate-300',
      borderClass: 'border-slate-200 dark:border-slate-700',
      cardBg: 'bg-white dark:bg-slate-900',
    };
  }

  // 방학 / 휴업 / 공휴일 / 졸업식
  if (
    subjectName.includes('방학') ||
    subjectName.includes('신정') ||
    subjectName.includes('휴업일') ||
    subjectName.includes('휴일') ||
    subjectName.includes('졸업식')
  ) {
    return {
      type: 'event',
      label: '학사일정',
      badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
      badgeText: 'text-rose-700 dark:text-rose-300',
      borderClass: 'border-rose-200 dark:border-rose-900/50',
      cardBg: 'bg-rose-50/50 dark:bg-rose-950/20',
    };
  }

  // 창의적 체험활동 (자율, 동아리, 봉사, 진로)
  if (
    subjectName.includes('자율') ||
    subjectName.includes('자치') ||
    subjectName.includes('동아리') ||
    subjectName.includes('봉사') ||
    subjectName.includes('진로')
  ) {
    return {
      type: 'creative',
      label: '창의체험',
      badgeBg: 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300',
      badgeText: 'text-violet-700 dark:text-violet-300',
      borderClass: 'border-violet-200 dark:border-violet-900/50',
      cardBg: 'bg-violet-50/40 dark:bg-violet-950/20',
    };
  }

  // 전공 실습 / NCS 과목 (* 로 시작하거나 특정 전공명 포함)
  if (
    subjectName.startsWith('*') ||
    subjectName.includes('프로그래밍') ||
    subjectName.includes('하드웨어') ||
    subjectName.includes('소프트웨어') ||
    subjectName.includes('인공지능') ||
    subjectName.includes('그래픽') ||
    subjectName.includes('디자인') ||
    subjectName.includes('애니메이션') ||
    subjectName.includes('게임') ||
    subjectName.includes('e스포츠') ||
    subjectName.includes('배관') ||
    subjectName.includes('공기압') ||
    subjectName.includes('PLC') ||
    subjectName.includes('전자제품') ||
    subjectName.includes('전자부품') ||
    subjectName.includes('정보 처리') ||
    subjectName.includes('컴퓨터 구조') ||
    subjectName.includes('디지털 논리') ||
    subjectName.includes('SQL') ||
    subjectName.includes('드론')
  ) {
    return {
      type: 'major',
      label: '전공실습',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
      badgeText: 'text-blue-700 dark:text-blue-300',
      borderClass: 'border-blue-200 dark:border-blue-800/60',
      cardBg: 'bg-blue-50/40 dark:bg-blue-950/20',
    };
  }

  // 보통교과 (국/영/수/사/과/예체능)
  return {
    type: 'general',
    label: '보통교과',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    borderClass: 'border-emerald-200 dark:border-emerald-800/50',
    cardBg: 'bg-emerald-50/30 dark:bg-emerald-950/15',
  };
}

export function formatYmdToKorean(ymd: string): { formatted: string; dayOfWeekText: string } {
  if (ymd.length !== 8) return { formatted: ymd, dayOfWeekText: '' };
  const y = parseInt(ymd.substring(0, 4), 10);
  const m = parseInt(ymd.substring(4, 6), 10);
  const d = parseInt(ymd.substring(6, 8), 10);
  const date = new Date(y, m - 1, d);
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayOfWeekText = days[date.getDay()];
  const formatted = `${y}년 ${m}월 ${d}일`;
  return { formatted, dayOfWeekText };
}
