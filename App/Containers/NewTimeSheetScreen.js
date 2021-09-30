import React, { Component } from 'react'
import { Alert, View } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/NewTimeSheetScreenStyle'
import TimeSheetComponent from '../Components/TimeSheetComponent'
import TimeSheetActions, { postTimeSheet, putTimeSheet, deleteTimeSheet, recallTimeSheet, saveTimeSheet, deleteSavedTimeSheet } from '../Redux/TimeSheetRedux'
import Loader from '../Components/Loader'
import { getCurrentDateInFormat } from '../Lib/Helpers'
import TimeSheetFiltersActions from '../Redux/TimeSheetFiltersRedux'
import { timeSheetTypes, timeSheetTypeCode, timeSheetTypesArray, shiftDayNightArray } from '../Lib/Constants'

class NewTimeSheetScreen extends Component {
  constructor (props) {
    super(props)

    let siteData = []
    let tasks = []
    let divisions = []
    let glEntries = []
    if (!this.props.isConnected) {
      siteData = this.parseSiteData(this.props.sites)
      tasks = this.parseTaskData(this.props.tasks)
      divisions = this.parseDivisionData(this.props.divisions)
      glEntries = this.parseGlEntryData(this.props.glEntries)
    }
    let isNewTimeSheet = this.props.navigation.getParam('isNewTimeSheet')
    let isSupervisor = this.props.navigation.getParam('isSupervisor')
    let isRecallable = this.props.navigation.getParam('isRecallable')
    let isEditable = false
    if (isNewTimeSheet || isSupervisor) {
      isEditable = true
    }
    let workOrders1 = JSON.parse(this.props.navigation.getParam('workOrders1') ? this.props.navigation.getParam('workOrders1') : '[]')
    let workOrders2 = JSON.parse(this.props.navigation.getParam('workOrders2') ? this.props.navigation.getParam('workOrders2') : '[]')
    let workOrders = workOrders1.concat(workOrders2)
    let tasksForFleets = this.getTasksForFleets(this.props.tasksData)
    let workOrdersForFleets = this.getWorkOrdersForFleets(workOrders)
    const fleetsForSites = this.getFleetsForSites(this.props.fleetsData, tasksForFleets, workOrdersForFleets)

    this.state = {
      isEditable: isEditable,
      isNewTimeSheet: isNewTimeSheet,
      isSupervisor: isSupervisor,
      isRecallable: isRecallable,
      fetching: false,
      alertPresent: false,
      siteData: siteData,
      rentalDropDowns: {
        taskData: tasks,
        fleetNumberData: [],
        tasksDropdownData: []
      },
      jobCostDropDowns: {
        divisionData: divisions,
        jobsData: [],
        costData: []
      },
      unbilledDropDowns: {
        glEntryData: glEntries
      },
      activeTaskIndex: 0,
      selectedSite: props.timesheetSite ? props.timesheetSite : '',
      timeSheetType: '',
      removedTaskIds: [],
      fleetsForSites: fleetsForSites
    }
  }

  componentDidMount () {
    this.reloadTimeSheet();
  }

  reloadTimeSheet() {
    let isNewTimeSheet = this.props.navigation.getParam('isNewTimeSheet')
    let isSupervisor = this.props.navigation.getParam('isSupervisor')
    let isRecallable = this.props.navigation.getParam('isRecallable')
    let timesheet = this.props.navigation.getParam('timesheet')
    let timeSheetType = timesheet ? timeSheetTypes[timesheet.time_sheet_type] : this.props.navigation.getParam('timeSheetType')

    let selectedSite = ''
    let isEditable = false
    if (isNewTimeSheet || isSupervisor) {
      isEditable = true
    }

    const isConnected = this.props.isConnected
    if (isEditable) {
      if (timeSheetType === timeSheetTypes.rental) {
        if (isConnected) {
          this.getSites(timeSheetType)
        }
      }

      switch (timeSheetType) {
        case timeSheetTypes.rental:
          let site = ''
          if (this.props.timesheetSite) {
            site = this.props.timesheetSite
          } else if (isSupervisor && timesheet.site && timesheet.site !== '') {
            site = timesheet.site
          }
          if (site.length) {
            if (isConnected) {
              this.getFleets(site)
            } else {
              this.setOfflineRentalFleets(site)
            }
          }
          this.setOfflineSiteAndTasksData(site)
          selectedSite = site
          break
        case timeSheetTypes.job_cost:
        case timeSheetTypes.unbilled:
            if (isConnected) {
            this.getJobs()
            this.getGlEntry()
          } else {
            this.setOfflineJobCostJobs()
            this.setOfflineUnbilledData()
          }
          break
      }
    }

    this.setState({isEditable, isNewTimeSheet, isSupervisor, isRecallable, timeSheetType, selectedSite})
  }

  // *---------------- Set offline data ----------------*

