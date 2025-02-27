import { PureComponent } from 'react';
import classnames from 'classnames';
import { flatMap, size, sortBy, toPairs, values } from 'lodash';

import { ModuleCode, Semester } from 'types/modules';
import { AddModuleData, PlannerModuleInfo } from 'types/planner';
import config from 'config';
import { getSemesterName, getTotalMC, getSAP } from 'utils/planner';
import { Minus, Plus } from 'react-feather';
import { renderMCs } from 'utils/modules';
import PlannerSemester from '../PlannerSemester/PlannerSemester';
import styles from './PlannerYear.scss';

type Props = Readonly<{
  name: string; // eg. iBLOCs, Year 1, etc.
  year: string; // Actual academic year
  semesters: { [semester: string]: PlannerModuleInfo[] };
  //showModuleDetails: boolean;

  addModule: (year: string, semester: Semester, module: AddModuleData) => void;
  removeModule: (id: string) => void;
  addCustomData: (moduleCode: ModuleCode) => void;
  setPlaceholderModule: (id: string, moduleCode: ModuleCode) => void;
}>;

type State = {
  readonly showSpecialSem: boolean;
  //readonly showModuleDetails: boolean;
};

export default class PlannerYear extends PureComponent<Props, State> {
  state = {
    // Always display Special Terms I and II if either one has modules
    showSpecialSem: this.hasSpecialTermModules(),
    //showModuleDetails: this.showingModuleDetails(),
  };

  hasSpecialTermModules() {
    const { semesters } = this.props;
    return size(semesters[3]) > 0 || size(semesters[4]) > 0;
  }

  // renderHeader() {
  //   const { year, name, semesters } = this.props;
  //   const modules = flatMap(semesters, values);
  //   const credits = getTotalMC(modules);
  //   const CAP = getSAP(modules);
  //   const count = modules.length;

  //   return (
  //     <header className={styles.yearHeader}>
  //       <h2>
  //         {name} <span className={styles.acadYear}>{year}</span>
  //       </h2>
  //       <div className={styles.yearMeta}>
  //         <p>
  //           {count} {count === 1 ? 'module' : 'modules'} / {renderMCs(credits)}
  //         </p>
  //       </div>
  //     </header>
  //   );
  // }

  render() {
    const { name, year, semesters} = this.props;
    const { showSpecialSem } = this.state;

    // Only show the toggle if special terms are currently empty
    const showSpecialSemToggle = !this.hasSpecialTermModules();

    let sortedSemesters = sortBy(toPairs(semesters), ([semester]) => semester);
    if (!showSpecialSem) {
      sortedSemesters = sortedSemesters.filter(([semester]) => +semester <= 2);
    }

    return (
      <section
        key={year}
        className={classnames(styles.year, {
          [styles.currentYear]: year === config.academicYear,
        })}
      >
        {/* {this.renderHeader()} */}

        <div className={styles.semesters}>
          {sortedSemesters.map(([semester, modules]) => (
            <div className={styles.semesterWrapper} key={semester}>
              <h3 className={classnames(styles.semesterYearHeader, {
                [styles.firstYear]: name === "Year 1" || name === "Year 5",
                [styles.secondYear]: name === "Year 2" || name === "Year 6",
                [styles.thirdYear]: name === "Year 3",
                [styles.forthYear]: name === "Year 4",
              })}>{name}</h3>
              <h3 className={classnames(styles.semesterHeader, {
                [styles.firstYear]: name === "Year 1" || name === "Year 5",
                [styles.secondYear]: name === "Year 2"|| name === "Year 6",
                [styles.thirdYear]: name === "Year 3",
                [styles.forthYear]: name === "Year 4",
              })}>{getSemesterName(+semester)}</h3>
              <PlannerSemester
                year={year}
                semester={+semester}
                modules={modules}
                showModuleDetails={true}
                className={styles.semester}
                addModule={this.props.addModule}
                removeModule={this.props.removeModule}
                addCustomData={this.props.addCustomData}
                setPlaceholderModule={this.props.setPlaceholderModule}
              />
            </div>
          ))}
        </div>

        {showSpecialSemToggle && (
          <div className={styles.specialSemToggle}>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => this.setState({ showSpecialSem: !showSpecialSem })}
            >
              {showSpecialSem ? <Minus /> : <Plus />}
              Special Term
            </button>
          </div>
        )}
      </section>
    );
  }
}
