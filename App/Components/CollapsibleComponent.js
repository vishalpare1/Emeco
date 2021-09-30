import React, { Component } from 'react'
import styles from './Styles/CollapsibleComponentStyle'

import { View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import DatePickerComponent from './DatePickerComponent'
import DropDownComponent from './DropDownComponent'
import Metrics from '../Themes/Metrics'
import TimeSheetInputField from './TimeSheetInputField'
import { timeSheetTypes } from '../Lib/Constants'
import FieldServiceComponent from "./FieldServiceComponent";

const Dimensions = require('Dimensions')
let { width } = Dimensions.get('window')

export default class CollapsibleComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }

	onFocusInputField (index, layoutIndex) {
    this.props.onFocusInputField(index, layoutIndex)
  }

  renderTaskDetail () {
    const { task, onChangeStartTime, onChangeEndTime, isEditable, content, taskIndex
          } = this.props

    return (
      <View style={{marginHorizontal: Metrics.doubleBaseMargin, marginBottom: Metrics.doubleBaseMargin}}>

        <View style={styles.startEndDate}>
          <DatePickerComponent
            date={task.startTime}
            onDateChange={(e) => onChangeStartTime({e})}
            title={'START TIME'}
            titleStyle={styles.dateTitle}
            dateStyle={styles.datePicker}
            mode={'time'}
            placeholder='Select time'
            disabled={!isEditable}
            margin={'right'}
            placeholderTextStyle={styles.datePickerPlaceholder}
            dateInputStyle={styles.dateInputStyle}
          />

          <DatePickerComponent
            date={task.endTime}
            onDateChange={(e) => onChangeEndTime({e})}
            title={'END TIME'}
            titleStyle={styles.dateTitle}
            dateStyle={styles.datePicker}
            mode={'time'}
            placeholder='Select time'
            disabled={!isEditable}
            margin={'left'}
            placeholderTextStyle={styles.datePickerPlaceholder}
            dateInputStyle={styles.dateInputStyle}
          />
        </View>
        {
          content === timeSheetTypes.rental &&
          this.renderRentalTaskDetail()
        }
        {
          content === timeSheetTypes.job_cost &&
          this.renderJobCostTaskDetail()
        }
        {
          content === timeSheetTypes.unbilled &&
          this.renderUnbilledTaskDetail()
        }
      </View>
    )
  }

  renderRentalTaskDetail () {
    const { taskData, siteData, fleetNumberData, workOrderNumberData, onChangeTaskCode, onChangeSite, onChangeFleetNumber,
						onChangeWorkOrderNumber, task, isEditable, focusables, taskIndex, dropDownPlaceholders,
						setEnableScrollViewScrollState, onChangeJobDescription, onChangeFieldService,
						onChangeFieldServiceNotes, onChangeCustomerAcceptance } = this.props;

    return (
      <View>
        <View style={{paddingTop: 30}}>
          <DropDownComponent
            label={'SITE'}
            placeholder={'Site'}
            data={siteData}
            containerStyle={{
              width: '100%'}}
            width={'100%'}
            onChangeText={(e) => onChangeSite({e})}
            disabled={!isEditable}
            value={task.site}
            onFocusDropdown={(event) => { this.props.scrollToInput(event.target); this.onFocusInputField(taskIndex) }}
            setRef={ref => focusables[taskIndex + 2] = ref}
            setEnableScrollViewScrollState={(state) => setEnableScrollViewScrollState(state)}
          />
        </View>
        <View style={styles.dropDownView}>
          <DropDownComponent
            label={'FLEET'}
            placeholder={dropDownPlaceholders[0]}
            data={fleetNumberData}
            onChangeText={(e) => onChangeFleetNumber({e})}
            disabled={!isEditable}
            value={task.fleetNumber}
            multiline
            numberOfLines={2}
            containerStyle={{
              marginRight: 10,
              minWidth: (0.42 * width) - 25,
              width: (0.42 * width) - 25
            }}
            width={(0.42 * width) - 25}
            inputFieldMargin={'right'}
            onFocusDropdown={(event) => { this.props.onFocusDropDown('FLEET'); this.props.scrollToInput(event.target); this.onFocusInputField(taskIndex + 1) }}
            setRef={ref => focusables[taskIndex] = ref}
            setEnableScrollViewScrollState={(state) => setEnableScrollViewScrollState(state)}
          />

          <DropDownComponent
            label={'WORK ORDER'}
            placeholder={dropDownPlaceholders[1]}
            data={workOrderNumberData}
            onChange={(e) => onChangeWorkOrderNumber({e})}
            disabled={!isEditable}
            containerStyle={{
              minWidth: (0.58 * width) - 25,
              width: (0.58 * width) - 25
            }}
            width={(0.58 * width) - 25}
            value={task.workOrderNumber}
            multiline
            numberOfLines={2}
            inputFieldMargin={'left'}
            onFocusDropdown={(event) => { this.props.onFocusDropDown('WORK_ORDER'); this.props.scrollToInput(event.target); this.onFocusInputField(taskIndex + 2) }}
            setRef={ref => focusables[taskIndex + 1] = ref}
            setEnableScrollViewScrollState={(state) => setEnableScrollViewScrollState(state)}
          />
        </View>
        <View style={{ marginTop: 28 }}>
          <TimeSheetInputField
            label={'WORK ORDER DESCRIPTION'}
            value={'ASSEMBLE BOTH FRONT AND CORNERS'}
            placeholder={'Work Order Description'}
            //onChange={(e) => onChangeJobDescription(e)}
            isEditable={false}
            isFromCollapsible
            onFocus={(event) => { this.props.scrollToInput(event.target); this.onFocusInputField(taskIndex + 4) }}
            setRef={ref => focusables[taskIndex + 3] = ref}
          />
        </View>
        <View style={{paddingTop: 30}}>
          <DropDownComponent
            label={'TASK'}
            placeholder={'Task'}
            data={taskData}
            onChange={(e) => onChangeTaskCode({e})}
            disabled={!isEditable}
            value={task.taskCode}
            multiline
            numberOfLines={2}
            containerStyle={{
              width: '100%'}}
            width={'100%'}
            onFocusDropdown={(event) => { this.props.scrollToInput(event.target); this.onFocusInputField(taskIndex + 3) }}
            setRef={ref => focusables[taskIndex + 2] = ref}
            setEnableScrollViewScrollState={(state) => setEnableScrollViewScrollState(state)}
          />
        </View>
        <View style={{ marginTop: 28 }}>
          <TimeSheetInputField
            label={'JOB DESCRIPTION'}
            value={task.jobDescription}
            placeholder={'Job Description'}
            onChange={(e) => onChangeJobDescription(e)}
            isEditable={isEditable}
            isFromCollapsible
            onFocus={(event) => { this.props.scrollToInput(event.target); this.onFocusInputField(taskIndex + 4) }}
            setRef={ref => focusables[taskIndex + 3] = ref}
          />
        </View>
				<View style={{ marginTop: 28 }}>
					<FieldServiceComponent
						task={task}
						isEditable={isEditable}
						onChangeFieldService={(e) => onChangeFieldService(e)}
						onChangeFieldServiceNotes={(e) => onChangeFieldServiceNotes(e)}
						onChangeCustomerAcceptance={(e) => onChangeCustomerAcceptance(e)}
					/>
				</View>
      </View>
    )
  }

  renderJobCostTaskDetail () {
    const { costData, divisionData, jobData, onChangeCostCode, onChangeDivision, onChangeJob, onChangeJobDescription, task, isEditable,
            focusables, taskIndex, setEnableScrollViewScrollState, onChangeFieldService, onChangeFieldServiceNotes,
						onChangeCustomerAcceptance } = this.props

    return (
      <View>
        <View style={styles.jobCostDropDownContanier}>
          <DropDownComponent
            label={'JOB'}
            placeholder={'Job'}
            data={jobData}
            onChange={(e) => onChangeJob({e})}
            disabled={!isEditable}
            containerStyle={{
              width: '100%'
            }}
            width={'100%'}
            value={task.job}
            multiline
            numberOfLines={2}
            onFocusDropdown={(event) => { this.props.onFocusDropDown('JOB'); this.props.scrollToInput(event.target); this.onFocusInputField(taskIndex + 1) }}
            setRef={ref => focusables[taskIndex + 1] = ref}
            setEnableScrollViewScrollState={(state) => setEnableScrollViewScrollState(state)}
          />
        </View>
        <View style={styles.jobCostDropDownContanier}>
          <DropDownComponent
            label={'COST CODE'}
            placeholder={'Cost Code'}
            data={costData}
            onChange={(e) => onChangeCostCode({e})}
            disabled={!isEditable}
            value={task.costCode}
            multiline
            numberOfLines={2}
            containerStyle={{
              width: '100%'}}
            width={'100%'}
            onFocusDropdown={(event) => { this.props.onFocusDropDown('COST_CODE'); this.props.scrollToInput(event.target); this.onFocusInputField(taskIndex + 2) }}
            setRef={ref => focusables[taskIndex + 2] = ref}
            setEnableScrollViewScrollState={(state) => setEnableScrollViewScrollState(state)}
          />
        </View>
        <View style={{ marginTop: 28 }}>
          <TimeSheetInputField
            label={'JOB DESCRIPTION'}
            value={task.jobDescription}
            placeholder={'Job Description'}
            onChange={(e) => onChangeJobDescription(e)}
            isEditable={isEditable}
            isFromCollapsible
            onFocus={(event) => { this.props.scrollToInput(event.target); this.onFocusInputField(taskIndex + 3) }}
            setRef={ref => focusables[taskIndex + 3] = ref}
          />
        </View>
				<View style={{ marginTop: 28 }}>
					<FieldServiceComponent
						task={task}
						isEditable={isEditable}
						onChangeFieldService={(e) => onChangeFieldService(e)}
						onChangeFieldServiceNotes={(e) => onChangeFieldServiceNotes(e)}
						onChangeCustomerAcceptance={(e) => onChangeCustomerAcceptance(e)}
					/>
				</View>
      </View>
    )
  }

  renderUnbilledTaskDetail () {
    const { isEditable, task, onChangeGlEntry, onChangeJobDescription, glEntryData, focusables, taskIndex, setEnableScrollViewScrollState } = this.props
    return (
      <View>
        <View style={{paddingTop: 28}}>
          <DropDownComponent
            label={'GL ENTRY'}
            placeholder={'GL Entry'}
            data={glEntryData}
            onChange={(e) => onChangeGlEntry({e})}
            disabled={!isEditable}
            value={task.glEntry}
            multiline
            numberOfLines={2}
            containerStyle={{
              width: '100%'}}
            width={'100%'}
            onFocusDropdown={(event) => { this.props.scrollToInput(event.target); this.onFocusInputField(taskIndex) }}
            setRef={ref => focusables[taskIndex] = ref}
            setEnableScrollViewScrollState={(state) => setEnableScrollViewScrollState(state)}
          />
        </View>
        <View style={{ marginTop: 28 }}>
          <TimeSheetInputField
            label={'JOB DESCRIPTION'}
            value={task.jobDescription}
            placeholder={'Job Description'}
            onChange={(e) => onChangeJobDescription(e)}
            isEditable={isEditable}
            isFromCollapsible
            onFocus={(event) => { this.props.scrollToInput(event.target); this.onFocusInputField(taskIndex + 3) }}
            setRef={ref => focusables[taskIndex + 3] = ref}
          />
        </View>
      </View>
    )
  }

  render () {
    const { props } = this
    let isCollapsed = props.hasOwnProperty('isCollapsed') ? props.isCollapsed : this.state.collapsed

    return (
      <View >
        <Collapsible collapsed={isCollapsed} style={{...styles.collapsibleContainer}}>
          {this.renderTaskDetail()}
        </Collapsible>
      </View>
    )
  }
}
