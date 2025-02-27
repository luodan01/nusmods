import { useMemo, useRef, useState } from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { flatMap, flatten, sortBy, toPairs, values } from 'lodash'; import { DragDropContext, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'; import classnames from 'classnames'; import { Calendar, Grid, Sidebar, Type, Repeat } from 'react-feather';

import { Module, ModuleCode, Semester } from 'types/modules'; import { PlannerModulesWithInfo, PlannerModuleInfo, AddModuleData } from 'types/planner';
import { MODULE_CODE_REGEX, renderMCs, subtractAcadYear } from 'utils/modules';
import {
  EXEMPTION_SEMESTER,
  EXEMPTION_YEAR,
  fromDroppableId,
  getTotalMC,
  getSAP,
  IBLOCS_SEMESTER,
  PLAN_TO_TAKE_SEMESTER,
  PLAN_TO_TAKE_YEAR,
} from 'utils/planner';
import {
  addPlannerModule,
    getAllPlanner,
    resetPlanner,
  movePlannerModule,
  removePlannerModule,
  setPlaceholderModule,
} from 'actions/planner';
import { toggleFeedback } from 'actions/app';
import { fetchModule } from 'actions/moduleBank';
import { getAcadYearModules, getExemptions, getIBLOCs, getPlanToTake } from 'selectors/planner';
import { Settings, Trash, User, ChevronDown, Download, RefreshCcw } from 'react-feather';
import Title from 'views/components/Title';
import LoadingSpinner from 'views/components/LoadingSpinner';
import Modal from 'views/components/Modal';
import { State as StoreState } from 'types/state';
import PlannerSemester from '../PlannerSemester/PlannerSemester';
import PlannerYear from '../PlannerYear/PlannerYear';
import PlannerYearCollapsed from '../PlannerYear/PlannerYearCollapsed';
import PlannerSettings from '../PlannerSettings/PlannerSettings';
import PlannerActions from '../PlannerActions';
import CustomModuleForm from '../CustomModuleForm/CustomModuleForm';

import {auth, db} from "../../../firebaseConfig";
import firebase from "firebase";


import styles from './PlannerContainer.scss';
import { findExamClashes } from 'utils/timetables';

export type Props = Readonly<{
  modules: PlannerModulesWithInfo;
  exemptions: PlannerModuleInfo[];
  planToTake: PlannerModuleInfo[];
  iblocsModules: PlannerModuleInfo[];
  iblocs: boolean;
  exempt: boolean;

  // Actions
  fetchModule: (moduleCode: ModuleCode) => Promise<Module>;
  toggleFeedback: () => void;
  toggleModuleDetails: () => void;
  toggleYears: () => void;

    addModule: (year: string, semester: Semester, module: AddModuleData) => void;
    getModules:(modules:any,customData:any,iblocs:any,exempt:any,minYear:any,maxYear:any)=>void,
    resetPlanner:(modules:boolean,custom:boolean)=>void;
  moveModule: (id: string, year: string, semester: Semester, index: number) => void;
  removeModule: (id: string) => void;
  setPlaceholderModule: (id: string, moduleCode: ModuleCode) => void;
}>;


type SemesterModules = { [semester: string]: PlannerModuleInfo[] };

type State = {
  readonly loading: boolean;
  readonly showSettings: boolean;
  // Module code is the module being edited. null means the modal is not open
  readonly showCustomModule: ModuleCode | null;
  showModuleDetails: boolean;
    showAllYears: boolean;
    currUser:firebase.User|null;
};

const TRASH_ID = 'trash';


class PlannerContainerComponent extends PureComponent<Props, State> {
  state: State = {
    loading: true,
    showSettings: false,
    showCustomModule: null,
    showModuleDetails: true,
      showAllYears: true,
      currUser:null
  };



     updateModules =async ()=>{
      if (auth.currentUser!==null){
     const collection =await  db.collection("users").doc(auth.currentUser!.uid).collection("planner").get()
              const mods :any[]= []
              collection.docs.forEach((doc)=>{
                  mods.push(doc.data())
              })

      const custDatas=await        db.collection("users").doc(auth.currentUser!.uid).collection("custom").get()
                      const customDataList :any[]=[];

                      custDatas.forEach(custDataDoc=>{
                          const id = custDataDoc.id
                          customDataList.push({id,data:custDataDoc.data()})
                      })



          const docData = await db.collection("users").doc(auth.currentUser!.uid).get();



        const data = docData.data();
          if (data === undefined){
              this.getModules(mods,customDataList,false,false,"","");
          }
          else{
              console.log(data)
              const {iblocs,exempt,minYear,maxYear} = data
              console.log(this.getModules(mods,customDataList,iblocs,exempt,minYear,maxYear))
          }
      }}

  componentDidMount() {
      console.log(this.props.modules);
      console.log("HEY")
    // TODO: Handle error
    const modules = [
      ...flatten(flatMap(this.props.modules, values)),
      ...this.props.exemptions,
      ...this.props.planToTake,
      ...this.props.iblocsModules,
    ];

    Promise.all(
      modules.map((module) =>
        this.props.fetchModule(module.moduleCode).catch(() => {
          // TODO: Handle error
        }),
      ),
    ).then(() => this.setState({ loading: false }));


  auth.onAuthStateChanged(() => {
    console.log(`Current User: ${auth.currentUser}`);

      if (auth.currentUser!==null){
          this.updateModules()
      }
      else{
          this.resetModules(true,true)
      }
    this.setState({currUser:auth.currentUser});
  });
  }

    resetModules=(modules:boolean,custom:boolean)=>{
        this.props.resetPlanner(modules,custom)
    }
    getModules=(mods:any,custData:any,iblocs:any,exempt:any,minYear:any,maxYear:any)=>{
        this.props.getModules(mods,custData,iblocs,exempt,minYear,maxYear)
    };

  onAddModule = (year: string, semester: Semester, module: AddModuleData) => {
    if (module.type === 'module') {
      // Extract everything that looks like a module code
      const moduleCodes = module.moduleCode.toUpperCase().match(MODULE_CODE_REGEX);

      if (moduleCodes) {
        moduleCodes.forEach((moduleCode) => {
          this.props.addModule(year, semester, { type: 'module', moduleCode });
          // TODO: Handle error
          this.props.fetchModule(moduleCode);
        });
      }
    } else {
      this.props.addModule(year, semester, module);
    }
  };

  onDropEnd: OnDragEndResponder = (evt) => {
    const { destination, draggableId } = evt;

    // No destination = drag and drop cancelled / dropped on invalid target
    if (!destination) return;

    if (destination.droppableId === TRASH_ID) {
      this.props.removeModule(draggableId);
    } else {
      const [year, semester] = fromDroppableId(destination.droppableId);
      this.props.moveModule(draggableId, year, +semester, destination.index);
    }
  };

  onToggleModuleDetails  = () => 
    this.setState({showModuleDetails: !this.state.showModuleDetails});

  onToggleYearsShown  = () => 
    this.setState({showAllYears: !this.state.showAllYears});

  onAddCustomData = (moduleCode: ModuleCode) =>
    this.setState({
      showCustomModule: moduleCode,
    });

  onSetPlaceholderModule = (id: string, moduleCode: ModuleCode) => {
    this.props.setPlaceholderModule(id, moduleCode);
    this.props.fetchModule(moduleCode);
  };

  closeAddCustomData = () => this.setState({ showCustomModule: null });


  renderHeader() {
    const modules = [...this.props.iblocsModules, ...flatten(flatMap(this.props.modules, values))];
    const credits = getTotalMC(modules);
    const CAP = getSAP(modules);
    const count = modules.length;
  
    return (
      <header className={styles.header}>
        <h1>
        {auth.currentUser !== null ? `${auth.currentUser.displayName}'s ` : "Module "}Planner{' '}
          <button
            className="btn btn-outline-primary btn-svg"
            type="button"
            onClick={this.onToggleModuleDetails}
          >
             <Repeat className="svg svg-small" />
            {this.state.showModuleDetails? 'Hide Details' : 'Show Details'}
          </button>

          <button
            className="btn btn-outline-primary btn-svg"
            type="button"
            onClick={this.onToggleYearsShown}
          >
            <Repeat className="svg svg-small" />
            {this.state.showAllYears? "View All Years" : "View By Year"}
          </button>

        </h1>

        <div className={styles.headerRight}>
          <p className={styles.moduleStats}>
            {count} {count === 1 ? 'module' : 'modules'} / {renderMCs(credits)} 
          </p>
          <p className={styles.moduleStats}>
            CAP: {Number.isNaN(CAP) ? '-' :CAP.toFixed(2)}
          </p>

          <button
            className="btn btn-svg btn-outline-primary"
            type="button"
            onClick={() => {
                this.resetModules(true,true)
                this.updateModules()
            }}
          >
            <RefreshCcw className="svg svg-small" />  Reset
          </button>

          
          {this.state.currUser !== null ?


          <button
            className="btn btn-svg btn-outline-primary"
            type="button"
            onClick={async () => {
                await auth.signOut()
            }
            }
          >
            <User className="svg svg-small" /> Logout
        </button>

              :
          <button
            className="btn btn-svg btn-outline-primary"
            type="button"
            onClick={async () => {
                var provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

                await auth.signInWithPopup(provider);
            }
            }
          >
            <User className="svg svg-small" /> Login
        </button>
        }

          <button
            className="btn btn-svg btn-outline-primary"
            type="button"
            onClick={() => this.setState({ showSettings: true })}
          >
            <Settings className="svg svg-small" /> Settings
          </button>
      </div>
      </header>
    );
  }

  render() {
    // Don't render anything on initial load because every fetched module will
    // cause a re-render, which kills performance
    if (this.state.loading) {
      return <LoadingSpinner />;
    }

    const { modules, exemptions, planToTake, iblocs, exempt, iblocsModules } = this.props;

    // Sort acad years since acad years may not be inserted in display order
    const sortedModules: [string, SemesterModules][] = sortBy(
      toPairs<SemesterModules>(modules),
      (pairs) => pairs[0],
    );

    const commonProps = {
      addModule: this.onAddModule,
      addCustomData: this.onAddCustomData,
      setPlaceholderModule: this.onSetPlaceholderModule,
      removeModule: this.props.removeModule,
    };

    return (
      <div >
      <div className={styles.pageContainer}>
        <Title>Module Planner</Title>

        {this.renderHeader()}

        <DragDropContext onDragEnd={this.onDropEnd}>
          <div className={this.state.showModuleDetails ? styles.yearWrapper : styles.yearWrapperCollapsed}>
            {iblocs && (
              <section>
                <h2 className={styles.modListHeaders}>iBLOCs</h2>
                <PlannerSemester
                  year={subtractAcadYear(sortedModules[0][0])}
                  semester={IBLOCS_SEMESTER}
                  modules={iblocsModules}
                  showModuleDetails={this.state.showModuleDetails}
                  {...commonProps}
                />
              </section>
            )}

            {sortedModules.map(([year, semesters], index) => (
              this.state.showModuleDetails 
              ? <PlannerYear
                key={year}
                name={`Year ${index + 1}`}
                year={year}
                semesters={semesters} 
                {...commonProps}
              /> 
              : 
              <PlannerYearCollapsed
              key={year}
              name={`Year ${index + 1}`}
              year={year}
              semesters={semesters}
              {...commonProps}
              /> 
            ))}
          </div> 

          <div className={styles.moduleLists}>
          { exempt && (
              <section>
                <h2 className={styles.modListHeaders}>Exemptions</h2>
                <PlannerSemester
                  year={EXEMPTION_YEAR}
                  semester={EXEMPTION_SEMESTER}
                  modules={exemptions}
                  showModuleDetails={this.state.showModuleDetails}
                  {...commonProps}
                />
              </section>
            )}

            <section>
              <h1 className={styles.modListHeaders}>Plan to Take</h1>
              <PlannerSemester
                year={PLAN_TO_TAKE_YEAR}
                semester={PLAN_TO_TAKE_SEMESTER}
                modules={planToTake}
                showModuleDetails={this.state.showModuleDetails}
                {...commonProps}
              />
            </section>
          </div>
        </DragDropContext>

        <Modal
          isOpen={this.state.showSettings}
          onRequestClose={() => this.setState({ showSettings: false })}
          animate
        >
          <PlannerSettings />
        </Modal>

        <Modal
          isOpen={!!this.state.showCustomModule}
          onRequestClose={this.closeAddCustomData}
          animate
        >
          {this.state.showCustomModule && (
            <CustomModuleForm
              moduleCode={this.state.showCustomModule}
              onFinishEditing={this.closeAddCustomData}
            />
          )}
        </Modal>
      </div>
      </div> 
    );
  }
}

const mapStateToProps = (state: StoreState) => ({
  iblocs: state.planner.iblocs,
  exempt: state.planner.exempt,

  modules: getAcadYearModules(state),
  exemptions: getExemptions(state),
  planToTake: getPlanToTake(state),
  iblocsModules: getIBLOCs(state),
});

const PlannerContainer = connect(mapStateToProps, {
  fetchModule,
  toggleFeedback,
  setPlaceholderModule,
    addModule: addPlannerModule,
    resetPlanner: resetPlanner,

    moveModule: movePlannerModule,
    getModules: getAllPlanner,
    removeModule: removePlannerModule,

})(PlannerContainerComponent);

export default PlannerContainer;
