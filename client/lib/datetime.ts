export function formatDate(date: Date) {
    date = new Date(date);
    const currentYear = new Date().getFullYear();
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: currentYear !== date.getFullYear() ? 'numeric' : undefined,
      timeZone: 'UTC'
    });
  
    return formattedDate;
}