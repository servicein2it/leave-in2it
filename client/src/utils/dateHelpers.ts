// Helper functions for date formatting in Thai Buddhist Era
export const formatDateThai = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const buddhistYear = dateObj.getFullYear() + 543;
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  
  return `${day} ${month} ${buddhistYear}`;
};

export const formatDateRangeThai = (startDate: Date | string, endDate: Date | string): string => {
  const start = formatDateThai(startDate);
  const end = formatDateThai(endDate);
  
  if (start === end) {
    return start;
  }
  
  return `${start} - ${end}`;
};

export const calculateDaysBetween = (startDate: Date | string, endDate: Date | string): number => {
  const startDateObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const endDateObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const timeDiff = endDateObj.getTime() - startDateObj.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
};

export const getCurrentBuddhistYear = (): number => {
  return new Date().getFullYear() + 543;
};

export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

export const parseInputDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const getThaiMonths = (): { value: number; label: string }[] => {
  return [
    { value: 0, label: 'มกราคม' },
    { value: 1, label: 'กุมภาพันธ์' },
    { value: 2, label: 'มีนาคม' },
    { value: 3, label: 'เมษายน' },
    { value: 4, label: 'พฤษภาคม' },
    { value: 5, label: 'มิถุนายน' },
    { value: 6, label: 'กรกฎาคม' },
    { value: 7, label: 'สิงหาคม' },
    { value: 8, label: 'กันยายน' },
    { value: 9, label: 'ตุลาคม' },
    { value: 10, label: 'พฤศจิกายน' },
    { value: 11, label: 'ธันวาคม' }
  ];
};

export const getCurrentMonthYear = (): { month: number; year: number } => {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear() + 543
  };
};
