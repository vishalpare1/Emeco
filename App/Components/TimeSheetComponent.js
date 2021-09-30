import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native'
import styles from './Styles/TimeSheetComponentStyle'
import DatePickerComponent from './DatePickerComponent'
import SwitcherComponent from './SwitcherComponent'
import { Images, Metrics } from '../Themes'
import CollapsibleComponent from './CollapsibleComponent'
import {
  millisecondsInOneDay,
  getTimeDifference,
  getTimeInHrsMins,
  isNullSafe,
  getCurrentDate,
  getCurrentTime,
  getLastMonthDate,
  isGreater,
  dayDifference,
  isLessThan,
  isNotNullSafe,
  isSameDay,
} from '../Lib/Helpers'
import TimeSheetInputField from '../Components/TimeSheetInputField'
import DropDownComponent from './DropDownComponent'
import KeyboardAccessory from './KeyboardAccessory'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { timeSheetTypes, shiftDayNight } from '../Lib/Constants'
import moment from 'moment'
import SegmentedControl from './SegmentedControl'

const dateFormat = 'DD/MM'
const timeFormat = 'HH:mm'

function convertServerTimestampToDate(stp: string) {
  return moment(stp, 'Y-MM-DD HH:mm').toDate()
}

function calculateTimeDifference(startTime, endTime) {
  if (startTime && endTime) {
    if (startTime > endTime) {
      return 24 * 60 - getTimeDifference(endTime, startTime)
    } else {
      return getTimeDifference(startTime, endTime)
    }
  }
  return 0
}

