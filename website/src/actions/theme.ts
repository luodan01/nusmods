export const SELECT_THEME = 'SELECT_THEME' as const;
export function selectTheme(theme: string) {
  return {
    type: SELECT_THEME,
    payload: theme,
  };
}

export const CYCLE_THEME = 'CYCLE_THEME' as const;
export function cycleTheme(offset: number) {
  return {
    type: CYCLE_THEME,
    payload: offset,
  };
}

export const TOGGLE_TIMETABLE_ORIENTATION = 'TOGGLE_TIMETABLE_ORIENTATION' as const;
export function toggleTimetableOrientation() {
  return {
    type: TOGGLE_TIMETABLE_ORIENTATION,
    payload: null,
  };
}

export const TOGGLE_TITLE_DISPLAY = 'TOGGLE_TITLE_DISPLAY' as const;
export function toggleTitleDisplay() {
  return {
    type: TOGGLE_TITLE_DISPLAY,
    payload: null,
  };
}

//@EDITED added this
export const TOGGLE_MODULE_DETAILS = 'TOGGLE_MODULE_DETAILS' as const;
export function toggleModuleDetails() {
  return {
    type: TOGGLE_MODULE_DETAILS,
    payload: null,
  };
}

//@EDITED added this
export const TOGGLE_YEARS_SHOWN = 'TOGGLE_YEARS_SHOWN' as const;
export function toggleYearsShown() {
  return {
    type: TOGGLE_YEARS_SHOWN,
    payload: null,
  };
}