  getFleetsForSites (fleets, tasksForFleets, workOrdersForFleets) {
    let fleetsForSites = {}

    if (fleets) {
      fleets.map((fleet, index) => {
        let key = fleet.equipment_location
        let fleetObj = Object.assign({}, fleet)
        fleetObj.tasks = tasksForFleets[fleet.equipment_branch]
        fleetObj.workOrder = workOrdersForFleets[fleet.equipment_id]
        if (fleetsForSites[key]) {
          let values = fleetsForSites[key]
          values.push(fleetObj)
          fleetsForSites[key] = values
        } else {
          fleetsForSites[key] = [fleetObj]
        }
      })
    }

    return fleetsForSites
  }

  getTasksForFleets (tasks) {
    let tasksForFleets = {}
    if (tasks) {
      tasks.map((task, index) => {
        let key = task.equipment_branch
        if (tasksForFleets[key]) {
          let values = tasksForFleets[key]
          values.push(task)
          tasksForFleets[key] = values
        } else {
          tasksForFleets[key] = [task]
        }
      })
    }

    return tasksForFleets
  }

  getWorkOrdersForFleets (workOrders) {
    let workOrdersForFleets = {}
    if (workOrders) {
      workOrders.map((workOrder, index) => {
        let key = workOrder.equipment_id
        if (workOrdersForFleets[key]) {
          let values = workOrdersForFleets[key]
          values.push(workOrder)
          workOrdersForFleets[key] = values
        } else {
          workOrdersForFleets[key] = [workOrder]
        }
      })
    }

    return workOrdersForFleets
  }

  setOfflineSiteAndTasksData () {
    if (this.props.tasksData && this.props.sitesData) {
      let rentalDropDowns = this.state.rentalDropDowns
      let tasks = this.props.tasksData
      let sites = this.props.sitesData

      let siteData = []
      if (sites) {
        siteData = this.parseSiteData(sites)
      }

      let tasksData = []
      if (tasks) {
        tasksData = this.parseTaskData(tasks)
      }

      rentalDropDowns.taskData = tasksData

      this.setState({siteData, rentalDropDowns})
    }
  }

  setOfflineRentalFleets (selectedSite) {
    let rentalDropDowns = this.state.rentalDropDowns
    let isSupervisor = this.props.navigation.getParam('isSupervisor')
    if (this.props.fleetsData) {
      const fleetsForSite = this.state.fleetsForSites && this.state.fleetsForSites[selectedSite]
      if (fleetsForSite) {
        rentalDropDowns.fleetNumberData = this.parseFleetData(fleetsForSite)
      } else {
        rentalDropDowns.fleetNumberData = []
      }
    } else {
      if (isSupervisor) {
        let rentalDropDowns = this.state.rentalDropDowns
        let timeSheet = this.props.navigation.getParam('timesheet')
        let tasksDropdownData = []
        const tasks = timeSheet.tasks
        tasks.forEach((task, index) => {
          tasksDropdownData[index] = {wo: [], task: []}
        })
        rentalDropDowns.tasksDropdownData = tasksDropdownData
      }
    }
    this.setState({rentalDropDowns})
  }

  setOfflineRentalWosAndTasks (selectedFleetId, selectedFleetBranch) {
    if (this.state.fleetsForSites) {
      let rentalDropDowns = this.state.rentalDropDowns
      let fleets = this.state.fleetsForSites[this.state.selectedSite]

      let tasks = []
      let wos = []
      for (let i = 0; i < fleets.length; i++) {
        let fleet = fleets[i]
        if (fleet.equipment_id === selectedFleetId) {
          tasks = fleet.tasks
          wos = fleet.workOrder
        }
      }

      rentalDropDowns.tasksDropdownData[this.state.activeTaskIndex] = {
        'wo': this.parseWorkOrderData(wos || []),
        'task': this.parseTaskData(tasks || [])
      }
      this.setState({rentalDropDowns})
    }
  }

  setOfflineUnbilledData () {
    if (this.props.unBilledData) {
      const glEntries = this.props.unBilledData

      let unbilledDropDowns = this.state.unbilledDropDowns
      unbilledDropDowns.glEntryData = this.parseGlEntryData(glEntries)
      this.setState({unbilledDropDowns})
    }
  }

  setOfflineJobCostDivisions () {
    if (this.props.jobCostData) {
      const jobCostData = this.props.jobCostData

      let divisions = []
      for (let key in jobCostData) {
        divisions.push({'name': key})
      }
      let jobCostDropDowns = this.state.jobCostDropDowns
      jobCostDropDowns.divisionData = this.parseDivisionData(divisions)
      this.setState({jobCostDropDowns})
    }
  }

  setOfflineJobCostJobs () {
    if (this.props.jobCostData) {
      const jobCostData = this.props.jobCostData

      let jobCostDropDowns = this.state.jobCostDropDowns
      if (jobCostData) {
        jobCostDropDowns.jobsData = this.parseJobData(jobCostData)
      } else {
        jobCostDropDowns.jobsData = []
      }
      this.setState({jobCostDropDowns})
    }
  }

