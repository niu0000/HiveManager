import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User, XCircle, Clock, Filter } from 'lucide-react';

// ==================== Types ====================

interface Room {
  id: number;
  name: string;
  room_type: string;
  attributes?: string[];
}

interface Bed {
  id: number;
  room_id: number;
  bed_number: string;
  position: 'upper' | 'lower';
  status?: 'available' | 'unavailable' | 'in_progress';
}

interface Assignment {
  id: number;
  reservation_id?: number;
  bed_id: number;
  guest_name?: string;
  check_in_date: string;
  check_out_date: string;
  status: 'confirmed' | 'pending' | 'checked_in' | 'checked_out' | 'cancelled';
}

interface TimelineSlot {
  date: string;
  assignment?: Assignment;
  isToday: boolean;
  isWeekend: boolean;
}

interface BedTimelineRow {
  bed: Bed;
  room: Room;
  slots: TimelineSlot[];
}

// ==================== Constants ====================

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-500 hover:bg-green-600',
  pending: 'bg-yellow-500 hover:bg-yellow-600',
  checked_in: 'bg-blue-500 hover:bg-blue-600',
  checked_out: 'bg-gray-400 hover:bg-gray-500',
  cancelled: 'bg-red-400 hover:bg-red-500',
  unavailable: 'bg-red-600 hover:bg-red-700',
  in_progress: 'bg-orange-500 hover:bg-orange-600',
  available: 'bg-white hover:bg-gray-50',
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: '予約済',
  pending: '保留中',
  checked_in: 'チェックイン済',
  checked_out: 'チェックアウト済',
  cancelled: 'キャンセル',
  unavailable: '利用不可',
  in_progress: '清掃中',
  available: '空き',
};

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

// ==================== Utility Functions ====================

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAY_LABELS[date.getDay()];
  return `${month}/${day}(${weekday})`;
};

const getDatesInRange = (startDate: Date, days: number): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(formatDate(date));
  }
  return dates;
};

const isToday = (dateStr: string): boolean => {
  return dateStr === formatDate(new Date());
};

const isWeekend = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const day = date.getDay();
  return day === 0 || day === 6;
};

const getAssignmentForDate = (assignments: Assignment[], bedId: number, date: string): Assignment | undefined => {
  return assignments.find(a => 
    a.bed_id === bedId && 
    a.status !== 'cancelled' &&
    a.status !== 'checked_out' &&
    a.check_in_date <= date && 
    a.check_out_date > date
  );
};

// ==================== Components ====================

interface TimelineCellProps {
  slot: TimelineSlot;
  assignment?: Assignment;
  bedStatus?: 'unavailable' | 'in_progress';
  onClick?: () => void;
}

const TimelineCell = ({ slot, assignment, bedStatus, onClick }: TimelineCellProps) => {
  let bgColor = STATUS_COLORS.available;
  let label = '';
  let guestName = '';
  
  if (bedStatus === 'unavailable') {
    bgColor = STATUS_COLORS.unavailable;
    label = '×';
  } else if (bedStatus === 'in_progress') {
    bgColor = STATUS_COLORS.in_progress;
    label = '清掃中';
  } else if (assignment) {
    bgColor = STATUS_COLORS[assignment.status] || STATUS_COLORS.pending;
    guestName = assignment.guest_name || 'ゲスト';
    label = formatDisplayDate(assignment.check_in_date) === formatDisplayDate(slot.date) 
      ? 'IN' 
      : formatDisplayDate(assignment.check_out_date) === formatDisplayDate(slot.date)
      ? 'OUT'
      : '';
  }
  
  return (
    <div
      onClick={onClick}
      className={`
        min-w-[80px] h-16 rounded-lg border-2 cursor-pointer transition-all duration-150
        flex flex-col items-center justify-center relative
        ${bgColor}
        ${slot.isToday ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'}
        ${slot.isWeekend && !assignment && !bedStatus ? 'bg-red-50' : ''}
      `}
    >
      {label && (
        <span className="text-xs font-bold text-white drop-shadow-sm">{label}</span>
      )}
      {guestName && !label && (
        <span className="text-xs text-white font-medium truncate max-w-[70px]">{guestName}</span>
      )}
      {!label && !guestName && !bedStatus && (
        <span className="text-xs text-gray-400">空き</span>
      )}
    </div>
  );
};

interface BedTimelineRowProps {
  row: BedTimelineRow;
  onBedClick?: (bed: Bed, date?: string) => void;
}

