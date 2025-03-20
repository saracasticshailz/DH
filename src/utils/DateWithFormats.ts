export function getFormattedDateTimeWithIntl() {
  const now = new Date();

  // Format date
  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Format time
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return `${dateFormatter.format(now)} ${timeFormatter.format(now)}`;
}

console.log(getFormattedDateTimeWithIntl());
