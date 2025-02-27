import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import classnames from 'classnames';

import { Semester, ModuleCode } from 'types/modules';
import { AddModuleData, PlannerModuleInfo } from 'types/planner';
import config from 'config';
import { getExamDate, renderMCs } from 'utils/modules';
import {
  getDroppableId,
  getModuleCredit,
  getModuleGrade,
  getModuleTitle,
  getSemesterName,
  getTotalMC,
  getSAP,
  getModuleColor
} from 'utils/planner';
import PlannerModule from '../PlannerModule/PlannerModule';

import AddModule from '../AddModule/AddModule';
import styles from './PlannerSemester.scss';
import PlannerContainer from '../PlannerContainer/PlannerContainer';

type Props = {
  colour?:string;
  year: string;
  semester: Semester;
  modules: PlannerModuleInfo[];
  showModuleDetails: boolean;

  showModuleMeta?: boolean;
  className?: string;

  addModule: (year: string, semester: Semester, module: AddModuleData) => void;
  removeModule: (id: string) => void;
  addCustomData: (moduleCode: ModuleCode) => void;
  setPlaceholderModule: (id: string, moduleCode: ModuleCode) => void;
};


function renderSemesterMeta(plannerModules: PlannerModuleInfo[]) {
  const moduleCredits = getTotalMC(plannerModules);
  const SAP = getSAP(plannerModules);

  return (
    <div>
    <div className={styles.semesterMeta}>
      <p>
        {plannerModules.length} {plannerModules.length === 1 ? 'module' : 'modules'}
      </p>
      <p>SAP: {Number.isNaN(SAP) ? '-' :SAP.toFixed(2)}</p>
    </div>
    </div>
  );
}

/**
 * Component for a single column of modules for a single semester
 */
const PlannerSemester: React.FC<Props> = ({
    year,
    colour,
  semester,
  modules,
  showModuleDetails,
  showModuleMeta = true,
  className,
  addModule,
  removeModule,
  addCustomData,
  setPlaceholderModule,
}) => {
  const renderModule = (plannerModule: PlannerModuleInfo, index: number) => {
    const { id, moduleCode, moduleInfo, conflict, placeholder } = plannerModule;

    const showExamDate = showModuleDetails && config.academicYear === year;
    
    return (
        <PlannerModule
        key={id}
        colour={showModuleDetails ? getModuleColor(plannerModule): ""}
        id={id}
        index={index}
        moduleCode={moduleCode}
        placeholder={placeholder}
        moduleTitle={showModuleDetails ? getModuleTitle(plannerModule) : null}
        examDate={showExamDate && moduleInfo ? getExamDate(moduleInfo, semester) : null}
        moduleCredit={showModuleDetails ? getModuleCredit(plannerModule) : null}
        moduleGrade={showModuleDetails ? getModuleGrade(plannerModule) : null}
        conflict={conflict}
        semester={semester}
        removeModule={removeModule}
        addCustomData={addCustomData}
        setPlaceholderModule={setPlaceholderModule}
      /> 
    );
  };

  const droppableId = getDroppableId(year, semester);

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          className={classnames(styles.semester, className, {
            [styles.emptyList]: modules.length === 0,
            [styles.dragOver]: snapshot.isDraggingOver,
          })}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {modules.map(renderModule)}

          {provided.placeholder}

          {modules.length === 0 && (
            <p className={styles.emptyListMessage}>
              Drop module here 
            </p>
          )}

          {showModuleMeta && modules.length > 0 && renderSemesterMeta(modules)}

          <div className={styles.addModule}>
            <AddModule
              year={year}
              semester={semester}
              onAddModule={(module) => addModule(year, +semester, module)}
            />
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default React.memo(PlannerSemester);