const BedTimelineRowComponent = ({ row, onBedClick }: BedTimelineRowProps) => {
  return (
    <div className="flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Bed Info Column */}
      <div className="sticky left-0 z-10 w-32 flex-shrink-0 bg-white border-r border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-gray-900 text-sm">{row.bed.bed_number}</div>
            <div className="text-xs text-gray-500">{row.room.name}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {row.bed.position === 'upper' && (
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">上</span>
            )}
            {row.bed.position === 'lower' && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">下</span>
            )}
            {row.bed.status === 'unavailable' && (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            {row.bed.status === 'in_progress' && (
              <Clock className="w-4 h-4 text-orange-500" />
            )}
          </div>
        </div>
      </div>
      
      {/* Timeline Columns */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-2 p-3 min-w-max">
          {row.slots.map((slot, idx) => (
            <TimelineCell
              key={idx}
              slot={slot}
              assignment={slot.assignment}
              bedStatus={row.bed.status}
              onClick={() => onBedClick?.(row.bed, slot.date)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function BedMap() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'occupied'>('all');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: API 実装後に実際のデータを取得
        // const [roomsRes, bedsRes] = await Promise.all([
        //   roomsApi.getAll(),
        //   bedsApi.getAll()
        // ]);
        
        // ダミーデータ
        const dummyRooms: Room[] = [
          { id: 1, name: '101 号室', room_type: 'dormitory', attributes: ['female_only'] },
          { id: 2, name: '102 号室', room_type: 'dormitory', attributes: [] },
          { id: 3, name: '201 号室', room_type: 'private', attributes: ['for2'] },
        ];
        
        const dummyBeds: Bed[] = [
          { id: 1, room_id: 1, bed_number: '101-1', position: 'lower', assignment: { id: 1, guest_name: '山田太郎', check_in_date: '2025-01-15', check_out_date: '2025-01-20', status: 'checked_in' } },
          { id: 2, room_id: 1, bed_number: '101-2', position: 'upper', assignment: { id: 2, guest_name: '鈴木花子', check_in_date: '2025-01-16', check_out_date: '2025-01-18', status: 'confirmed' } },
          { id: 3, room_id: 1, bed_number: '101-3', position: 'lower' },
          { id: 4, room_id: 1, bed_number: '101-4', position: 'upper', status: 'unavailable' },
          { id: 5, room_id: 2, bed_number: '102-1', position: 'lower', assignment: { id: 3, guest_name: '佐藤次郎', check_in_date: '2025-01-17', check_out_date: '2025-01-22', status: 'pending' } },
          { id: 6, room_id: 2, bed_number: '102-2', position: 'upper' },
          { id: 7, room_id: 2, bed_number: '102-3', position: 'lower', status: 'in_progress' },
          { id: 8, room_id: 2, bed_number: '102-4', position: 'upper' },
          { id: 9, room_id: 3, bed_number: '201-1', position: 'lower', assignment: { id: 4, guest_name: '高橋一家', check_in_date: '2025-01-15', check_out_date: '2025-01-25', status: 'checked_in' } },
          { id: 10, room_id: 3, bed_number: '201-2', position: 'lower' },
        ];
        
        setRooms(dummyRooms);
        setBeds(dummyBeds);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getBedsForRoom = (roomId: number) => {
    return beds.filter(bed => bed.room_id === roomId);
  };

  const filteredRooms = rooms.filter(room => {
    const roomBeds = getBedsForRoom(room.id);
    if (filter === 'available') {
      return roomBeds.some(bed => !bed.assignment || bed.assignment.status === 'checked_out');
    }
    if (filter === 'occupied') {
      return roomBeds.some(bed => bed.assignment && bed.assignment.status !== 'checked_out');
    }
    return true;
  });

  const stats = {
    total: beds.length,
    occupied: beds.filter(b => b.assignment && b.assignment.status !== 'checked_out').length,
    available: beds.filter(b => !b.assignment || b.assignment.status === 'checked_out').length,
    unavailable: beds.filter(b => b.status === 'unavailable').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">ベッドマップ</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            空きのみ
          </button>
          <button
            onClick={() => setFilter('occupied')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'occupied' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            埋まりのみ
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">総ベッド数</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{stats.occupied}</div>
          <div className="text-sm text-gray-500">稼働中</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          <div className="text-sm text-gray-500">空き</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{stats.unavailable}</div>
          <div className="text-sm text-gray-500">利用不可</div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">凡例</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(STATUS_COLORS).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <div className={`w-4 h-4 rounded ${value.split(' ')[0]} border ${value.split(' ')[2]} mr-2`}></div>
              <span className="text-sm text-gray-600">{STATUS_LABELS[key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            beds={getBedsForRoom(room.id)}
            onBedClick={(bed) => setSelectedBed(bed)}
          />
        ))}
      </div>

      {/* Bed Detail Modal */}
      {selectedBed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">ベッド #{selectedBed.bed_number}</h3>
              <button onClick={() => setSelectedBed(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            {selectedBed.assignment && selectedBed.assignment.status !== 'checked_out' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">ゲスト名</label>
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700">
                アサインする
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200">
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
