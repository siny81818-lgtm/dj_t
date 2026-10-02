import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TimetableControls } from './components/TimetableControls';
import { DailyTimetable } from './components/DailyTimetable';
import { WeeklyTimetable } from './components/WeeklyTimetable';
import { AllClassesView } from './components/AllClassesView';
import { SchoolInfoBanner } from './components/SchoolInfoBanner';
import { PrdModal } from './components/PrdModal';
import { NeisConfigModal } from './components/NeisConfigModal';
import { AssignmentModal } from './components/AssignmentModal';
import { AssignmentList } from './components/AssignmentList';
import { getTimetableData } from './data/timetableStore';
import { fetchNeisTimetable } from './services/neisApi';
import { TimetableEntry } from './types/timetable';
import { Assignment } from './types/assignment';
import { School, FileText, ClipboardList, Plus } from 'lucide-react';

export default function App() {
  const [currentDate, setCurrentDate] = useState<string>('20260309');
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedClass, setSelectedClass] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'allClasses'>('daily');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataSourceText, setDataSourceText] = useState<string>('학사 데이터셋');

  // 과제 상태 (LocalStorage 연동)
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('school_assignments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // 기본 샘플 과제 몇 개 제공
    return [
      {
        id: 'as-1',
        grade: 1,
        classNum: 1,
        subject: '* 하드웨어 회로 설계',
        title: '오류회로 디버깅 실습 보고서',
        description: '실습실 2호기 오실로스코프 파형 측정 데이터 첨부 필수',
        dueDate: '2026-03-15',
        completed: false,
        createdAt: '2026-03-10',
      },
      {
        id: 'as-2',
        grade: 1,
        classNum: 1,
        subject: '공통영어1',
        title: 'Unit 2 Vocabulary Worksheet',
        description: '워크북 18페이지까지 풀고 단어 암기하기',
        dueDate: '2026-03-12',
        completed: true,
        createdAt: '2026-03-09',
      },
    ];
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('neis_api_key') || '';
  });

  const [favoriteClass, setFavoriteClass] = useState<{ grade: number; classNum: number } | null>(() => {
    const saved = localStorage.getItem('fav_class');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isPrdOpen, setIsPrdOpen] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState<boolean>(false);
  const [modalDefaultSubject, setModalDefaultSubject] = useState<string>('');

  // 과제 저장 시 LocalStorage 동기화
  useEffect(() => {
    localStorage.setItem('school_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // 즐겨찾기 설정이 있으면 초기 로드 시 반영
  useEffect(() => {
    if (favoriteClass) {
      setSelectedGrade(favoriteClass.grade);
      setSelectedClass(favoriteClass.classNum);
    }
  }, []);

  const handleSetFavorite = (grade: number, classNum: number) => {
    if (favoriteClass && favoriteClass.grade === grade && favoriteClass.classNum === classNum) {
      setFavoriteClass(null);
      localStorage.removeItem('fav_class');
    } else {
      const fav = { grade, classNum };
      setFavoriteClass(fav);
      localStorage.setItem('fav_class', JSON.stringify(fav));
    }
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('neis_api_key', key);
    } else {
      localStorage.removeItem('neis_api_key');
    }
  };

  const handleGoToSchoolDay = () => {
    setCurrentDate('20260309');
  };

  const handleSaveAssignment = (newAs: Omit<Assignment, 'id' | 'createdAt' | 'completed'>) => {
    const created: Assignment = {
      ...newAs,
      id: 'as-' + Date.now(),
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAssignments((prev) => [created, ...prev]);
  };

  const handleToggleComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const handleDeleteAssignment = (id: string) => {
    if (window.confirm('정말 이 과제를 삭제하시겠습니까?')) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleOpenAddModalWithSubject = (subjectName?: string) => {
    setModalDefaultSubject(subjectName || '');
    setIsAssignmentModalOpen(true);
  };

  // 시간표 데이터 로드 함수
  const loadTimetable = useCallback(async () => {
    setIsLoading(true);

    if (apiKey) {
      try {
        const res = await fetchNeisTimetable({
          date: currentDate,
          grade: viewMode === 'allClasses' ? undefined : selectedGrade,
          classNum: viewMode === 'allClasses' ? undefined : selectedClass,
          apiKey,
        });

        if (res.success && res.data && res.data.length > 0) {
          setTimetableEntries(res.data);
          setDataSourceText('NEIS 실시간 API');
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('NEIS API fallback to local store:', err);
      }
    }

    // 로컬 학사 데이터셋에서 추출
    const localData = getTimetableData({
      date: currentDate,
      grade: selectedGrade,
      classNum: viewMode === 'allClasses' ? undefined : selectedClass,
    });

    setTimetableEntries(localData);
    setDataSourceText('학사 데이터셋');
    setIsLoading(false);
  }, [currentDate, selectedGrade, selectedClass, viewMode, apiKey]);

  useEffect(() => {
    loadTimetable();
  }, [loadTimetable]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onOpenPrd={() => setIsPrdOpen(true)}
        onOpenNeisConfig={() => setIsConfigOpen(true)}
        isApiConfigured={Boolean(apiKey)}
        onRefresh={loadTimetable}
        isLoading={isLoading}
        dataSourceText={dataSourceText}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-5">
        {/* School Department Overview Card */}
        <SchoolInfoBanner />

        {/* Timetable Controller */}
        <TimetableControls
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          selectedGrade={selectedGrade}
          onGradeChange={setSelectedGrade}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          favoriteClass={favoriteClass}
          onSetFavorite={handleSetFavorite}
        />

        {/* Assignments List Component */}
        <AssignmentList
          assignments={assignments}
          grade={selectedGrade}
          classNum={selectedClass}
          onToggleComplete={handleToggleComplete}
          onDeleteAssignment={handleDeleteAssignment}
          onOpenAddModal={() => handleOpenAddModalWithSubject()}
        />

        {/* View Modes */}
        {viewMode === 'daily' && (
          <DailyTimetable
            entries={timetableEntries}
            grade={selectedGrade}
            classNum={selectedClass}
            dateStr={currentDate}
            searchQuery={searchQuery}
            onGoToSchoolDay={handleGoToSchoolDay}
            onAddAssignmentForSubject={handleOpenAddModalWithSubject}
          />
        )}

        {viewMode === 'weekly' && (
          <WeeklyTimetable
            currentDate={currentDate}
            grade={selectedGrade}
            classNum={selectedClass}
            searchQuery={searchQuery}
            onSelectDate={(newDate) => {
              setCurrentDate(newDate);
              setViewMode('daily');
            }}
          />
        )}

        {viewMode === 'allClasses' && (
          <AllClassesView
            currentDate={currentDate}
            grade={selectedGrade}
            searchQuery={searchQuery}
            onSelectClass={(classNum) => {
              setSelectedClass(classNum);
              setViewMode('daily');
            }}
            onGoToSchoolDay={handleGoToSchoolDay}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <School className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">대진전자통신고등학교 실시간 시간표 및 과제 관리 서비스</span>
            <span>·</span>
            <span>부산광역시교육청</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPrdOpen(true)}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PRD 기획서 열람</span>
            </button>
            <button
              onClick={() => setIsConfigOpen(true)}
              className="text-slate-600 hover:text-slate-900"
            >
              NEIS API 설정
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PrdModal isOpen={isPrdOpen} onClose={() => setIsPrdOpen(false)} />
      <NeisConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        currentDate={currentDate}
        grade={selectedGrade}
        classNum={selectedClass}
      />
      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        grade={selectedGrade}
        classNum={selectedClass}
        defaultSubject={modalDefaultSubject}
        onSaveAssignment={handleSaveAssignment}
      />
    </div>
  );
}