  setOfflineCostCodeData (selectedJob) {
    if (this.props.jobCostData) {
      const jobCostData = this.props.jobCostData

      let jobCostDropDowns = this.state.jobCostDropDowns
      let jobs = jobCostData

      let costCodesForJob = []
      for (let i = 0; i < jobs.length; i++) {
        let job = jobs[i]
        if (job.job_number === selectedJob) {
          costCodesForJob = job.costCodes
        }
      }
      if (costCodesForJob) {
        jobCostDropDowns.costData = this.parseCostCodeData(costCodesForJob)
      } else {
        jobCostDropDowns.costData = []
      }
      this.setState({jobCostDropDowns})
    }
  }

  getSites (timeSheetType) {
    const headers = this.props.loginResponse.headers
    this.props.getTimeSheetSites(headers, timeSheetType)
  }

  // *-------------- API calls for Rental time sheets --------------*

  getFleets (selectedSite) {
    const headers = this.props.loginResponse.headers

    const data = {
      'equipment_location': selectedSite
    }

    this.props.getTimeSheetFleets(data, headers)
  }

  getWos (equipmentId, equipmentBranch) {
    const headers = this.props.loginResponse.headers

    const data = {
      'equipment_id': equipmentId
    }

    this.props.getTimeSheetWos(data, headers, equipmentBranch)
  }

  // *-------------- API calls for Cost Jobs time sheets --------------*

  getDivisions () {
    const headers = this.props.loginResponse.headers

    this.props.getTimeSheetDivisions(headers)
  }

  getJobs () {
    const headers = this.props.loginResponse.headers

    const data = {}

    this.props.getTimeSheetJobs(data, headers)
  }

  getCostCodes (job) {
    const headers = this.props.loginResponse.headers

    const data = {
      'job_number': job
    }

    this.props.getTimeSheetCostCodes(data, headers)
  }

	// *-------------- API calls for unbilled time sheets --------------*

  getGlEntry () {
    const headers = this.props.loginResponse.headers

    this.props.getTimeSheetGlEntry(headers)
  }

  // *-------------- Filter calls for Rental time sheets --------------*

  updateFleetSubFilters (selectedFleetId, index) {
    this.setState({activeTaskIndex: index})
    const selectedFleetBranch = this.getFleetBranchfor(selectedFleetId)
    if (this.props.isConnected) {
      this.getWos(selectedFleetId, selectedFleetBranch)
    } else {
      this.setOfflineRentalWosAndTasks(selectedFleetId, selectedFleetBranch)
    }
  }

  getFleetBranchfor (fleetId) {
    let selectedFleetBranch = ''
    const fleets = this.state.rentalDropDowns.fleetNumberData

    fleets.forEach((fleet, index) => {
      if (fleet.name === fleetId) {
        selectedFleetBranch = fleet.branch
      }
    })

    return selectedFleetBranch
  }

  getJobNumberfor (jobName) {
    if (jobName) {
      let m = jobName.match(/\((.+)\)/)
      if (m) {
        return m[1]
      }
    }
    return jobName;
  }

  // *-------------- Filter calls for Cost Jobs time sheets --------------*

  updateDivisionSubFilters (selectedDivision, index) {
    this.setState({activeTaskIndex: index})
    if (this.props.isConnected) {
      this.getJobs(selectedDivision)
    } else {
      this.setOfflineJobCostJobs(selectedDivision)
    }
  }

  updateJobSubFilters (selectedJob, division, index) {
    this.setState({activeTaskIndex: index})
    const selectedJobNumber = this.getJobNumberfor(selectedJob)
    if (this.props.isConnected) {
      this.getCostCodes(selectedJobNumber)
    } else {
      this.setOfflineCostCodeData(selectedJobNumber, division)
    }
  }

  updateSiteSubFilters (selectedSite, index) {
    this.setState({activeTaskIndex: index})
    switch (this.state.timeSheetType) {
      case timeSheetTypes.rental:
        let rentalDropDowns = this.state.rentalDropDowns
        const tasksDropdownData = rentalDropDowns.tasksDropdownData
        const allTasks = rentalDropDowns.taskData
        let array = []

        tasksDropdownData.forEach((taskData, index) => {
          let obj = taskData
          obj.wo = []
          obj.task = allTasks
          array[index] = obj
        })

        rentalDropDowns.fleetNumberData = []
        rentalDropDowns.tasksDropdownData = tasksDropdownData
        this.setState({rentalDropDowns, selectedSite})
        if (this.props.isConnected) {
          this.getFleets(selectedSite)
        } else {
          this.setOfflineRentalFleets(selectedSite)
        }

        break
    }
  }

  addDropDownData () {
    switch (this.state.timeSheetType) {
      case timeSheetTypes.rental:
        let rentalDropDowns = this.state.rentalDropDowns
        rentalDropDowns.tasksDropdownData = rentalDropDowns.tasksDropdownData.concat({wo: [], task: rentalDropDowns.taskData})
        this.setState({ rentalDropDowns })
        break
    }
  }

