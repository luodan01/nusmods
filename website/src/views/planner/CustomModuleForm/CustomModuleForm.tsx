import * as React from 'react';
import {useState} from 'react';
import { connect } from 'react-redux';
import { TwitterPicker } from 'react-color';

import { CustomModule } from 'types/reducers';
import { Module, ModuleCode } from 'types/modules';
import { State as StoreState } from 'types/state';

import Tooltip from 'views/components/Tooltip/Tooltip';
import { addCustomModule } from 'actions/planner';
import { getModuleCredit, getModuleTitle, getModuleGrade } from 'utils/planner';
import styles from './CustomModuleForm.scss';
import { values } from 'lodash';
import { getSemesterTimetableColors } from 'selectors/timetables';
import { selectModuleColor } from 'actions/timetables';

type OwnProps = Readonly<{
  moduleCode: ModuleCode;
  onFinishEditing: () => void;
}>;

type Props = OwnProps &
  Readonly<{
    customInfo: CustomModule | null;
    moduleInfo: Module | null;
    addCustomModule: (moduleCode: ModuleCode, data: CustomModule) => void;
  }>;

export const CustomModuleFormComponent: React.FC<Props> = (props) => {
  // We use an uncontrolled form here because we don't want to update the
  // module title and MCs live
  const inputModuleCredit = React.createRef<HTMLInputElement>();
  const inputTitle = React.createRef<HTMLInputElement>();
  const inputModuleGrade = React.createRef<HTMLSelectElement>();

  const [colour, setColour] = useState('#fff');

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const inputModuleCreditCurrent = inputModuleCredit.current;
    const moduleCredit = inputModuleCreditCurrent && inputModuleCreditCurrent.value;
    const inputTitleCurrent = inputTitle.current;
    const title = inputTitleCurrent && inputTitleCurrent.value;
    const inputModuleGradeCurrent = inputModuleGrade.current;
    const moduleGrade = inputModuleCreditCurrent && inputModuleGradeCurrent?.value;

    // Module credit is required
    if (moduleCredit == null) return;

    props.addCustomModule(props.moduleCode, {
      moduleCredit: +moduleCredit,
      title,
        moduleGrade,
        colour
    });

    props.onFinishEditing();
  };

  const resetCustomInfo = () => {
    const { moduleInfo } = props;
    if (!moduleInfo) return;

    // We don't use props.addCustomModule because we don't want to save the reset
    // immediately in case the user wants to cancel
    if (inputModuleCredit.current) {
      inputModuleCredit.current.value = moduleInfo.moduleCredit;
    }

    if (inputTitle.current) {
      inputTitle.current.value = moduleInfo.title;
    }

    if (inputModuleGrade.current) {
      inputModuleGrade.current.value = "";
    }
  };

  const { moduleCode, moduleInfo, customInfo } = props;

  const plannerModule = { moduleCode, customInfo, moduleInfo };
  const moduleCredit = getModuleCredit(plannerModule);
  const title = getModuleTitle(plannerModule);
  const moduleGrade = getModuleGrade(plannerModule);
  const grades = ['CS', 'CU', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D+', 'D', 'F'];
  // const grades = [
  //   {letterGrade : "CS", numberGrade: null},
  //   {letterGrade : "CU", numberGrade: null},
  //   {letterGrade : "A+", numberGrade: 5.0},
  //   {letterGrade : "A", numberGrade: 5.0},
  //   {letterGrade : "A-", numberGrade: 4.5},
  //   {letterGrade : "B+", numberGrade: 4.0},
  //   {letterGrade : "B", numberGrade: 3.5},
  //   {letterGrade : "B-", numberGrade: 3.0},
  //   {letterGrade : "C+", numberGrade: 2.5},
  //   {letterGrade : "C", numberGrade: 2.0},
  //   {letterGrade : "D+", numberGrade: 1.5},
  //   {letterGrade : "D", numberGrade: 1.0},
  //   {letterGrade : "F", numberGrade: 0.0},
  // ]

  return (

    <form onSubmit={onSubmit}>
      <h3 className={styles.heading}>Edit info for {moduleCode}</h3>

      <div className="form-row">
        <div className="col-md-3">
          <label htmlFor="input-mc">Module Credits</label>
          <input
            ref={inputModuleCredit}
            id="input-mc"
            type="number"
            className="form-control"
            defaultValue={moduleCredit ? String(moduleCredit) : ''}
            required
          />
        </div>
        <div>
          <label htmlFor="input-title">Title (optional)</label>
          <input
            ref={inputTitle}
            id="input-title"
            type="text"
            className="form-control"
            defaultValue={title || ''}
          />
        </div>
        <div className = "col-md-3">
          <label htmlFor="input-grade">Grade (optional)</label>
          <select 
          ref={inputModuleGrade}
          id="input-grade"
          className="form-control" 
          defaultValue={moduleGrade || ""} >
            {grades.map((grade, index) => <option key={index}>{grade}</option>)}
          </select>
          </div>

          <div className = {styles.colourPicker}>
            <label htmlFor="input-colour">Colour Code</label>
          <div> <TwitterPicker 
              colour = {colour}
              onChange={updatedColour => setColour(updatedColour)}/> 
              </div></div>
          
      </div>

      <div className={styles.formAction}>
        <div>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button type="button" className="btn btn-link" onClick={props.onFinishEditing}>
            Cancel
          </button>
        </div>

        {moduleInfo && (
          <Tooltip
            content={`Reset title to "${moduleInfo.title}" and credits to ${moduleInfo.moduleCredit}`}
          >
            <button type="button" className="btn btn-secondary" onClick={resetCustomInfo}>
              Reset Info
            </button>
          </Tooltip>
        )}
      </div>
    </form>
  );
};

const CustomModuleForm = connect(
  (state: StoreState, ownProps: OwnProps) => ({
    customInfo: state.planner.custom[ownProps.moduleCode],
    moduleInfo: state.moduleBank.modules[ownProps.moduleCode],
  }),
  {
    addCustomModule,
  },
)(React.memo(CustomModuleFormComponent));

export default CustomModuleForm;
