import React, { useState } from 'react';
import { X, Key, CheckCircle, AlertCircle, RefreshCw, Globe, ExternalLink } from 'lucide-react';
import { DEFAULT_NEIS_CONFIG, fetchNeisTimetable } from '../services/neisApi';

interface NeisConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  currentDate: string;
  grade: number;
  classNum: number;
}

export const NeisConfigModal: React.FC<NeisConfigModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  currentDate,
  grade,
  classNum,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success?: boolean;
    message?: string;
    count?: number;
  }>({ tested: false });
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    onClose();
  };

  const handleTestApi = async () => {
    setIsTesting(true);
    setTestResult({ tested: false });
    const res = await fetchNeisTimetable({
      date: currentDate,
      grade,
      classNum,
      apiKey: inputKey.trim(),
    });
    setIsTesting(false);
    setTestResult({
      tested: true,
      success: res.success,
      message: res.message || (res.success ? `총 ${res.data?.length || 0}개 교시 데이터를 성공적으로 수신했습니다.` : '데이터 없음'),
      count: res.data?.length,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                NEIS 나이스 오픈API 연동 설정
              </h2>
              <p className="text-xs text-slate-500">
                한국교육학술정보원(KERIS) NEIS 시간표 Open API
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Target School Info */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">대상 학교명:</span>
              <span className="font-bold text-slate-800">{DEFAULT_NEIS_CONFIG.schoolName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">시도교육청코드:</span>
              <span className="font-mono font-bold text-blue-600">{DEFAULT_NEIS_CONFIG.officeCode} (부산)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">행정표준코드:</span>
              <span className="font-mono font-bold text-blue-600">{DEFAULT_NEIS_CONFIG.schoolCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">API 엔드포인트:</span>
              <span className="font-mono text-[11px] text-slate-600">/hub/hisTimetable</span>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              NEIS 인증키 (선택사항)
            </label>
            <input
              type="text"
              placeholder="NEIS OpenAPI 인증키 (미입력 시 기본 학사 데이터 모드 동작)"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 leading-tight">
              * 키가 없어도 제공해주신 실제 대진전자통신고등학교 1~3학년 정규 시간표 데이터셋이 완벽하게 로컬 동작합니다.
            </p>
          </div>

          {/* Test Call Section */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                실시간 API 호출 테스트 ({currentDate}, {grade}학년 {classNum}반)
              </span>
              <button
                onClick={handleTestApi}
                disabled={isTesting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>API 호출 테스트</span>
              </button>
            </div>

            {testResult.tested && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{testResult.success ? '통신 성공' : '알림'}</p>
                  <p className="text-[11px] mt-0.5">{testResult.message}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-800">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>나이스 교육정보 개방포털 바로가기</span>
            </span>
            <a
              href="https://open.neis.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5"
            >
              <span>포털 이동</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};