  removeDropDownDataFor (index, taskId) {
    let removedTaskIds = this.state.removedTaskIds

    removedTaskIds.push(taskId)

    switch (this.state.timeSheetType) {
      case timeSheetTypes.rental:
        let rentalDropDowns = this.state.rentalDropDowns
        let array = [...rentalDropDowns.tasksDropdownData]
        if (index !== -1) {
          array.splice(index, 1)
          rentalDropDowns.tasksDropdownData = array
          this.setState({ rentalDropDowns })
        }
        break
    }
  }

  confirm(message) {
    return new Promise((resolve, reject) => {
      if (!this.state.alertPresent) {
        Alert.alert('', message, [
          {
            text: 'Yes',
            onPress: () => {
              this.setState({fetching: true})
              resolve(true)
            }
          },
          {
            text: 'No',
            onPress: () => resolve(false),
          }
        ],
        { cancelable: false })
      } else {
        return false;
      }
    });

  }

  async submit (data) {
    let confirmed = await this.confirm(this.getConfirmationText());
    if (confirmed) {
      this.setState({fetching: true})
      this.confirmSubmission(data)
    }
  }

  async recall(timeSheetId) {
    let confirmed = await this.confirm('Are you sure to recall this time sheet?');
    if (confirmed) {
      this.setState({fetching: true})
      this.confirmRecall(timeSheetId)
    }
  }

  async cancel(timeSheetId) {
    let confirmed = await this.confirm('Are you sure to cancel this time sheet?');
    if (confirmed) {
      this.setState({fetching: true})
      this.confirmCancel(timeSheetId)
    }
  }

  async delete(timeSheetId) {
    let confirmed = await this.confirm('Are you sure to delete this time sheet?');
    if (confirmed) {
      let tempId = this.props.navigation.getParam('timesheet')?.tempId
      if (!tempId) {
        this.setState({fetching: true})
        this.confirmDelete(timeSheetId)
      } else {
        this.props.deleteSavedTimeSheet({time_sheet: {id: timeSheetId, tempId}, id: timeSheetId})
        Alert.alert('Draft timesheet has been deleted.')
        this.props.navigation.goBack();
      }
    }
  }

  async save(state) {
    let timeSheet = this.getTimeSheetForSave(state)
    const headers = this.props.loginResponse.headers
    let tempId = this.props.navigation.getParam('timesheet')?.tempId

    this.props.saveTimeSheet({time_sheet: timeSheet, headers, tempId})

    Alert.alert('Saved')

    this.props.navigation.goBack();
  }

  getConfirmationText () {
    return this.state.isSupervisor ? 'Are sure to approve time sheet?' : 'Are sure to submit time sheet?'
  }

  getDefaultStartTime() {
    return this.props.loginResponse.data && this.props.loginResponse.data.default_start_time
  }

  confirmSubmission (data) {
    const headers = this.props.loginResponse.headers

    let offlineMessage = ''
    let timeSheet
    let isOffline = !this.props.isConnected
    if (!this.state.isSupervisor) { // is staff user. And staff can only submit once
      let tempId = this.props.navigation.getParam('timesheet')?.tempId
      let originalId = this.props.navigation.getParam('timesheet')?.id
      timeSheet = this.getTimeSheetForSubmission(data)
      let payload = {time_sheet: timeSheet, headers, isOffline, tempId};
      if (originalId) {
        payload.original_time_sheet_id = originalId
      }
      this.props.postTimeSheet(payload)
      offlineMessage = 'submitted'
    } else { // is supervisor user. Supervisor can edit and approve time sheet
      const removedTaskIds = this.state.removedTaskIds
      timeSheet = this.getTimeSheetForApproval(data)
      const id = data.id
      this.props.putTimeSheet({time_sheet: timeSheet, headers, id, isOffline, removedTaskIds})
      offlineMessage = 'approved'
    }

    if (!this.props.isConnected) {
      if (this.state.isSupervisor) {
        this.props.setOfflineApprovedSheets(data.id)
      } else {
        this.props.setOfflineSubmittedSheets(timeSheet)
      }
      this.setState({fetching: true})
      let message = 'Since you are offline, your time sheet will be ' + offlineMessage + ' when your are connected to internet'
      setTimeout(() => this.showAlertAndPopScreen(message), 5000)
    }
  }

  confirmRecall(id) {
    const headers = this.props.loginResponse.headers

    let isOffline = !this.props.isConnected
    this.props.recallTimeSheet({time_sheet: {id}, headers, id, isOffline})

    if (!this.props.isConnected) {
      this.props.setOfflineRecalledSheets(id)
      this.setState({fetching: true})
      let message = 'Since you are offline, your time sheet will be recalled when your are connected to internet'
      setTimeout(() => this.showAlertAndPopScreen(message), 5000)
    }
  }

  confirmCancel(id) {
    const headers = this.props.loginResponse.headers

    let isOffline = !this.props.isConnected
    this.props.deleteTimeSheet({time_sheet: {id}, headers, id, isOffline, isDelete: false})

    if (!this.props.isConnected) {
      this.props.setOfflineCanceledSheets(id)
      this.setState({fetching: true})
      let message = 'Since you are offline, your time sheet will be canceled when your are connected to internet'
      setTimeout(() => this.showAlertAndPopScreen(message), 5000)
    }
  }

