import { TimetableEntry } from '../types/timetable';

export interface NeisTimetableRow {
  ATPT_OFCDC_SC_CODE: string; // C10
  ATPT_OFCDC_SC_NM: string;   // 부산광역시교육청
  SD_SCHUL_CODE: string;      // 7150597
  SCHUL_NM: string;           // 대진전자통신고등학교
  AY: string;                 // 2026
  SEM: string;                // 1
  ALL_TI_YMD: string;         // 20260309
  DGHT_CRSE_SC_NM: string;    // 주간
  ORD_SC_NM: string;          // 공업계
  DDDEP_NM: string;           // 전기전자과 등
  GRADE: string;              // 1
  CLRM_NM: string;            // 1
  CLASS_NM: string;           // 1
  PERIO: string;              // 1
  ITRT_CNTNT: string;         // 수업내용
  LOAD_DTM: string;
}

export interface NeisApiResponse {
  hisTimetable?: [
    {
      head: [
        { list_total_count: number },
        { RESULT: { CODE: string; MESSAGE: string } }
      ];
    },
    {
      row: NeisTimetableRow[];
    }
  ];
  RESULT?: {
    CODE: string;
    MESSAGE: string;
  };
}

export const DEFAULT_NEIS_CONFIG = {
  officeCode: 'C10',
  schoolCode: '7150597',
  schoolName: '대진전자통신고등학교',
  apiKey: '', // 사용자가 입력 가능
};

/**
 * NEIS 오픈API 실시간 고등학교 시간표(hisTimetable) 호출
 */
export async function fetchNeisTimetable(params: {
  date: string; // YYYYMMDD
  grade?: number;
  classNum?: number;
  apiKey?: string;
}): Promise<{ success: boolean; data?: TimetableEntry[]; message?: string; fromApi?: boolean }> {
  const { date, grade, classNum, apiKey } = params;
  const key = apiKey || DEFAULT_NEIS_CONFIG.apiKey;

  // 년도/학기 계산
  const year = date.substring(0, 4);
  const month = parseInt(date.substring(4, 6), 10);
  // 한국 학기 기준: 3월~7월=1학기, 8월~다음해 2월=2학기
  const ay = month <= 2 ? String(parseInt(year, 10) - 1) : year;
  const sem = (month >= 3 && month <= 7) ? '1' : '2';

  const query = new URLSearchParams({
    Type: 'json',
    pIndex: '1',
    pSize: '100',
    ATPT_OFCDC_SC_CODE: DEFAULT_NEIS_CONFIG.officeCode,
    SD_SCHUL_CODE: DEFAULT_NEIS_CONFIG.schoolCode,
    AY: ay,
    SEM: sem,
    ALL_TI_YMD: date,
  });

  if (key) {
    query.set('KEY', key);
  }
  if (grade) {
    query.set('GRADE', String(grade));
  }
  if (classNum) {
    query.set('CLASS_NM', String(classNum));
  }

  const directUrl = `https://open.neis.go.kr/hub/hisTimetable?${query.toString()}`;

  try {
    // 1차: 직접 fetch 시도
    let res: Response;
    try {
      res = await fetch(directUrl, { method: 'GET' });
    } catch {
      // 2차: CORS Proxy fallback
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`;
      res = await fetch(proxyUrl);
    }

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const json: NeisApiResponse = await res.json();

    if (json.RESULT) {
      // 에러 응답
      return {
        success: false,
        message: `NEIS API 응답 (${json.RESULT.CODE}): ${json.RESULT.MESSAGE}`,
      };
    }

    if (json.hisTimetable && json.hisTimetable[1]?.row) {
      const rows = json.hisTimetable[1].row;
      const entries: TimetableEntry[] = rows.map((r) => ({
        ay: r.AY,
        sem: r.SEM,
        date: r.ALL_TI_YMD,
        dept: r.DDDEP_NM || '',
        grade: parseInt(r.GRADE, 10),
        classNum: parseInt(r.CLASS_NM, 10),
        period: parseInt(r.PERIO, 10),
        subject: r.ITRT_CNTNT || '',
      }));

      return {
        success: true,
        data: entries,
        fromApi: true,
      };
    }

    return {
      success: false,
      message: '해당 날짜에 NEIS 시간표 데이터가 없습니다.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'NEIS API 통신 중 오류가 발생했습니다.',
    };
  }
}
