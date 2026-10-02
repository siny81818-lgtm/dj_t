import React from 'react';
import { ClipboardCheck, Trash2, CheckCircle2, Circle, Calendar, Plus } from 'lucide-react';
import { Assignment } from '../types/assignment';

interface AssignmentListProps {
  assignments: Assignment[];
  grade: number;
  classNum: number;
  onToggleComplete: (id: string) => void;
  onDeleteAssignment: (id: string) => void;
  onOpenAddModal: () => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  grade,
  classNum,
  onToggleComplete,
  onDeleteAssignment,
  onOpenAddModal,
}) => {
  // 현재 학년-반에 해당하는 과제만 필터링
  const classAssignments = assignments.filter(
    (a) => a.grade === grade && a.classNum === classNum
  );

  // D-day 계산 함수
  const getDday = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day';
    if (diffDays > 0) return `D-${diffDays}`;
    return `마감됨`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              과목별 과제 및 프로젝트 관리
            </h3>
            <p className="text-xs text-slate-500">
              {grade}학년 {classNum}반 등록된 과제 ({classAssignments.length}건)
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>과제 등록</span>
        </button>
      </div>

      {classAssignments.length === 0 ? (
        <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-500 text-xs">
          등록된 과제가 없습니다. 우측 상단 <strong>[과제 등록]</strong> 버튼을 눌러 과목별 과제를 추가해보세요!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {classAssignments.map((assignment) => {
            const dDay = getDday(assignment.dueDate);
            const isUrgent = dDay.startsWith('D-') && parseInt(dDay.replace('D-', ''), 10) <= 2;
            const isPassed = dDay === '마감됨';

            return (
              <div
                key={assignment.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                  assignment.completed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 shadow-2xs hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2.5">
                    <button
                      onClick={() => onToggleComplete(assignment.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {assignment.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {assignment.subject}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            isPassed
                              ? 'bg-slate-200 text-slate-600'
                              : isUrgent
                              ? 'bg-rose-100 text-rose-700 animate-pulse'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {dDay}
                        </span>
                      </div>
                      <h4
                        className={`text-sm font-bold mt-1 ${
                          assignment.completed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {assignment.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteAssignment(assignment.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="과제 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {assignment.description && (
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    {assignment.description}
                  </p>
                )}

                <div className="pl-7 pt-1 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>마감일: {assignment.dueDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