  confirmDelete(id) {
    const headers = this.props.loginResponse.headers

    let isOffline = !this.props.isConnected
    this.props.deleteTimeSheet({time_sheet: {id}, headers, id, isOffline, isDelete: true})

    if (!this.props.isConnected) {
      this.props.setOfflineCanceledSheets(id)
      this.setState({fetching: true})
      let message = 'Since you are offline, your time sheet will be deleted when your are connected to internet'
      setTimeout(() => this.showAlertAndPopScreen(message), 5000)
    }
  }


  showAlertAndPopScreen (message) {
    Alert.alert('', message)
    this.props.navigation.pop()
  }

  getTotalTimeAndTasks (tasksArray, id, shouldApproveTS, isSave = false) {
    let tasks = []
    let totalTime = 0

    tasksArray.forEach((task, index) => {
      totalTime += task.timeDifference

      let taskObj = {
        time_sheet_type: !isSave ? timeSheetTypeCode[task.timeSheetType] : timeSheetTypesArray[timeSheetTypeCode[task.timeSheetType]],
        start_time: task.startTime,
        end_time: task.endTime,
      }

      switch (task.timeSheetType) {
        case timeSheetTypes.rental:
          taskObj.job_description = task.jobDescription
          taskObj.task_code_id = task.taskCodeId
          taskObj.site = task.site
          taskObj.fleet_number = task.fleetNumber
          taskObj.work_order_id = task.workOrderId
					taskObj.field_service = task.fieldService ?? false
					taskObj.field_service_notes = task.fieldServiceNotes
          if (typeof task.customerAcceptanceSignature === 'string') {
            taskObj.customer_acceptance_signature = task.customerAcceptanceSignature
          }
          if (isSave) {
            taskObj.work_order_number = task.workOrderNumber
            taskObj.task_code = task.taskCode
          }
          break
        case timeSheetTypes.job_cost:
          taskObj.division = task.division
          taskObj.job_number_id = task.jobNumberId
          taskObj.cost_code_id = task.costCodeId
          taskObj.job_description = task.jobDescription
					taskObj.field_service = task.fieldService ?? false
					taskObj.field_service_notes = task.fieldServiceNotes
          if (typeof task.customerAcceptanceSignature === 'string') {
            taskObj.customer_acceptance_signature = task.customerAcceptanceSignature
          }
          if (isSave) {
            taskObj.job_number = task.job
            taskObj.cost_code = task.costCode
          }
          break
        case timeSheetTypes.unbilled:
          taskObj.gl_account_id = task.glEntryId
          taskObj.job_description = task.jobDescription
          if (isSave) {
            taskObj.gl_account = task.glEntry
          }
          break
      }

      if (shouldApproveTS) {
        taskObj['time_sheet_id'] = id
        taskObj['id'] = task.id
      }

      tasks[index] = taskObj
    })

    return [tasks, totalTime]
  }

  getTimeSheetForSave(data) {

    let timeSheet = this.props.navigation.getParam('timesheet')

    const currentUser = this.props.loginResponse.data
    const [tasks, totalTime] = this.getTotalTimeAndTasks(data.tasks, data.id, false, true)
    return {
      'id': timeSheet?.id,
      'submitted_at': getCurrentDateInFormat("Y-MM-DD HH:mm"),
      'time_sheet_type': timeSheetTypesArray[timeSheetTypeCode[this.state.timeSheetType]],
      'staff_id': currentUser.id.toString(),
      'supervisor_id': currentUser.supervisor_id ? currentUser.supervisor_id.toString() : null,
      'site': data.site,
      'shift': shiftDayNightArray[data.shift],
      'start_date': data.startDate,
      'end_date': data.endDate,
      'total_time': totalTime.toString(),
      'tasks': tasks
    }
  }

  getTimeSheetForSubmission (data) {
    const currentUser = this.props.loginResponse.data
    const [tasks, totalTime] = this.getTotalTimeAndTasks(data.tasks, data.id, false)
    return {
      'submitted_at': getCurrentDateInFormat("Y-MM-DD HH:mm"),
      'time_sheet_type': timeSheetTypeCode[this.state.timeSheetType],
      'staff_id': currentUser.id.toString(),
      'supervisor_id': currentUser.supervisor_id ? currentUser.supervisor_id.toString() : null,
      'site': data.site,
      'shift': data.shift,
      'start_date': data.startDate,
      'end_date': data.endDate,
      'total_time': totalTime.toString(),
      'tasks_attributes': tasks
    }
  }

