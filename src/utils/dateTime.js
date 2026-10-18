// Date and Time utility functions for SmartGuard Doorbell

/**
 * Formats a Date object or timestamp string into a readable date string.
 * Example: "18 October 2026"
 */
export function formatDate(dateInput = new Date()) {
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Formats a Date object or timestamp string into a 12-hour time string.
 * Example: "10:42 AM"
 */
export function formatTime(dateInput = new Date()) {
  const d = new Date(dateInput);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Formats a full date-time string
 * Example: "18 Oct 2026, 10:42 AM"
 */
export function formatDateTime(dateInput = new Date()) {
  const d = new Date(dateInput);
  return `${formatDate(d)}, ${formatTime(d)}`;
}

/**
 * Returns human-friendly relative time (e.g., "Just now", "5 mins ago", "2 hours ago")
 */
export function getRelativeTime(dateInput) {
  const now = new Date();
  const past = new Date(dateInput);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return formatDate(past);
}

/**
 * Check if a date is today
 */
export function isToday(dateInput) {
  const d = new Date(dateInput);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Generate a standard sequential or timestamped Visitor ID
 */
export function generateVisitorId(sequenceNum) {
  if (sequenceNum !== undefined) {
    return `VIS-${String(sequenceNum).padStart(3, '0')}`;
  }
  const rand = Math.floor(100 + Math.random() * 900);
  return `VIS-${rand}`;
}
