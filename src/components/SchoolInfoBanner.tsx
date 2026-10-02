import React from 'react';
import { Cpu, Code2, Gamepad2, Palette, Sparkles } from 'lucide-react';

export const SchoolInfoBanner: React.FC = () => {
  const departments = [
    {
      name: '전기전자과',
      classes: '1반, 2반, 3반',
      icon: Cpu,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800',
      desc: '로봇 하드웨어 제작, 회로설계, PLC제어, 펌웨어 구현',
    },
    {
      name: 'AI소프트웨어과',
      classes: '4반, 5반',
      icon: Code2,
      color: 'from-cyan-600 to-blue-600',
      bgColor: 'bg-cyan-50 border-cyan-200',
      textColor: 'text-cyan-800',
      desc: '인공지능 일반, 데이터 라벨링, SQL활용, 화면 구현, 앱 개발',
    },
    {
      name: '스마트콘텐츠과',
      classes: '6반, 7반, 8반',
      icon: Gamepad2,
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-800',
      desc: '3D 애니메이팅, 게임 알고리즘, e스포츠 윤리, 라이브 방송, 드론',
    },
    {
      name: '산업디자인과',
      classes: '9반, 10반',
      icon: Palette,
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-800',
      desc: '비주얼 아이데이션, 만화 캐릭터 디자인, 컴퓨터 그래픽, 원형 디자인',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>대진전자통신고등학교 학과별 학급 편성 안내</span>
        </h3>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          총 10개 학급 · 공업계 특성화고
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <div
              key={dept.name}
              className={`p-3.5 rounded-xl border transition-all hover:shadow-xs ${dept.bgColor}`}
            >
              <div className="flex items-center space-x-2.5 mb-1.5">
                <div
                  className={`w-7 h-7 rounded-lg bg-gradient-to-br ${dept.color} text-white flex items-center justify-center shrink-0 shadow-2xs`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${dept.textColor}`}>
                    {dept.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-600">
                    {dept.classes}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                {dept.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
