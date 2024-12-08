export function parseSearchTerm(term: string) {
    const parts = term.split(':');
    if (parts.length > 1) {
      return { property: parts[0], value: parts[1] };
    } else {
      return { property: null, value: parts[0] };
    }
  }
  
  export function parseSearchValue(value: string): string[] {
    return value.split(',');
  }