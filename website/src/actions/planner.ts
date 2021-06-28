import { ModuleCode, Semester } from 'types/modules';
import { AddModuleData } from 'types/planner';
import { CustomModule } from 'types/reducers';

export const SET_PLANNER_MIN_YEAR = 'SET_PLANNER_MIN_YEAR' as const;
export function setPlannerMinYear(year: string) {
  return {
    type: SET_PLANNER_MIN_YEAR,
    payload: year,
  };
}

export const SET_PLANNER_MAX_YEAR = 'SET_PLANNER_MAX_YEAR' as const;
export function setPlannerMaxYear(year: string) {
  return {
    type: SET_PLANNER_MAX_YEAR,
    payload: year,
  };
}

export const SET_PLANNER_IBLOCS = 'SET_PLANNER_IBLOCS' as const;
export function setPlannerIBLOCs(iblocs: boolean) {
  return {
    type: SET_PLANNER_IBLOCS,
    payload: iblocs,
  };
}

export const SET_PLANNER_EXEMPTIONS = 'SET_PLANNER_EXEMPTIONS' as const;
export function setPlannerExemptions(exempt: boolean) {
  return {
    type: SET_PLANNER_EXEMPTIONS,
    payload: exempt,
  };
}

export const ADD_PLANNER_MODULE = 'ADD_PLANNER_MODULE' as const;
export function addPlannerModule(year: string, semester: Semester, module: AddModuleData) {
    console.log("Add")
    console.log({year,semester,module});
    
  return {
    type: ADD_PLANNER_MODULE,
    payload: {
      year,
      semester,
      ...module,
    },
  };
}

export const MOVE_PLANNER_MODULE = 'MOVE_PLANNER_MODULE' as const;
export function movePlannerModule(id: string, year: string, semester: Semester, index: number) {

    console.log("move")
  return {
    type: MOVE_PLANNER_MODULE,
    payload: {
      id,
      year,
      semester,
      index,
    },
  };
}

export const REMOVE_PLANNER_MODULE = 'REMOVE_PLANNER_MODULE' as const;
export function removePlannerModule(id: string) {

    console.log("remove")
  return {
    type: REMOVE_PLANNER_MODULE,
    payload: {
      id,
    },
  };
}

export const SET_PLACEHOLDER_MODULE = 'SET_PLACEHOLDER_MODULE' as const;
export function setPlaceholderModule(id: string, moduleCode: ModuleCode) {
    console.log("placeholder ?")
  return {
    type: SET_PLACEHOLDER_MODULE,
    payload: {
      id,
      moduleCode,
    },
  };
}

export const ADD_CUSTOM_PLANNER_DATA = 'ADD_CUSTOM_PLANNER_DATA' as const;
export function addCustomModule(moduleCode: ModuleCode, data: CustomModule) {
  return {
    type: ADD_CUSTOM_PLANNER_DATA,
    payload: { moduleCode, data },
  };
}

export const GET_ALL_PLANNER = "GET_ALL_PLANNER" as const;
export function getAllPlanner(da:any,custData:any,iblocs:any,
exempt:any,minYear:any,maxYear:any){
    return{
        type: GET_ALL_PLANNER,
        payload:{da,custData,iblocs,exempt,minYear,maxYear}
    }
}

export const RESET_PLANNER = "RESET_PLANNER" as const
export function resetPlanner(modules:boolean,custom:boolean){
    return {
        type:RESET_PLANNER,
        payload:{modules,custom}
    }
}
