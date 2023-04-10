import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store'
import { REGULAR_CALENDAR } from '@src/constants'
import { IBoardState, initialBoardState } from '@src/context/config/board/boardSlice'
import { initialPipelineToolState, IPipelineToolState } from '@src/context/config/pipelineTool/pipelineToolSlice'
import { initialSourceControlState, ISourceControl } from '@src/context/config/sourceControl/sourceControlSlice'
import { REQUIRED_DATA } from '@src/constants'

export interface BasicConfigState {
  isProjectCreated: boolean
  basic: {
    projectName: string
    calendarType: string
    dateRange: {
      startDate: string | null
      endDate: string | null
    }
    metrics: string[]
  }
  board: IBoardState
  pipelineTool: IPipelineToolState
  sourceControl: ISourceControl
}

export const initialBasicConfigState: BasicConfigState = {
  isProjectCreated: true,
  basic: {
    projectName: '',
    calendarType: REGULAR_CALENDAR,
    dateRange: {
      startDate: null,
      endDate: null,
    },
    metrics: [],
  },
  board: initialBoardState,
  pipelineTool: initialPipelineToolState,
  sourceControl: initialSourceControlState,
}

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    ...initialBasicConfigState,
    board: { ...initialBoardState },
    pipelineTool: { ...initialPipelineToolState },
    sourceControl: { ...initialSourceControlState },
  },
  reducers: {
    updateProjectName: (state, action) => {
      state.basic.projectName = action.payload
    },
    updateCalendarType: (state, action) => {
      state.basic.calendarType = action.payload
    },
    updateDateRange: (state, action) => {
      const { startDate, endDate } = action.payload
      state.basic.dateRange = { startDate, endDate }
    },
    updateMetrics: (state, action) => {
      const {
        VELOCITY,
        CYCLE_TIME,
        CLASSIFICATION,
        LEAD_TIME_FOR_CHANGES,
        DEPLOYMENT_FREQUENCY,
        CHANGE_FAILURE_RATE,
        MEAN_TIME_TO_RECOVERY,
      } = REQUIRED_DATA

      state.basic.metrics = action.payload

      state.board.isShow = [VELOCITY, CYCLE_TIME, CLASSIFICATION].some((metric) => state.basic.metrics.includes(metric))

      state.pipelineTool.isShow = [
        LEAD_TIME_FOR_CHANGES,
        DEPLOYMENT_FREQUENCY,
        CHANGE_FAILURE_RATE,
        MEAN_TIME_TO_RECOVERY,
      ].some((metric) => state.basic.metrics.includes(metric))
      state.sourceControl.isShow = [LEAD_TIME_FOR_CHANGES].some((metric) => state.basic.metrics.includes(metric))
      state.basic.metrics = action.payload
    },
    updateBasicConfigState: (state, action) => {
      state.basic = action.payload
      state.board.config = action.payload.boardConfig || state.board.config
      state.pipelineTool.config = action.payload.pipelineToolConfig || state.pipelineTool.config
      state.sourceControl.config = action.payload.sourceControlConfig || state.sourceControl.config
    },
    updateProjectCreatedState: (state, action) => {
      state.isProjectCreated = action.payload
    },
    updateBoardVerifyState: (state, action) => {
      state.board.isVerified = action.payload
    },
    updateBoard: (state, action) => {
      state.board.config = action.payload
    },
    updateJiraVerifyResponse: (state, action) => {
      const { jiraColumns, targetFields, users } = action.payload
      state.board.verifiedResponse.jiraColumns = jiraColumns
      state.board.verifiedResponse.targetFields = targetFields
      state.board.verifiedResponse.users = users
    },

    updatePipelineToolVerifyState: (state, action) => {
      state.pipelineTool.isVerified = action.payload
    },
    updatePipelineTool: (state, action) => {
      state.pipelineTool.config = action.payload
    },
    updatePipelineToolVerifyResponse: (state, action) => {
      const { pipelineList } = action.payload
      state.pipelineTool.verifiedResponse.pipelineList = pipelineList
    },

    updateSourceControlVerifyState: (state, action) => {
      state.sourceControl.isVerified = action.payload
    },
    updateSourceControl: (state, action) => {
      state.sourceControl.config = action.payload
    },
    updateSourceControlVerifiedResponse: (state, action) => {
      const { githubRepos } = action.payload
      state.sourceControl.verifiedResponse.repoList = githubRepos
    },
  },
})
export const {
  updateProjectCreatedState,
  updateProjectName,
  updateCalendarType,
  updateDateRange,
  updateMetrics,
  updateBoard,
  updateBoardVerifyState,
  updateJiraVerifyResponse,
  updateBasicConfigState,
  updatePipelineToolVerifyState,
  updatePipelineTool,
  updatePipelineToolVerifyResponse,
  updateSourceControl,
  updateSourceControlVerifyState,
  updateSourceControlVerifiedResponse,
} = configSlice.actions

export const selectProjectName = (state: RootState) => state.config.basic.projectName
export const selectCalendarType = (state: RootState) => state.config.basic.calendarType
export const selectDateRange = (state: RootState) => state.config.basic.dateRange
export const selectMetrics = (state: RootState) => state.config.basic.metrics
export const selectBoard = (state: RootState) => state.config.board.config
export const isPipelineToolVerified = (state: RootState) => state.config.pipelineTool.isVerified
export const selectPipelineTool = (state: RootState) => state.config.pipelineTool.config
export const isSourceControlVerified = (state: RootState) => state.config.sourceControl.isVerified
export const selectSourceControl = (state: RootState) => state.config.sourceControl.config
export const selectConfig = (state: RootState) => state.config

export const selectIsBoardVerified = (state: RootState) => state.config.board.isVerified
export const selectUsers = (state: RootState) => state.config.board.verifiedResponse.users
export const selectJiraColumns = (state: RootState) => state.config.board.verifiedResponse.jiraColumns
export const selectTargetFields = (state: RootState) => state.config.board.verifiedResponse.targetFields

export default configSlice.reducer