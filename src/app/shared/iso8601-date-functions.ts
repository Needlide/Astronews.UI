// check if the input is an ISO8601 date format (YYYY-MM-DD)
export function isISO8601Date(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

// transform Date object to an ISO8601 format (YYYY-MM-DD)
export function convertDateToString(givenDate: Date): string {
  let year = givenDate.getFullYear().toString();
  let month = String(givenDate.getMonth() + 1).padStart(2, '0');
  let day = String(givenDate.getDate()).padStart(2, '0');

  let yearString = `${year}-${month}-${day}`;

  return yearString;
}
