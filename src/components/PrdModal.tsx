import React, { useState } from 'react';
import { X, Copy, Check, FileText, Download } from 'lucide-react';

interface PrdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrdModal: React.FC<PrdModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const prdMarkdown = `# [PRD] 대진전자통신고등학교 실시간 시간표 조회 서비스

## 1. 프로젝트 개요 (Overview)
- **프로젝트명**: 대진전자통신고등학교 실시간 시간표 조회 웹 서비스
- **대상 학교**: 대진전자통신고등학교 (시도교육청코드: C10 / 행정표준코드: 7150597)
- **목적**: NEIS(나이스) 교육정보 개방포털의 고등학교 시간표 Open API 및 학교 학사 데이터를 기반으로, 학생·학부모·교직원이 날짜별, 학년별, 학과별 시간표를 모바일과 PC에서 즉각적이고 직관적으로 조회할 수 있는 고성능 반응형 웹 애플리케이션 구축.

---

## 2. 배경 및 기획 의도 (Background & Goals)
1. **특성화고등학교(공업계) 맞춤형 시간표**:
   - 전기전자과, AI소프트웨어과, 스마트콘텐츠과, 산업디자인과 등 학과별 전공실습(* NCS 과목), 일반 보통교과, 창의적 체험활동(동아리, 진로, 자율, 봉사)이 다채롭게 구성됨.
2. **실시간 학사일정 및 보강 반영**:
   - 신정, 토요휴업일, 겨울방학, 졸업식, 보강 수업 등 유동적인 학사 변동을 실시간으로 파악 필요.
3. **사용자 접근성 극대화**:
   - 별도 앱 설치나 복잡한 본인인증 없이 웹 브라우저에서 '내 반'을 저장해두고 즉시 확인할 수 있는 초경량 반응형 UX 제공.

---

## 3. 타깃 사용자 페르소나 (Target Personas)
- **재학생 (1~3학년)**: 매일 아침 교과서/실습 도구 준비를 위해 당일 시간표 및 주간 시간표 확인, [내 반 즐겨찾기]로 1초 접속.
- **교직원**: 특정 일자의 전체 학급(1~10반) 수업 현황 비교 및 보강/특활 시간 확인.
- **학부모**: 자녀의 학년/학급별 주간 수업 흐름 및 학사 일정(방학, 졸업식 등) 확인.

---

## 4. 핵심 기능 명세서 (Key Features)

### 4.1 날짜별 시간표 조회 (Date Navigation)
- **DatePicker 및 이동 컨트롤**: 이전 날 / 다음 날 / 오늘 버튼, 특정 일자 직접 선택.
- **학사 특이일 안내 배너**: 방학, 졸업식, 공휴일, 토요휴업일 자동 감지 및 안내.
- **교시별 시간표 타임라인**: 1~7교시(09:00~16:40), 점심시간(12:50~13:50), 종례 및 청소 시간대 시각화.

### 4.2 다차원 뷰 모드 (Multi-View Modes)
1. **일간 뷰 (Daily View)**:
   - 교시별 카드, 수업 과목, NCS 실습 배지, 과목 카테고리(전공/보통/창체/학사) 태그, 보강 표시, 인쇄/PDF 기능.
2. **주간 뷰 (Weekly View)**:
   - 월요일부터 금요일까지 주간 전체 시간표를 테이블 그리드로 한눈에 조망.
3. **전 학급 비교 뷰 (All Classes Matrix)**:
   - 선택한 일자에 대해 해당 학년 1반~10반의 1~7교시 전체를 가로 비교 매트릭스로 제공.

### 4.3 학년 및 학과/반 필터링
- **1학년**: 전기전자과(1~3반), AI소프트웨어과(4~5반), 스마트콘텐츠과(6~8반), 산업디자인과(9~10반)
- **2학년**: 전기전자과(1~3반), AI소프트웨어과/컴퓨터소프트웨어과(4~5반), 스마트콘텐츠과(6~8반), 산업디자인과(9~10반)
- **3학년**: 전기전자과(1~3반), 컴퓨터소프트웨어과(4~5반), 스마트콘텐츠과(6~8반), 산업디자인과(9~10반)
- **내 학급 즐겨찾기**: LocalStorage에 '내 학년-반'을 저장하여 재방문 시 자동 기본값 지정.

### 4.4 과목 실시간 검색 및 하이라이트
- 검색어 입력 시 해당 과목 카드 하이라이트 및 비매칭 카드 투명도 조절로 직관적 식별 지원.

### 4.5 NEIS OpenAPI 실시간 연동 모듈
- NEIS 고등학교 시간표 API (\`hisTimetable\`) 연동 규격 준수.
- 사용자 지정 API KEY 입력 콘솔 및 실시간 API 호출 테스트 지원.
- 오프라인/네트워크 불안정 시에도 내장 학사 데이터셋과 매끄러운 하이브리드 폴백(Fallback).

---

## 5. 기술 스택 및 아키텍처 (Tech Stack & Architecture)
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **API 연동**: NEIS Open API (\`https://open.neis.go.kr/hub/hisTimetable\`)
- **반응형 디자인**: Mobile First (360px ~ 4K 해상도 지원)
- **상태 관리**: React State, LocalStorage (내 학급 즐겨찾기)

---

## 6. 기대 효과 및 향후 로드맵
- **1단계 (현재)**: 반응형 시간표 뷰어, NEIS API 연동, 학과별 필터, 전 학급 비교 매트릭스 완성.
- **2단계**: NEIS 학교 급식(식단) API 연계 (당일 점심 메뉴 동시 표시).
- **3단계**: 학사일정 캘린더 및 학사 공지사항 위젯 추가.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(prdMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([prdMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '대진전자통신고_시간표_PRD.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                제품 요구사항 정의서 (PRD)
              </h2>
              <p className="text-xs text-slate-500">
                대진전자통신고등학교 실시간 시간표 반응형 웹 서비스 기획 문서
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>마크다운 복사</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors shadow-2xs hidden sm:flex"
              title="파일 다운로드"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>다운로드</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Styled Document */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-sm leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <h3 className="text-base font-bold text-blue-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> 1. 프로젝트 개요 (Project Overview)
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li><strong>프로젝트명:</strong> 대진전자통신고등학교 실시간 시간표 조회 웹 서비스</li>
              <li><strong>대상 학교:</strong> 대진전자통신고등학교 (부산광역시교육청 C10 / 행정표준코드 7150597)</li>
              <li><strong>목적:</strong> NEIS(나이스) 교육정보 개방포털 Open API 및 학사 데이터를 연동하여, 날짜별·학급별·학과별 시간표를 직관적으로 조회하는 반응형 웹 서비스</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span> 2. 타깃 사용자 & 페르소나
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">👨‍🎓 재학생 (1~3학년)</h4>
                <p className="text-slate-600">
                  전기전자, AI소프트웨어, 스마트콘텐츠, 산업디자인과 학생이 매일 등교 전 당일 교시 및 NCS 전공 실습/보강을 빠르게 확인.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">👩‍🏫 교직원</h4>
                <p className="text-slate-600">
                  특정 날짜의 전체 학급(1~10반) 시간표를 비교 조회하여 보강, 특별실 사용, 행사 일정을 원활하게 조율.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">👪 학부모</h4>
                <p className="text-slate-600">
                  자녀 학급의 주간 수업 일정 및 방학, 졸업식 등 주요 학사 일정을 투명하게 파악.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 3. 핵심 기능 명세
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <strong>1) 날짜별 실시간 시간표 조회:</strong> 캘린더/일자 선택기를 통해 과거/현재/미래 날짜별 1~7교시 시간표 및 교시별 시간대(09:00~16:40) 표시.
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <strong>2) 3대 뷰 모드 지원:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-slate-600">
                  <li><strong>일간 뷰(Daily):</strong> 교시별 상세 타임라인, 과목 분류 배지(전공/보통/창체/학사), NCS 실습 배지, 보강 태그</li>
                  <li><strong>주간 뷰(Weekly):</strong> 월~금 요일별 1~7교시 통합 테이블 그리드</li>
                  <li><strong>전 학급 뷰(All Classes):</strong> 1반부터 10반까지 모든 학급의 일정을 가로로 비교</li>
                </ul>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <strong>3) 학과 및 학급 구조 자동 매핑:</strong> 1~3반(전기전자과), 4~5반(AI/컴퓨터소프트웨어과), 6~8반(스마트콘텐츠과), 9~10반(산업디자인과) 정밀 배정.
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <strong>4) 편의 기능:</strong> '내 반 즐겨찾기'(LocalStorage), 과목명 실시간 필터 검색, 인쇄 및 PDF 저장 레이아웃.
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <strong>5) NEIS OpenAPI 하이브리드 연동:</strong> NEIS API 엔드포인트(\`hisTimetable\`) 실시간 호출 및 오프라인 학사 데이터 캐싱 결합.
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span> 4. NEIS Open API 연동 규격
            </h3>
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-xs overflow-x-auto">
              <div>API URL: https://open.neis.go.kr/hub/hisTimetable</div>
              <div>시도교육청코드(ATPT_OFCDC_SC_CODE): C10 (부산광역시교육청)</div>
              <div>행정표준코드(SD_SCHUL_CODE): 7150597 (대진전자통신고등학교)</div>
              <div>파라미터: AY(학년도), SEM(학기), ALL_TI_YMD(시간표일자), GRADE(학년), CLASS_NM(학급명)</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            대진전자통신고등학교 시간표 웹 서비스 PRD v1.0
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
