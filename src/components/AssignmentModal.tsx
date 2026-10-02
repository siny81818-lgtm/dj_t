import React, { useState } from 'react';
import { X, ClipboardList, Calendar, CheckSquare } from 'lucide-react';
import { Assignment } from '../types/assignment';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: number;
  classNum: number;
  defaultSubject?: string;
  onSaveAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'completed'>) => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  grade,
  classNum,
  defaultSubject = '',
  onSaveAssignment,
}) => {
  const [subject, setSubject] = useState(defaultSubject);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3); // 기본 마감일 3일 뒤
    return d.toISOString().split('T')[0];
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !title.trim()) {
      alert('과목명과 과제 제목을 입력해주세요.');
      return;
    }

    onSaveAssignment({
      grade,
      classNum,
      subject: subject.trim(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                과제 등록하기
              </h2>
              <p className="text-xs text-slate-500">
                {grade}학년 {classNum}반 · 과목별 숙제 및 프로젝트
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">과목명</label>
            <input
              type="text"
              placeholder="예: 하드웨어 회로 설계, 프로그래밍, 공통영어1"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">과제 제목</label>
            <input
              type="text"
              placeholder="예: 3주차 실습 보고서 제출"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">마감일</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">상세 내용 및 준비물 (선택)</label>
            <textarea
              placeholder="과제 요구사항, 참고 문서, 제출 방식 등을 입력하세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
