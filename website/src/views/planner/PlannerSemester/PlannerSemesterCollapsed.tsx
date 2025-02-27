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
  getSAP
} from 'utils/planner';
import PlannerModule from '../PlannerModule/PlannerModule';
import PlannerModuleCollapsed from  '../PlannerModule/PlannerModuleCollapsed';
import AddModule from '../AddModule/AddModule';
import styles from './PlannerSemesterCollapsed.scss';
import PlannerContainer from '../PlannerContainer/PlannerContainer';

type Props = {
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

type State = {
  readonly showModuleDetails: boolean;
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
    </div>
    <div className={styles.semesterMeta}><p>SAP: {Number.isNaN(SAP) ? '-' :SAP.toFixed(2)}</p></div>
    </div>
  );
}

/**
 * Component for a single column of modules for a single semester
 */
const PlannerSemesterCollapsed: React.FC<Props> = ({
  year,
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
     <PlannerModuleCollapsed
        key={id}
        id={id}
        index={index}
        moduleCode={moduleCode}
        placeholder={placeholder}
        moduleTitle={showModuleDetails ? getModuleTitle(plannerModule) : null}
        examDate={showExamDate && moduleInfo ? getExamDate(moduleInfo, semester) : null}
        moduleCredit={showModuleDetails ? getModuleCredit(plannerModule) : null}
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

export default React.memo(PlannerSemesterCollapsed);