function TimeSheetButton(props) {
  return (
    <View style={{...styles.button, borderColor: props.color}}>
      <TouchableOpacity
        style={styles.submitButtonView}
        onPress={props.onPress}
        disabled={props.disabled}
      >
        <Text style={[styles.text, {color: props.color, fontSize: 20}]}>{props.text}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default class TimeSheetComponent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      site: props.timesheetSite ? props.timesheetSite : '',
      shift: (props.timesheetShift !== undefined && props.timesheetShift !== '') ? props.timesheetShift : shiftDayNight.day,
      startDate: getCurrentDate(),
      endDate: getCurrentDate(),
      activeTaskIndex: 0,
      tasks: [],
      id: 0,
      shouldDisableSubmitButton: false,
      dropDownPlaceholders: ['Fleet', 'Work Order', 'Task'],
      enableScrollViewScroll: Platform.OS === 'ios',
      activeIndex: 0
    }

    this.currentFocusable = null
    this.focusables = {}
    this.focusableLayouts = {}
  }

  componentDidMount () {
    let { timeSheet, isNewTimeSheet } = this.props;
    if (timeSheet) {
      const tasks = timeSheet.tasks ? this.getTasksForTimeSheet(timeSheet.tasks, isNewTimeSheet) : []
      this.setState({
        id: isNewTimeSheet ? null : timeSheet.id,
        site: timeSheet.site,
        shift: shiftDayNight[timeSheet.shift],
        startDate: moment(timeSheet.start_date, 'YYYY-MM-DD').toDate(),
        endDate: moment(timeSheet.end_date, 'YYYY-MM-DD').toDate(),
        activeTaskIndex: 0,
        tasks: tasks
      })
    }
  }

  getTasksForTimeSheet (timeSheetTasks, isNewTimeSheet) {
    var tasks = timeSheetTasks.map((task, index) => {
      let timeSheetType = timeSheetTypes[task.time_sheet_type]
      let startTime = convertServerTimestampToDate(task.start_time);
      let endTime = convertServerTimestampToDate(task.end_time);
      let timeDifference =  calculateTimeDifference(startTime, endTime);

      switch (timeSheetType) {
        case timeSheetTypes.rental:
          return {
            timeSheetType,
            site: task.site,
            taskNumber: index + 1,
            jobDescription: task.job_description,
            taskCode: task.task_code,
            taskCodeId: task.task_code_id,
            fleetNumber: task.fleet_number,
            workOrderNumber: task.work_order_number,
            workOrderId: task.work_order_id,
            startTime: startTime,
            endTime: endTime,
            timeDifference: timeDifference,
            id: isNewTimeSheet ? null : task.id,
            activeTaskIndex: 0,
						fieldService: task.field_service,
						fieldServiceNotes: task.field_service_notes,
						customerAcceptanceSignature: task.customer_acceptance_signature
          }
        case timeSheetTypes.job_cost:
          return {
            timeSheetType,
            taskNumber: index + 1,
            division: task.division,
            job: task.job_number,
            jobNumberId: task.job_number_id,
            costCode: task.cost_code,
            costCodeId: task.cost_code_id,
            jobDescription: task.job_description,
            startTime: startTime,
            endTime: endTime,
            timeDifference: timeDifference,
            id: isNewTimeSheet ? null : task.id,
            activeTaskIndex: 0,
						fieldService: task.field_service,
						fieldServiceNotes: task.field_service_notes,
						customerAcceptanceSignature: task.customer_acceptance_signature,
          }
        case timeSheetTypes.unbilled:
          return {
            timeSheetType,
            taskNumber: index + 1,
            glEntry: task.gl_account,
            glEntryId: task.gl_account_id,
            jobDescription: task.job_description,
            startTime: startTime,
            endTime: endTime,
            timeDifference: timeDifference,
            id: isNewTimeSheet ? null : task.id,
            activeTaskIndex: 0,
          }
      }
    })
    return tasks
  }

  getStartTime(index) {
    let previousTask = this.state.tasks[index-1];
    if (previousTask) {
      return previousTask.endTime;
    } else {
      let {defaultStartTime} = this.props;
      let {startDate} = this.state;
      let startTime = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        6,
        0,
        0,
        0
      );
      if (defaultStartTime) {
        return moment(`${startTime.getFullYear()}-${startTime.getMonth() + 1}-${startTime.getDate()} ${defaultStartTime}`, 'Y-MM-DD HH:mm').toDate()
      } else {
        return startTime;
      }
    }
  }

  addTask () {
    let tasksLength = this.state.tasks.length
    let aTask = this.state.tasks[tasksLength-1];
    let task = {
      ...aTask,
      id: null,
      timeSheetType: this.props.timeSheetType,
      taskNumber: tasksLength + 1,
      startTime: this.getStartTime(tasksLength),
      endTime: this.getStartTime(tasksLength),
			customerAcceptanceSignature: null
    }
    if (task.timeSheetType === 'Rental') {
      task.site = this.state.site;
    }
    this.setState({tasks: this.state.tasks.concat(task), activeTaskIndex: tasksLength})
    this.props.onTaskAdded()
  }

  checkCollapsed (index) {
    return !(this.state.activeTaskIndex === index)
  }

  collapseStatusChanged (sectionIndex) {
    if (sectionIndex === this.state.activeTaskIndex) {
      this.setState({activeTaskIndex: -1})
    } else {
      this.setState({activeTaskIndex: sectionIndex})
    }
  }

  updateTask (keyValue, value, index) {

    let tasks = this.state.tasks
    let task = tasks[index]
    task = {
      ...task,
      [keyValue]: value,
    };

    switch (task.timeSheetType) {
      case timeSheetTypes.rental:
        // Only change in value of fleet number causes changes in other fields
        if (keyValue === 'fleetNumber') {
          task['workOrderNumber'] = ''
          this.props.onChangeFleet(value, index)
        }
        break
      case timeSheetTypes.job_cost:
        if (keyValue === 'division') {
          task['job'] = ''
          task['costCode'] = ''
          tasks[index] = task
          this.props.onChangeDivision(value, index)
        } else if (keyValue === 'job') {
          task['costCode'] = ''
          tasks[index] = task
          this.props.onChangeJob(value, task.division, index)
        }
        break
    }

    if (keyValue === 'startTime' || keyValue === 'endTime') {
      let d = this.state.startDate
      task.startTime = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        task.startTime.getHours(),
        task.startTime.getMinutes(),
      )
      task.endTime = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        task.endTime.getHours(),
        task.endTime.getMinutes(),
      )
      task.timeDifference = calculateTimeDifference(task.startTime, task.endTime)
    }

    if (keyValue === 'fieldService' && value === false) {
      task.fieldServiceNotes = null;
      task.customerAcceptanceSignature = null;
    }

    tasks = [...tasks];
    tasks[index] = task;

    this.setState({tasks: tasks, reloadData: !this.state.reloadData})
  }

  deleteTaskAtIndex (index) {
    let array = [...this.state.tasks]
    let taskId = this.state.tasks[index].id
    if (index !== -1) {
      array.splice(index, 1)
      this.setState({tasks: array})
    }
    this.props.onTaskRemoved(index, taskId)
  }

  totalTime () {
    var totalTime = 0
    this.state.tasks.forEach((task) => {
      totalTime += task.timeDifference
    })

    return totalTime > 0 ? (getTimeInHrsMins(totalTime)) : ''
  }

  updateTaskTimeSheetType(index, type) {
    let tasks = [...this.state.tasks];
    let task = {
      ...this.state.tasks[index],
      timeSheetType: type,
    };
    tasks[index] = task;
    this.setState({tasks});
  }

  renderTaskHeader (task, index) {
    const { isEditable } = this.props
    var differenceString = getTimeInHrsMins(task.timeDifference)

    return (
			<>
				<View style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between', marginHorizontal: Metrics.doubleBaseMargin, paddingVertical: 20}}>
					<Text style={styles.taskTitle}>Task {task.taskNumber}</Text>
					{
						this.state.tasks[index]['timeDifference'] !== 0 &&
						<View style={{flexDirection: 'row'}}>
							<Image style={styles.taskTimeIcon} source={Images.clockIcon} />
							<Text style={styles.taskTitle}>{differenceString}</Text>
						</View>
					}
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						{isEditable &&
						<>
							<TouchableOpacity
								onPress={() => this.deleteTaskAtIndex(index)}>
								<Image style={styles.collapseIcon} source={Images.removeIcon} />
							</TouchableOpacity>
						</>
						}
						<TouchableOpacity
							onPress={() => this.collapseStatusChanged(index)}>
							{
								this.checkCollapsed(index)
								? <Image style={styles.collapseIcon} source={Images.dropDownIcon} />
								: <Image style={styles.collapseIcon} source={Images.dropUpIcon} />
							}
						</TouchableOpacity>
					</View>
				</View>
				{
					isEditable && (task.timeSheetType === 'Job Cost' || task.timeSheetType === 'Unbilled') &&
					<View style={{flexDirection: 'row', paddingLeft: 20, paddingBottom: 20 }}>
						<SegmentedControl
							items={['Job Cost', 'Unbilled']}
							value={task.timeSheetType}
							onSelect={value => {
								this.updateTaskTimeSheetType(index, value);
							}}/>
					</View>
				}
			</>
    )
  }

  getSaveButtonText () {
    let totalTime = this.totalTime()
    return `${totalTime ? `${totalTime} - ` : ''} Save`
  }

  getSubmitButtonText (isSupervisor) {
    let totalTime = this.totalTime()
    let timeString = ''

    if (isSupervisor) {
      timeString = totalTime ? 'Approve - ' + totalTime : 'Approve'
    } else {
      timeString = totalTime ? totalTime + ' - Submit' : 'Submit'
    }

    return timeString
  }

  validateTasks (tasks, shift) {
    for (let i = 0; i < tasks.length; i++) {
      let taskNumber = i + 1

      switch (tasks[i].timeSheetType) {
        case timeSheetTypes.rental:
          if (!(
              isNullSafe(tasks[i].taskCodeId)
              && isNullSafe(tasks[i].site)
              && isNullSafe(tasks[i].fleetNumber)
              && isNullSafe(tasks[i].workOrderId)
              && isNullSafe(tasks[i].jobDescription)
            )) {
            return 'All fields in a tasks are mandatory in task # ' + taskNumber
          }
          break
        case timeSheetTypes.job_cost:
          if (!(isNullSafe(tasks[i].jobNumberId) && isNullSafe(tasks[i].costCodeId))) {
            return 'All fields in a tasks are mandatory in task # ' + taskNumber
          }
          break
        case timeSheetTypes.unbilled:
          if (!isNullSafe(tasks[i].glEntryId)) {
            return 'All fields in a tasks are mandatory in task # ' + taskNumber
          }
          break
      }
    }
  }

  validateTaskTime(mStartTime, mEndTime) {
    const { startDate, endDate } = this.state

    let mStartDate = moment(`${moment(startDate).format(`Y-MM-DD`)} 00:00:00`, 'Y-MM-DD HH:mm:ss');
    let mEndDate = moment(`${moment(endDate).format(`Y-MM-DD`)} 23:59:59`, 'Y-MM-DD HH:mm:ss');

    if (mEndTime - mStartTime === 0) {
      return 'task has zero hours against it, please check or remove this task before submitting timesheet.';
    }
    if (mEndTime < mStartTime) {
      return 'end time cannot eariler than start time.';
    }
    if (mStartTime < mStartDate) {
      return 'start time cannot eariler than start date.';
    }
    if (mStartTime > mEndDate) {
      return 'start time cannot later than end date.'
    }
    if (mEndTime < mStartDate) {
      return 'end time cannot eariler than start date.';
    }
    if (mEndTime > mEndDate) {
      return 'end time cannot later than end date.'
    }
    if (mEndTime - mStartTime > 86400000) {
      return 'cannot exceed 24 hours.'
    }
  }

  validTimeWithShift (selectedShift, startTime, endTime, taskNumber) {
    const { startDate, endDate } = this.state
    if (selectedShift === shiftDayNight.day && (startTime > endTime || startTime.getDate() < endTime.getDate())) {
      return 'For task # ' + taskNumber + ' day shift times cannot end at a time before they start'
    } if (selectedShift === shiftDayNight.night && startTime.getDate() !== endTime.getDate() && isSameDay(startDate, endDate)) {
      return 'For task # ' + taskNumber + ', since selected time is for 2 different days please make changes in date selection accordingly'
    }
  }

  validDateWithShift (startDate, endDate, selectedShift) {
    if (selectedShift === shiftDayNight.day && !isSameDay(startDate, endDate)) {
      return 'Day shift should have the same start and end day'
    } if (selectedShift === shiftDayNight.night && endDate - startDate > millisecondsInOneDay) {
      return 'End date can only be 1 more than the start date'
    }
  }

  showValidationError (message) {
    Alert.alert(
      '',
      message,
      [
        {
          text: 'OK',
          onPress: () => {
            this.setState({ shouldDisableSubmitButton: false })
          }
        }
      ],
      { cancelable: false }
    )
  }

  convertStateForSubmission(state, isSave) {
    let {startDate, endDate} = state;
    let startDateText = moment(startDate).format('Y-MM-DD')
    let endDateText = moment(endDate).format('Y-MM-DD')
    let lastEndTime = null;

    let errors = [];
    let timeSheet = {
      ...state,
      site: state.tasks[0] && state.tasks[0].site,
      startDate: startDateText,
      endDate: endDateText,
      tasks: state.tasks.map((task, taskIndex) => {
        let mStartTime = startDateText && task.startTime ? moment(`${startDateText} ${moment(task.startTime).format('HH:mm')}`, 'Y-MM-DD HH:mm') : null;
        let mEndTime = startDateText && task.endTime ? moment(`${startDateText} ${moment(task.endTime).format('HH:mm')}`, 'Y-MM-DD HH:mm') : null;

        if (!isSave) {
          while (mEndTime < mStartTime) {
            mEndTime.add(1, 'day');
          }
        }

        if (!isSave) {
          if (state.shift === shiftDayNight.night && lastEndTime) {
            while (mStartTime < lastEndTime) {
              mStartTime.add(1, 'day');
              mEndTime.add(1, 'day');
            }
          }
        }

        if (!isSave) {
          let error = this.validateTaskTime(mStartTime, mEndTime);
          if (error) {
            errors.push(`Task ${taskIndex + 1} ${error}`);
          }
          lastEndTime = mEndTime;
        }

        return {
          ...task,
          startTime: mStartTime.format('Y-MM-DD HH:mm'),
          endTime: mEndTime.format('Y-MM-DD HH:mm'),
        };
      })
    };
    return [errors, timeSheet]
  }

  validateTimesheet () {
    const { site, startDate, endDate, shift, tasks } = this.state
    const lastMonthDate = getLastMonthDate('DD/MM/YYYY')

    this.setState({shouldDisableSubmitButton: true})
    if (isNotNullSafe(site) && this.props.timeSheetType === timeSheetTypes.rental) {
      this.showValidationError('Site is mandatory')
    } else if (isNotNullSafe(startDate)) {
      this.showValidationError('Start Date is mandatory')
    } else if (isNotNullSafe(endDate)) {
      this.showValidationError('End Date is mandatory')
    } else if (isNotNullSafe(shift)) {
      this.showValidationError('Shift is mandatory')
    } else if (isGreater(startDate, endDate, dateFormat)) {
      this.showValidationError('Start Date should be less than or equal to End Date')
    } else if (isLessThan(startDate, lastMonthDate, 'DD/MM/YYYY')) {
      this.showValidationError('Start Date can only be 30 days in the past from current date')
    } else if (tasks.length <= 0) {
      this.showValidationError('Add at least 1 task')
    } else {
      let errorOnDateValidation = this.validDateWithShift(startDate, endDate, shift)

      if (errorOnDateValidation) {
        this.showValidationError(errorOnDateValidation)
      } else {
        let errorMsg = this.validateTasks(tasks, shift)
        if (errorMsg) {
          this.showValidationError(errorMsg)
        } else {
          let [errors, timeSheet] = this.convertStateForSubmission(this.state, false)
          if (errors.length > 0) {
            this.showValidationError(errors[0]);
          } else {
            console.log('validateTimesheet', timeSheet)
            this.props.onSubmit(timeSheet)
            this.setState({shouldDisableSubmitButton: false})
          }
        }
      }
    }
  }

  recallTimesheet() {
    if (this.props.onRecall) {
      this.props.onRecall(this.props.timeSheet.id);
    }
  }

  submitTimesheet () {
    this.validateTimesheet()
  }

  cancelTimesheet () {
    if (this.props.onCancel) {
      this.props.onCancel(this.props.timeSheet.id);
    }
  }

  deleteTimesheet () {
    if (this.props.onDelete) {
      this.props.onDelete(this.props.timeSheet.id);
    }
  }

  saveTimesheet () {
    let [errors, timeSheet] = this.convertStateForSubmission(this.state, true)
    if (this.props.onSave) {
      this.props.onSave(timeSheet);
    }
  }

  validateSearchableDropdown (value) {
    const { taskData } = this.props
    let isValid = false

    taskData.map((data) => {
      if (data.name === value) {
        isValid = true
      }
    })

    return isValid
  }

  onChangeSearchableDropdown (keyValue, value, index) {
    if (this.validateSearchableDropdown(value)) {
      Alert.alert('Select given value from ' + keyValue + ' dropdown')
    } else {
      this.updateTask(keyValue, value, index)
    }
  }

  onFocus (index) {
    this.setState({activeIndex: index})
    this.currentFocusable = { index, ...this.focusables[index] }
  }

  focus (from, toIndex) {
    const to = this.focusables[toIndex]
    if (to) {
      to.focus()
    }
  }

  onPreviousPress = () => {
    let toIndex = 0

    let i = this.currentFocusable.index
    if (this.currentFocusable.props.placeholder === this.state.dropDownPlaceholders[0]) {
      toIndex = 5
    } else {
      toIndex = this.currentFocusable.index - 1
    }

    this.focus(this.currentFocusable, toIndex)
  }

  onNextPress = () => {
    let toIndex = 0

    if (this.currentFocusable.index === 5) {
      if (this.state.activeTaskIndex !== -1) { toIndex = 6 + (this.state.activeTaskIndex * 4) } else { toIndex = 5 }
    } else {
      toIndex = this.currentFocusable.index + 1
    }

    this.focus(this.currentFocusable, toIndex)
  }

  onDonePress = () => {
    Keyboard.dismiss()
  }

  onChangeSite (site, index) {
    const tasks = this.state.tasks
    var tasksArray = tasks
    var taskObj = tasksArray[index];
    taskObj.fleetNumber = ''
    taskObj.workOrderNumber = ''
    taskObj.taskCode = ''
    tasksArray[index] = taskObj
    this.setState({site, tasks: tasksArray})
    this.props.onChangeSite(site, index)
  }

  scrollToInput = (reactNode: any) => {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode)
  }

  updateScrollView(enabled: boolean) {
		this.setState({ enableScrollViewScroll: enabled });
	}

  render () {
    const {siteData, navigation, isEditable, isSupervisor, isRecallable, rentalDropDowns, jobcostDropDowns, unbilledDropDowns, timeSheetType, timeSheet} = this.props

    let isRecalled = timeSheet?.status === 'recalled';
    let isSaved = timeSheet?.status === 'draft';

    return (
      <KeyboardAccessory
        contentContainerStyle={styles.fieldsContainer}
        onPreviousPress={this.onPreviousPress}
        onNextPress={this.onNextPress}
        onDonePress={this.onDonePress}
        onStartShouldSetResponderCapture={() => { this.setState({ enableScrollViewScroll: true }) }}
        activeIndex={this.state.activeIndex}
        totalFields={0}
      >
        <KeyboardAwareScrollView
          innerRef={ref => {
            this.scroll = ref
          }}
          style={styles.scrollViewContainer}
          enableAutomaticScroll={false}
          keyboardShouldPersistTaps='always'
          scrollEnabled={this.state.enableScrollViewScroll}
          extraHeight={210}
      >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.timeSheetContainer}>
              <View style={{marginHorizontal: Metrics.doubleBaseMargin}}>
                <TouchableOpacity style={styles.closeIconView} onPress={() => navigation.goBack()}>
                  <Image
                    style={styles.closeIcon}
                    source={Images.closeIcon}
                  />
                </TouchableOpacity>
                <View style={styles.startEndDate}>
                  <DatePickerComponent
                    date={this.state.startDate}
                    onDateChange={(startDate) => this.setState({startDate})}
                    title={'START DATE'}
                    titleStyle={styles.dateTitle}
                    mode={'date'}
                    disabled={!isEditable}
                    placeholder='select date'
                    format={dateFormat}
                    margin={'right'}
                    placeholderTextStyle={styles.datePickerPlaceholder}
                    dateInputStyle={styles.dateInputStyle}
                  />

                  <DatePickerComponent
                    date={this.state.endDate}
                    onDateChange={(endDate) => this.setState({endDate})}
                    title={'END DATE'}
                    titleStyle={styles.dateTitle}
                    mode={'date'}
                    disabled={!isEditable}
                    placeholder='select date'
                    format={dateFormat}
                    margin={'left'}
                    placeholderTextStyle={styles.datePickerPlaceholder}
                    dateInputStyle={styles.dateInputStyle}
                  />
                </View>

                <SwitcherComponent
                  label={'Shift'}
                  selectedShift={this.state.shift}
                  onSwitch={(shift) => this.setState({shift})}
                  isEditable={isEditable}
                />
              </View>

              <View style={{marginTop: 20}}>
                {
                  this.state.tasks.map((task, index) => {
                    return (
                      <View style={{backgroundColor: '#333333'}} key={index}>
                        <View style={styles.collapsibleContainer}>
                          {this.renderTaskHeader(task, index)}
                        </View>
                        <CollapsibleComponent
                          content={task.timeSheetType}
                          isEditable={isEditable}
                          isCollapsed={this.checkCollapsed(index)}

                          taskData={rentalDropDowns.tasksDropdownData[index] && rentalDropDowns.tasksDropdownData[index].task}
                          siteData={siteData}
                          fleetNumberData={rentalDropDowns.fleetNumberData}
                          workOrderNumberData={rentalDropDowns.tasksDropdownData[index] && rentalDropDowns.tasksDropdownData[index].wo}

                          costData={jobcostDropDowns.costData}
                          divisionData={jobcostDropDowns.divisionData}
                          jobData={jobcostDropDowns.jobsData}

                          glEntryData={unbilledDropDowns.glEntryData}

                          task={task}

                          onFocusDropDown={(type) => {
                            switch (type) {
                              case 'FLEET': {
                                this.props.requestDropDownList('FLEET', task.site, index)
                                break;
                              }
                              case 'WORK_ORDER': {
                                let wo = rentalDropDowns.tasksDropdownData[index] && rentalDropDowns.tasksDropdownData[index].wo
                                if ((!wo || wo.length === 0) && task.fleetNumber) {
                                  this.props.requestDropDownList('WORK_ORDER', task.fleetNumber, index)
                                }
                                break;
                              }
                              case 'JOB': {
                                let jo = jobcostDropDowns.jobsData
                                if ((!jo || jo.length === 0) && task.division) {
                                  this.props.requestDropDownList('JOB', task.division, index)
                                }
                                break;
                              }
                              case 'COST_CODE': {
                                let co = jobcostDropDowns.costData
                                if ((!co || co.length === 0) && task.job) {
                                  this.props.requestDropDownList('COST_CODE', [task.job, task.division], index)
                                }
                                break;
                              }
                            }
                            // requestDropDownList
                          }}

                          onChangeStartTime={(startTime) => this.updateTask('startTime', startTime.e, index)}

                          onChangeEndTime={(endTime) => this.updateTask('endTime', endTime.e, index)}

                          onChangeTaskCode={(taskCode) => {
                            this.updateTask('taskCode', taskCode.e.name, index)
                            this.updateTask('taskCodeId', taskCode.e.id, index)
                          }}

                          onChangeSite={(site) => {
                            if (site.e !== this.state.site) {
                              this.onChangeSite(site.e, index)
                            }
                            this.updateTask('site', site.e, index)
                          }}

                          onChangeFleetNumber={(fleetNumber) => this.updateTask('fleetNumber', fleetNumber.e, index)}

                          onChangeWorkOrderNumber={(workOrderNumber) => {
                            this.updateTask('workOrderNumber', workOrderNumber.e.name, index)
                            this.updateTask('workOrderId', workOrderNumber.e.id, index)
                          }}

                          onChangeCostCode={(costCode) =>{
                            this.updateTask('costCode', costCode.e.name, index)
                            this.updateTask('costCodeId', costCode.e.id, index)
                          }}

                          onChangeDivision={(division) => this.updateTask('division', division.e, index)}

                          onChangeJob={(job) => {
                            this.updateTask('job', job.e.name, index)
                            this.updateTask('jobNumberId', job.e.id, index)
                          }}

                          onChangeGlEntry={(glEntry) => {
                            this.updateTask('glEntry', glEntry.e.name, index)
                            this.updateTask('glEntryId', glEntry.e.id, index)
                          }}

                          onChangeJobDescription={(jobDescription) => this.updateTask('jobDescription', jobDescription, index)}
                          onChangeFieldService={(fieldService) => this.updateTask('fieldService', fieldService, index)}
                          onChangeFieldServiceNotes={(fieldServiceNotes) => this.updateTask('fieldServiceNotes', fieldServiceNotes, index)}
                          onChangeCustomerAcceptance={(customerAcceptance) => this.updateTask('customerAcceptanceSignature', customerAcceptance, index)}

                          taskIndex={index === 0 ? 6 : (6 + (index * 4))}
                          scrollToInput={this.scrollToInput}

                          onFocusInputField={(index) => this.onFocus(index)}
                          focusables={this.focusables}
                          dropDownPlaceholders={this.state.dropDownPlaceholders}
                          setEnableScrollViewScrollState={(state) => this.setState({enableScrollViewScroll: state})}
                        />
                        <View style={{height: 2, width: '100%', backgroundColor: 'rgba(0,0,0,0.27)'}} />
                      </View>
                    )
                  })
                }
              </View>
              {
                isEditable &&
                <TouchableOpacity style={{flexDirection: 'row', marginTop: 20, marginHorizontal: Metrics.doubleBaseMargin}}
                  onPress={() => this.addTask()}>
                  <Image style={styles.closeIcon} source={Images.addTask} />
                  <Text style={styles.taskHeadingText}>Add Task</Text>
                </TouchableOpacity>
              }
              <View style={styles.buttons}>
                {(isEditable && !isSupervisor) &&
                  <TimeSheetButton
                    color="#66A322"
                    disabled={this.state.shouldDisableSubmitButton}
                    text={this.getSaveButtonText()}
                    onPress={() => this.saveTimesheet()}
                  />
                }
                {isEditable &&
                  <TimeSheetButton
                    color={isSupervisor ? '#66A322' : 'white'}
                    disabled={this.state.shouldDisableSubmitButton}
                    text={this.getSubmitButtonText(isSupervisor)}
                    onPress={() => this.submitTimesheet()}
                  />
                }
                {
                  (isEditable && isSupervisor) &&
                  <TimeSheetButton
                    color={isSupervisor ? '#D33C23' : 'white'}
                    disabled={this.state.shouldDisableSubmitButton}
                    text="Cancel"
                    onPress={() => this.cancelTimesheet()}
                  />
                }
                {
                  (isRecalled || isSaved) &&
                  <TimeSheetButton
                    color={'#D33C23'}
                    disabled={this.state.shouldDisableSubmitButton}
                    text="Delete"
                    onPress={() => this.deleteTimesheet()}
                  />
                }
                {isRecallable &&
                  <TimeSheetButton
                    color={'#D33C23'}
                    disabled={this.state.shouldDisableSubmitButton}
                    text="Recall Timesheet"
                    onPress={() => this.recallTimesheet()}
                  />
                }
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </KeyboardAccessory>
    )
  }
}
