import { PureComponent } from 'react';
import Downshift from 'downshift';
import classnames from 'classnames';
import { connect } from 'react-redux';

import {
  PLAN_TO_TAKE_SEMESTER,
  PLAN_TO_TAKE_YEAR,
} from 'utils/planner';

import { Module, Semester } from 'types/modules';
import { State as StoreState } from 'types/state';
import { AddModuleData } from 'types/planner';
import { addPlannerModule } from 'actions/planner';

import styles from './AddModuleDropdown.scss';


type Props = {
  module: Module;
  moduleData: AddModuleData;
  
  className?: string;
  block?: boolean;

  addPlannerModule: (year: string, semester: Semester, moduleData: AddModuleData) => void;
};

type State = {
  loading: Semester | null;
  disabled: boolean;
};

export class AddModuleToPlannerComponent extends PureComponent<Props, State> {
  state: State = {
    loading: null,
    disabled: false,
  };

  onSelect() {
    const { moduleData } = this.props;

    this.setState({ 
      loading: PLAN_TO_TAKE_SEMESTER,
      disabled: true
    });
    this.props.addPlannerModule(PLAN_TO_TAKE_YEAR, PLAN_TO_TAKE_SEMESTER, moduleData);
  }

  buttonLabel(semester: Semester) {
    if (this.state.loading === semester) {
      return 'Added to Plan To Take';
    }

    return (
      <>
        Add to <br />
        Plan to Take modules
      </>
    );
  }

  render() {
    const { block, className, module } = this.props;
    const id = `add-to-planner-${module.moduleCode}`;

    /* eslint-disable jsx-a11y/label-has-for */
    return (
      <div
        className={classnames('btn-group', styles.buttonGroup, className, {
          'btn-block': block,
        })}
      >
        <button
          type="button"
          className={classnames('btn btn-outline-primary', {
            'btn-block': block,
          })}
          onClick={() => this.onSelect()}
          disabled={this.state.disabled}
        >
          {this.buttonLabel(PLAN_TO_TAKE_SEMESTER)}
        </button>
      </div>
    );
  }
}

const AddModuleToPlannerConnected = connect(
  (state: StoreState) => ({
    planner: state.planner.plantotake,
  }),
  { addPlannerModule },
)(AddModuleToPlannerComponent);

export default AddModuleToPlannerConnected;
