export interface Event {
  id: string;
  date: string;
  time?: string;
  endTime?: string;
  team: string;
  status: 'reserved' | 'in-use' | 'completed';
  participants?: string;
  target?: string;
  shots?: number;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

export const teams: Team[] = [
  {
    id: '1',
    name: '第一研究班',
    members: [
      { id: '101', name: '佐藤 太郎' },
      { id: '102', name: '田中 花子' },
      { id: '103', name: '鈴木 一郎' }
    ]
  },
  {
    id: '2',
    name: '第二研究班',
    members: [
      { id: '201', name: '高橋 次郎' },
      { id: '202', name: '伊藤 真理' }
    ]
  },
  {
    id: '3',
    name: '第三研究班',
    members: [
      { id: '301', name: '渡辺 健太' },
      { id: '302', name: '佐々木 美咲' },
      { id: '303', name: '小林 隆' }
    ]
  },
  {
    id: '4',
    name: '環境分析チーム',
    members: [
      { id: '401', name: '加藤 誠' },
      { id: '402', name: '山本 恵' }
    ]
  },
  {
    id: '5',
    name: '材料研究班',
    members: [
      { id: '501', name: '中村 大輔' },
      { id: '502', name: '斎藤 裕子' },
      { id: '503', name: '松本 拓也' }
    ]
  }
];

export const events: Event[] = [
  {
    id: '1',
    date: '2024-10-15',
    time: '10:00',
    endTime: '12:00',
    team: '第一研究班',
    status: 'reserved',
  },
  {
    id: '2',
    date: '2024-10-16',
    time: '14:30',
    endTime: '16:30',
    team: '第二研究班',
    status: 'in-use',
  },
  {
    id: '3',
    date: '2024-10-10',
    time: '09:15',
    endTime: '11:45',
    team: '第三研究班',
    status: 'completed',
    participants: '田中、佐藤、鈴木',
    target: '鉱物サンプルA-123',
    shots: 56,
    notes: '特に異常なし。サンプルは標準的な反応を示した。',
  },
  {
    id: '4',
    date: '2024-10-17',
    time: '13:00',
    endTime: '15:00',
    team: '環境分析チーム',
    status: 'reserved',
  },
  {
    id: '5',
    date: '2024-10-20',
    time: '15:45',
    endTime: '17:30',
    team: '材料研究班',
    status: 'reserved',
  }
];

let localEvents = [...events];
let localTeams = [...teams];

export const getEvents = () => {
  return localEvents;
};

export const addEvent = (event: Event) => {
  localEvents = [...localEvents, event];
  return localEvents;
};

export const updateEvent = (event: Event) => {
  localEvents = localEvents.map(e => e.id === event.id ? event : e);
  return localEvents;
};

export const deleteEvent = (id: string) => {
  localEvents = localEvents.filter(e => e.id !== id);
  return localEvents;
};

export const getTeams = () => {
  return localTeams;
};

export const getTeamById = (id: string) => {
  return localTeams.find(team => team.id === id);
};

export const getTeamByName = (name: string) => {
  return localTeams.find(team => team.name === name);
};

export const addTeam = (team: Team) => {
  localTeams = [...localTeams, team];
  return localTeams;
};

export const updateTeam = (team: Team) => {
  localTeams = localTeams.map(t => t.id === team.id ? team : t);
  return localTeams;
};

export const deleteTeam = (id: string) => {
  localTeams = localTeams.filter(t => t.id !== id);
  return localTeams;
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
}; 