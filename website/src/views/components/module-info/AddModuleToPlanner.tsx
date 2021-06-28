import { PureComponent } from 'react';
import Downshift from 'downshift';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { get } from 'lodash';

import {
  PLAN_TO_TAKE_SEMESTER,
  PLAN_TO_TAKE_YEAR,
} from 'utils/planner';

import { Module, Semester } from 'types/modules';

// import { addModule, removeModule } from 'actions/timetables';
import { addPlannerModule, removePlannerModule } from 'actions/planner';
import { State as StoreState } from 'types/state';

import styles from './AddModuleDropdown.scss';
import { PlannerModuleInfo, AddModuleData } from 'types/planner';
import planToTake from 'views/planner/PlannerContainer';

type Props = {
  module: Module;
  moduleData: AddModuleData;
  planner: typeof planToTake;
  
  className?: string;
  block?: boolean;

  addPlannerModule: (year: string, semester: Semester, moduleData: AddModuleData) => void;
  removePlannerModule: (id: string) => void;
};

type State = {
  loading: Semester | null;
};

function isModuleOnPlanner(
  semester: Semester,
  planner: typeof planToTake,
  module: Module,
): boolean {
  return !!get(planner, [String(semester), module.moduleCode]);
}

export class AddModuleToPlannerComponent extends PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { planner, module } = nextProps;
    const { loading } = prevState;

    if (loading != null && isModuleOnPlanner(loading, planner, module)) {
      return { loading: null };
    }

    return null;
  }

  state: State = {
    loading: null,
  };

  onSelect(semester: Semester) {
    const { module, planner, moduleData } = this.props;
    const id = `add-to-planner-${module.moduleCode}`;

    if (isModuleOnPlanner(semester, planner, module)) {
      this.props.removePlannerModule(id);
    } else {
      this.setState({ loading: semester });
      this.props.addPlannerModule(PLAN_TO_TAKE_YEAR, PLAN_TO_TAKE_SEMESTER, moduleData);
    }
  }

  buttonLabel(semester: Semester) {
    if (this.state.loading === semester) {
      return 'Added to Plan to Take modules!';
    }

    const hasModule = isModuleOnPlanner(semester, this.props.planner, this.props.module);
    return hasModule ? (
      <>
        Remove from <br />
        Plan To Take modules
      </>
    ) : (
      <>
        Add to <br />
        Plan To Take modules
      </>
    );
  }


  render() {
    const { block, className, module } = this.props;

    const defaultSemester = PLAN_TO_TAKE_SEMESTER;
    const id = `add-to-planner-${module.moduleCode}`;

    /* eslint-disable jsx-a11y/label-has-for */
    return (
      <Downshift>
        {({ getLabelProps, getItemProps, isOpen, toggleMenu, highlightedIndex, getMenuProps }) => (
          <div>
            <label {...getLabelProps({ htmlFor: id })} className="sr-only">
              Add module to planner
            </label>

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
                onClick={() => this.onSelect(defaultSemester)}
              >
                {this.buttonLabel(defaultSemester)}
              </button>
            </div>
          </div>
        )}
      </Downshift>
    );
  }
}

const AddModuleToPlannerConnected = connect(
  (state: StoreState) => ({
    planner: state.planner.plantotake,
  }),
  { addPlannerModule, removePlannerModule },
)(AddModuleToPlannerComponent);

export default AddModuleToPlannerConnected;
