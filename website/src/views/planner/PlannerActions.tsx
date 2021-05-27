import * as React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { toggleModuleDetails, toggleYearsShown } from 'actions/theme'; //@EDITED to add button

import { Calendar, Grid, Sidebar, Type } from 'react-feather';
import elements from 'views/elements';
import config from 'config';

import styles from '../timetable/TimetableActions.scss';

type Props = {
    collapseModuleDetails : boolean;
    toggleModuleDetails : () => void;

    collapseYears : boolean;
    toggleYearsShown : () => void;
}

const PlannerActions: React.FC<Props> = (props) => (
    <div
      className="btn-toolbar justify-content-between"
      role="toolbar"
      aria-label="Planner utilities"
    >
      <div className={styles.buttonGroup} role="group" aria-label="Planner manipulation">
      <button
          type="button"
          className={classnames('btn btn-outline-primary btn-svg')}
          onClick={props.toggleModuleDetails}
        >
          <Sidebar className={styles.sidebarIcon} />
          {props.collapseModuleDetails ? 'Show module details' : 'Hide module details'}
        </button>

        <button
          type="button"
          className={classnames('btn btn-outline-primary btn-svg')}
          onClick={props.toggleYearsShown}
        >
          <Sidebar className={styles.sidebarIcon} />
          {props.collapseModuleDetails ? 'Show all years' : 'Collapse'}
        </button>
{/*   
        {!props.collapseModuleDetails && (
          <button
            type="button"
            className={classnames(styles.titleBtn, 'btn-outline-primary btn btn-svg')}
            onClick={props.toggleModuleDetails}
          >
            <Type className={styles.titleIcon} />
            {props.showTitles ? 'Hide Titles' : 'Show Titles'}
          </button>
        )} */}
  
        {/* {config.examAvailabilitySet.has(props.semester) && (
          <button
            type="button"
            className={classnames(
              styles.calendarBtn,
              elements.examCalendarBtn,
              'btn-outline-primary btn btn-svg',
            )}
            onClick={props.toggleExamCalendar}
          >
            {props.showExamCalendar ? (
              <>
                <Grid className="svg svg-small" /> Timetable
              </>
            ) : (
              <>
                <Calendar className="svg svg-small" /> Exam Calendar
              </>
            )}
          </button>
        )} */}
      </div>
    </div>
  );

  export default connect(null, {
    toggleModuleDetails,
    toggleYearsShown,
  })(PlannerActions);