  getTimeSheetForApproval (data) {
    const currentUser = this.props.loginResponse.data
    const [tasks, totalTime] = this.getTotalTimeAndTasks(data.tasks, data.id, true)
    return {
      'approved_at': getCurrentDateInFormat('Y-MM-DD HH:mm'),
      'approved_by_id': currentUser.id.toString(),
      'time_sheet_type': timeSheetTypeCode[this.state.timeSheetType],
      'status': 1,
      'site': data.site,
      'shift': data.shift,
      'start_date': data.startDate,
      'end_date': data.endDate,
      'total_time': totalTime.toString(),
      'tasks_attributes': tasks
    }
  }

  showAlertWithMessageAndPopScreen (message, popScreen, reset) {
    let that = this
    that.setState({ alertPresent: true })
    Alert.alert(
      '',
      message,
      [
        {
          text: 'OK',
          onPress: () => {
            if (popScreen) {
            	reset()
              that.props.navigation.pop()
              that.setState({ alertPresent: false })
            }
          }
        }
      ],
      { cancelable: false }
    )
  }

  showAlertWithMessageAndResetTimesheet (message, reset) {
    let that = this
    that.setState({ alertPresent: true })
    Alert.alert(
      '',
      message,
      [
        {
          text: 'OK',
          onPress: () => {
            reset()
            that.setState({ alertPresent: false })
          }
        }
      ],
      { cancelable: false }
    )
  }

  componentWillReceiveProps (nextProps) {
    const { submitting, fetchingFilters, resetTimesheetCreation, method, sites, fleets, workOrders, divisions,
      jobs, costCodes, glEntries, timesheetFiltersData, isOffline,
      filterType, tasks, errorMsg, resetFilters, response, requestData } = nextProps
    const error = nextProps.error && nextProps.errorData ? nextProps.errorData : ''
    if (!submitting && (method === 'post' || method === 'put' || method === 'delete') && !fetchingFilters) {
      if (error && !this.state.alertPresent) {
        this.showAlertWithMessageAndResetTimesheet(error, resetTimesheetCreation)
      } else {
        if (!this.state.alertPresent && !this.props.error && !isOffline) {
          if (method === 'delete') {
            this.showAlertWithMessageAndPopScreen(`Time sheet has been ${requestData.isDelete ? 'deleted' : 'canceled'} successfully`, true, resetTimesheetCreation)
          } else if (method === 'post' ) {
            this.showAlertWithMessageAndPopScreen('Time sheet has been submitted successfully', true, resetTimesheetCreation)
          } else if (method === 'put') {
            let pop = this.state.isSupervisor && response.data.status === 'approved';
            this.showAlertWithMessageAndPopScreen(`Time sheet has been ${response.data.status} successfully`, pop, resetTimesheetCreation)
            if (!pop && response.data.status === 'recalled') {
              resetTimesheetCreation();
              this.props.navigation.replace('NewTimeSheetScreen', {
                timesheet: response.data,
                workOrders1: this.props.workOrders1,
                workOrders2: this.props.workOrders2,
                isNewTimeSheet: true,
                timeSheetType: this.state.timeSheetType,
                isSupervisor: false,
                isRecallable: false,
              })
            }
          }
        }
      }
    }

    let states = {fetching: (submitting || fetchingFilters), error}
    if (!fetchingFilters && timesheetFiltersData && filterType && (!errorMsg || errorMsg === '')) {
      const index = this.state.activeTaskIndex
      let rentalDropDowns = this.state.rentalDropDowns
      let jobCostDropDowns = this.state.jobCostDropDowns
      let unbilledDropDowns = this.state.unbilledDropDowns
      switch (filterType) {
        case 'site':
          const siteData = this.parseSiteData(sites)
          states['siteData'] = siteData
          const taskData = this.parseTaskData(tasks)
          if (!this.state.isSupervisor) {
            if (rentalDropDowns.tasksDropdownData.length > index) {
              rentalDropDowns.tasksDropdownData = this.setTasksDropDown([], taskData, index)
              states['rentalDropDowns'] = rentalDropDowns
            } else {
              rentalDropDowns.taskData = taskData
              states['rentalDropDowns'] = rentalDropDowns
            }
          } else {
            let timeSheet = this.props.navigation.getParam('timesheet')
            let tasksDropdownData = []
            const tasks = timeSheet.tasks
            tasks.forEach((task, index) => {
              tasksDropdownData[index] = {wo: [], task: taskData}
            })
            rentalDropDowns.tasksDropdownData = tasksDropdownData
            rentalDropDowns.taskData = taskData
            states['rentalDropDowns'] = rentalDropDowns
          }
          break
        case 'fleet':
          rentalDropDowns.fleetNumberData = this.parseFleetData(fleets)
          states['rentalDropDowns'] = rentalDropDowns
          break
        case 'wo':
          const workOrderNumberData = this.parseWorkOrderData(workOrders)
          rentalDropDowns.tasksDropdownData = this.setTasksDropDown(workOrderNumberData, this.parseTaskData(tasks), index)
          states['rentalDropDowns'] = rentalDropDowns
          break
        case 'division':
          jobCostDropDowns.divisionData = this.parseDivisionData(divisions)
          states['jobCostDropDowns'] = jobCostDropDowns
          break
        case 'job':
          jobCostDropDowns.jobsData = this.parseJobData(jobs)
          states['jobCostDropDowns'] = jobCostDropDowns
          break
        case 'costCode':
          jobCostDropDowns.costData = this.parseCostCodeData(costCodes)
          states['jobCostDropDowns'] = jobCostDropDowns
          break
        case 'glEntry':
          unbilledDropDowns.glEntryData = this.parseGlEntryData(glEntries)
          states['unbilledDropDowns'] = unbilledDropDowns
          break
      }
    } else {
      if (errorMsg && errorMsg !== '' && !this.state.alertPresent) {
        this.showAlertWithMessageAndResetTimesheet(errorMsg, resetFilters)
      }
    }

    this.setStateOnReceiveProps(states)
  }

