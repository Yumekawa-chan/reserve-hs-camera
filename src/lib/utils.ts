import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Event, getTeamByName } from './firebaseData';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'reserved':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'in-use':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case 'reserved':
      return '予約中';
    case 'in-use':
      return '使用中';
    case 'completed':
      return '完了';
    default:
      return '不明';
  }
}

const teamColorCache: Record<string, { bg: string, border: string }> = {};

export async function getTeamColorAsync(teamName: string): Promise<{ bg: string, border: string }> {
  if (teamColorCache[teamName]) {
    return teamColorCache[teamName];
  }
  
  try {
    const team = await getTeamByName(teamName);
    
    if (team && team.color) {
      teamColorCache[teamName] = team.color;
      return team.color;
    }
  } catch (error) {
    console.error('Error getting team color:', error);
  }
  
  return getDefaultTeamColor(teamName);
}

export function getTeamColor(teamName: string): { bg: string, border: string } {
  if (teamColorCache[teamName]) {
    return teamColorCache[teamName];
  }
  
  const color = getDefaultTeamColor(teamName);
  teamColorCache[teamName] = color;
  return color;
}

function getDefaultTeamColor(teamName: string): { bg: string, border: string } {
  const hash = teamName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const hue = Math.abs(hash % 280);
  
  return { 
    bg: `hsl(${hue}, 70%, 60%)`, 
    border: `hsl(${hue}, 70%, 50%)` 
  };
}

export function updateTeamColorCache(teamName: string, color: { bg: string, border: string }): void {
  if (!teamName) return;
  teamColorCache[teamName] = { ...color };
}

export function resetTeamColorCache(): void {
  Object.keys(teamColorCache).forEach(key => {
    delete teamColorCache[key];
  });
}

export async function getTeamMembersStudentIds(teamName: string, participantsStr: string): Promise<string[]> {
  try {
    const team = await getTeamByName(teamName);
    if (!team) return [];
    
    const participants = participantsStr.split('、');
    const studentIds: string[] = [];
    
    for (const participant of participants) {
      const trimmedName = participant.trim();
      const member = team.members.find(m => m.name === trimmedName);
      if (member) {
        studentIds.push(member.studentId);
      }
    }
    
    return studentIds;
  } catch (error) {
    console.error('Error getting team members student IDs:', error);
    return [];
  }
}

export const exportToCsv = async (events: Event[]) => {
  const completedEvents = events.filter(event => event.status === 'completed');
  
  const headers = [
    '日付',
    '時間',
    '班名',
    '参加者',
    '学籍番号',
    '撮影対象',
    '撮影枚数',
    '備考'
  ];

  const rows = [];
  
  for (const event of completedEvents) {
    const studentIds = await getTeamMembersStudentIds(event.team, event.participants || '');
    
    const participants = (event.participants || '').replace(/、/g, ';');
    const studentIdsStr = studentIds.join(';');
    
    rows.push([
      formatDate(event.date),
      `${event.time || ''}${event.endTime ? ` - ${event.endTime}` : ''}`,
      escapeCsvField(event.team || ''),
      `"${participants}"`, 
      `"${studentIdsStr}"`,
      escapeCsvField(event.target || ''),
      event.shots?.toString() || '',
      escapeCsvField(event.notes || '')
    ]);
  }

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  link.setAttribute('href', url);
  link.setAttribute('download', `hyper-history-${dateStr}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
} 