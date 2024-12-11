// check if the input is an ISO8601 date format (YYYY-MM-DD)
export function isISO8601Date(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}