  setTasksDropDown (woData, tasksData, index) {
    let tasksDropdownData = this.state.rentalDropDowns.tasksDropdownData
    let tasksDropDown = tasksDropdownData[index]
    if (woData.length > 0) {
      tasksDropdownData[index] = {'wo': woData, 'task': tasksData}
    } else {
      tasksDropdownData[index] = {'wo': tasksDropDown.wo, 'task': tasksData}
    }

    return tasksDropdownData
  }

  setStateOnReceiveProps (states) {
    this.setState(states)
  }

  parseSiteData (sites) {
    let siteData = []
    sites.forEach((site, index) => {
      siteData[index] = {'name': site, 'id': index + 1}
    })

    return siteData
  }

  // *-------------- Data parse functions for Rental time sheets --------------*

  parseFleetData (fleets) {
    let fleetData = []
    fleets.forEach((fleet, index) => {
      fleetData[index] = {'name': fleet.equipment_id, 'branch': fleet.equipment_branch}
    })

    return fleetData
  }

  parseWorkOrderData (workOrders) {
    let workOrdersData = []
    workOrders.forEach((workOrder, index) => {
      workOrdersData[index] = {'name': workOrder.wo_number, 'id': workOrder.id}
    })

    return workOrdersData
  }

  parseTaskData (tasks) {
    let taskData = []
    tasks.forEach((task, index) => {
      taskData[index] = {'name': task.wo_task_description, 'id': task.id}
    })

    return taskData
  }

  // *-------------- Data parse functions for Job Cost time sheets --------------*

  parseDivisionData (divisions) {
    let divisionData = []
    divisions.forEach((division, index) => {
      divisionData[index] = {'name': division.name, 'id': division.id}
    })

    return divisionData
  }

  parseJobData (jobs) {
    let jobsData = []
    jobs.forEach((job, index) => {
      jobsData[index] = {'name': job.job_name + ' (' + job.job_number + ')', 'number': job.job_number, 'id': job.id}
    })

    return jobsData
  }

  parseCostCodeData (costs) {
    let costData = []
    costs.forEach((cost, index) => {
      costData[index] = {'name': `${cost.cost_code} (${cost.cost_code_description})`, 'id': cost.id}
    })

    return costData
  }

  // *-------------- Data parse functions for Unbilled time sheets --------------*

  parseGlEntryData (glEntries) {
    let glEntryData = []
    glEntries.forEach((glEntry, index) => {
      glEntryData[index] = {'name': glEntry.gl_account_description, 'id': glEntry.id}
    })

    return glEntryData
  }

