import { BOARD_TYPES, PIPELINE_TOOL_TYPES, REGULAR_CALENDAR, SOURCE_CONTROL_TYPES } from './fixtures'
import { BasicConfigState } from '@src/context/config/configSlice'

const initialConfigState: BasicConfigState = {
  isProjectCreated: true,
  basic: {
    projectName: '',
    calendarType: REGULAR_CALENDAR,
    dateRange: {
      startDate: '',
      endDate: '',
    },
    metrics: [],
  },
  board: {
    config: {
      type: BOARD_TYPES.JIRA,
      boardId: '',
      email: '',
      projectKey: '',
      site: '',
      token: '',
    },
    isVerified: false,
    isShow: false,
    verifiedResponse: {
      jiraColumns: [],
      targetFields: [],
      users: [],
    },
  },
  pipelineTool: {
    config: {
      type: PIPELINE_TOOL_TYPES.BUILD_KITE,
      token: '',
    },
    isVerified: false,
    isShow: false,
    verifiedResponse: {
      pipelineList: [],
      pipelineCrews: [],
    },
  },
  sourceControl: {
    config: {
      type: SOURCE_CONTROL_TYPES.GITHUB,
      token: '',
    },
    isVerified: false,
    isShow: false,
    verifiedResponse: {
      repoList: [],
    },
  },
  warningMessage: '',
}

export default initialConfigState