  render () {
    const { fetching } = this.state
    const { timesheetSite, timesheetShift } = this.props
    let timeSheet = this.props.navigation.getParam('timesheet')
    let timeSheetType = this.props.navigation.getParam('timeSheetType')

    return (
      <View style={styles.container}>
        <TimeSheetComponent
          onSubmit={(state) => this.submit(state)}
          onRecall={(timeSheetId) => this.recall(timeSheetId)}
          onCancel={(timeSheetId) => this.cancel(timeSheetId)}
          onDelete={(timeSheetId) => this.delete(timeSheetId)}
          onSave={(state) => this.save(state)}
          defaultStartTime={this.getDefaultStartTime()}
          siteData={this.state.siteData}
          rentalDropDowns={this.state.rentalDropDowns}
          jobcostDropDowns={this.state.jobCostDropDowns}
          unbilledDropDowns={this.state.unbilledDropDowns}
          timeSheetType={timeSheetType}
          navigation={this.props.navigation}
          isEditable={this.state.isEditable}
          timeSheet={timeSheet}
          isNewTimeSheet={this.state.isNewTimeSheet}
          isSupervisor={this.state.isSupervisor}
          isRecallable={this.state.isRecallable}
          timesheetSite={timesheetSite}
          timesheetShift={timesheetShift}
          requestDropDownList={(type, data, index) => {
            switch (type) {
              case 'FLEET':
                this.updateSiteSubFilters(data, index);
                break;
              case 'WORK_ORDER':
                this.updateFleetSubFilters(data, index);
                break;
              case 'JOB':
                this.updateDivisionSubFilters(data, index);
                break;
              case 'COST_CODE':
                this.updateJobSubFilters(data[0], data[1], index);
                break;
            }
          }}
          onChangeSite={(site, index) => this.updateSiteSubFilters(site, index)}
          onChangeFleet={(fleet, index) => this.updateFleetSubFilters(fleet, index)}
          onChangeDivision={(division, index) => this.updateDivisionSubFilters(division, index)}
          onChangeJob={(job, division, index) => this.updateJobSubFilters(job, division, index)}
          onTaskAdded={() => this.addDropDownData()}
          onTaskRemoved={(index, taskId) => this.removeDropDownDataFor(index, taskId)}
            />
        {
          fetching &&
          <Loader isLoading={fetching} />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    submitting: state.timeSheets.fetching,
    fetchingFilters: state.timeSheetFilters.fetching,
    response: state.timeSheets.payload,
    error: state.timeSheets.error,
    errorData: state.timeSheets.errorData,
    method: state.timeSheets.method,
    loginResponse: state.login.payload,
    timesheetSite: state.timeSheets.timesheetSite,
    sites: state.timeSheetFilters.sites,
    fleets: state.timeSheetFilters.fleets,
    workOrders: state.timeSheetFilters.workOrders,
    tasks: state.timeSheetFilters.tasks,
    divisions: state.timeSheetFilters.divisions,
    jobs: state.timeSheetFilters.jobs,
    costCodes: state.timeSheetFilters.costCodes,
    glEntries: state.timeSheetFilters.glEntries,
    requestData: state.timeSheets.data,
    isOffline: state.timeSheets.isOffline,
    timesheetShift: state.timeSheets.timesheetShift,
    timesheetFiltersData: state.timeSheetFilters.payload,
    downloadedData: state.syncData.downloadedData,
    sitesData: state.syncData.sitesData,
    fleetsData: state.syncData.fleetsData,
    tasksData: state.syncData.tasksData,
    jobCostData: state.syncData.jobCostData,
    unBilledData: state.syncData.unBilledData,

    errorMsg: state.timeSheetFilters.errorMsg,
    filterType: state.timeSheetFilters.filterType,
    isConnected: state.network.isConnected,
    queue: state.network.actionQueue.map(a => a.type)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setOfflineSubmittedSheets: (data) => dispatch(TimeSheetActions.setOfflineSubmittedSheets(data)),
    setOfflineApprovedSheets: (id) => dispatch(TimeSheetActions.setOfflineApprovedSheets(id)),
    setOfflineRecalledSheets: (id) => dispatch(TimeSheetActions.setOfflineRecalledSheets(id)),
    setOfflineCanceledSheets: (id) => dispatch(TimeSheetActions.setOfflineCanceledSheets(id)),
    postTimeSheet: (data, headers, isOffline) => dispatch(postTimeSheet(data, headers, isOffline)),
    putTimeSheet: (data, headers, id, isOffline, removedTaskIds) => dispatch(putTimeSheet(data, headers, id, isOffline, removedTaskIds)),
    deleteTimeSheet: (data, headers, id, isOffline) => dispatch(deleteTimeSheet(data, headers, id, isOffline)),
    recallTimeSheet: (data, headers, id, isOffline) => dispatch(recallTimeSheet(data, headers, id, isOffline)),
    saveTimeSheet: (data, headers, id, isOffline) => dispatch(saveTimeSheet(data, headers, id, isOffline)),
    deleteSavedTimeSheet: (data, headers, id, isOffline) => dispatch(deleteSavedTimeSheet(data, headers, id, isOffline)),
    getTimeSheetSites: (headers, timeSheetType) => dispatch(TimeSheetFiltersActions.getTimeSheetSites(headers, timeSheetType)),
    getTimeSheetFleets: (data, headers) => dispatch(TimeSheetFiltersActions.getTimeSheetFleets(data, headers)),
    getTimeSheetWos: (data, headers, equipmentBranch) => dispatch(TimeSheetFiltersActions.getTimeSheetWos(data, headers, equipmentBranch)),
    getTimeSheetTasks: (data, headers) => dispatch(TimeSheetFiltersActions.getTimeSheetWos(data, headers)),
    getTimeSheetDivisions: (headers) => dispatch(TimeSheetFiltersActions.getTimeSheetDivisions(headers)),
    getTimeSheetJobs: (data, headers, equipmentBranch) => dispatch(TimeSheetFiltersActions.getTimeSheetJobs(data, headers, equipmentBranch)),
    getTimeSheetCostCodes: (data, headers) => dispatch(TimeSheetFiltersActions.getTimeSheetCostCodes(data, headers)),
    getTimeSheetGlEntry: (headers) => dispatch(TimeSheetFiltersActions.getTimeSheetGlEntry(headers)),
    resetTimesheet: () => dispatch(TimeSheetActions.resetTimesheet()),
    resetTimesheetCreation: () => dispatch(TimeSheetActions.resetTimesheetCreation()),
    resetFilters: () => dispatch(TimeSheetFiltersActions.resetFilters())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTimeSheetScreen)
