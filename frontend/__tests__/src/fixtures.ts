import { CSVReportRequestDTO, ReportRequestDTO } from '@src/clients/report/dto/request'

export const PROJECT_NAME = 'Heartbeat'
export const PROJECT_DESCRIPTION =
  'Heartbeat is a tool for tracking project delivery metrics that can help you get a better understanding of delivery performance. This product allows you easily get all aspects of source data faster and more accurate to analyze team delivery performance which enables delivery teams and team leaders focusing on driving continuous improvement and enhancing team productivity and efficiency.'

export const ZERO = 0

export const REGULAR_CALENDAR = 'Regular Calendar(Weekend Considered)'

export const CHINA_CALENDAR = 'Calendar with Chinese Holiday'

export const NEXT = 'Next'

export const BACK = 'Previous'

export const SAVE = 'Save'

export const VERIFY = 'Verify'

export const RESET = 'Reset'

export const EXPORT_PIPELINE_DATA = 'Export pipeline data'

export const EXPORT_BOARD_DATA = 'Export board data'

export const EXPORT_METRIC_DATA = 'Export metric data'

export const VERIFIED = 'Verified'

export const TOKEN_ERROR_MESSAGE = ['Token is invalid', 'Token is required']

export const PROJECT_NAME_LABEL = 'Project name'

export const STEPPER = ['Config', 'Metrics', 'Report']

export const REQUIRED_DATA_LIST = [
  'All',
  'Velocity',
  'Cycle time',
  'Classification',
  'Lead time for changes',
  'Deployment frequency',
  'Change failure rate',
  'Mean time to recovery',
]
export const ALL = 'All'
export const VELOCITY = 'Velocity'
export const CYCLE_TIME = 'Cycle time'
export const CLASSIFICATION = 'Classification'
export const LEAD_TIME_FOR_CHANGES = 'Lead time for changes'
export const DEPLOYMENT_FREQUENCY = 'Deployment frequency'
export const CHANGE_FAILURE_RATE = 'Change failure rate'
export const MEAN_TIME_TO_RECOVERY = 'Mean time to recovery'
export const REQUIRED_DATA = 'Required metrics'
export const TEST_PROJECT_NAME = 'test project Name'
export const ERROR_MESSAGE_COLOR = 'color: #d32f2f'
export const ERROR_DATE = '02/03/'
export const CREATE_NEW_PROJECT = 'Create a new project'
export const IMPORT_PROJECT_FROM_FILE = 'Import project from file'
export const EXPORT_EXPIRED_CSV_MESSAGE = 'The report has been expired, please generate it again'

export const BOARD_TYPES = {
  CLASSIC_JIRA: 'Classic Jira',
  JIRA: 'Jira',
}

export const PIPELINE_TOOL_TYPES = {
  BUILD_KITE: 'BuildKite',
  GO_CD: 'GoCD',
}

export const SOURCE_CONTROL_TYPES = {
  GITHUB: 'GitHub',
}

export enum CONFIG_TITLE {
  BOARD = 'Board',
  PIPELINE_TOOL = 'Pipeline Tool',
  SOURCE_CONTROL = 'Source Control',
}

export const BOARD_FIELDS = ['Board', 'Board Id', 'Email', 'Project Key', 'Site', 'Token']
export const PIPELINE_TOOL_FIELDS = ['Pipeline Tool', 'Token']
export const SOURCE_CONTROL_FIELDS = ['Source Control', 'Token']

export const BASE_URL = 'api/v1'
export const MOCK_BOARD_URL_FOR_JIRA = `${BASE_URL}/boards/jira`
export const MOCK_BOARD_URL_FOR_CLASSIC_JIRA = `${BASE_URL}/boards/classic-jira`
export const MOCK_PIPELINE_URL = `${BASE_URL}/pipelines/buildkite`
export const MOCK_SOURCE_CONTROL_URL = `${BASE_URL}/source-control`
export const MOCK_REPORT_URL = `${BASE_URL}/reports`
export const MOCK_VERSION_URL = `${BASE_URL}/version`
export const MOCK_EXPORT_CSV_URL = `${BASE_URL}/reports/:dataType/:fileName`

export const VERSION_RESPONSE = {
  version: '1.11',
}

export enum VERIFY_ERROR_MESSAGE {
  BAD_REQUEST = 'Please reconfirm the input',
  UNAUTHORIZED = 'Token is incorrect',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  NOT_FOUND = '404 Not Found',
  PERMISSION_DENIED = 'Permission denied',
  REQUEST_TIMEOUT = 'Request Timeout',
  UNKNOWN = 'Unknown',
}

export const VERIFY_FAILED = 'verify failed'

export const MOCK_BOARD_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: BOARD_TYPES.JIRA,
  site: '1',
  projectKey: '1',
  startTime: 1613664000000,
  endTime: 1614873600000,
  boardId: '1',
}

export const MOCK_CLASSIC_JIRA_BOARD_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: BOARD_TYPES.CLASSIC_JIRA,
  site: '2',
  projectKey: '2',
  startTime: 1613664000000,
  endTime: 1614873600000,
  boardId: '2',
}

export const MOCK_PIPELINE_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: PIPELINE_TOOL_TYPES.BUILD_KITE,
  startTime: 1613664000000,
  endTime: 1614873600000,
}

export const MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS = {
  token: 'mockToken',
  type: SOURCE_CONTROL_TYPES.GITHUB,
  startTime: 1613664000000,
  endTime: 1614873600000,
}

export const MOCK_GENERATE_REPORT_REQUEST_PARAMS: ReportRequestDTO = {
  metrics: [],
  startTime: '1613664000000',
  endTime: '1614873600000',
  considerHoliday: true,
  buildKiteSetting: {
    token: 'mockToken',
    type: PIPELINE_TOOL_TYPES.BUILD_KITE,
    pipelineCrews: [],
    deploymentEnvList: [
      {
        id: 'mockPipelineId',
        name: 'mockPipelineName',
        orgId: 'mockOrgId',
        orgName: 'mockOrgName',
        repository: 'mockRep',
        step: 'step',
        branches: [],
      },
    ],
  },
  codebaseSetting: {
    type: 'github',
    token: 'mockToken',
    leadTime: [
      {
        id: 'mockPipelineId',
        name: 'mockPipelineName',
        orgId: 'mockOrgId',
        orgName: 'mockOrgName',
        repository: 'mockRep',
        step: 'step',
        branches: [],
      },
    ],
  },
  jiraBoardSetting: {
    token: 'mockToken',
    type: BOARD_TYPES.CLASSIC_JIRA,
    site: '2',
    projectKey: '2',
    boardId: '2',
    boardColumns: [{ name: 'In Analysis', value: 'In Analysis' }],
    treatFlagCardAsBlock: true,
    users: ['user1', 'user2'],
    assigneeFilter: 'lastAssignee',
    targetFields: [{ key: 'parent', name: 'Parent', flag: false }],
    doneColumn: ['Done'],
  },
}

export const IMPORTED_NEW_CONFIG_FIXTURE = {
  projectName: 'ConfigFileForImporting',
  metrics: ['Velocity', 'Cycle time', 'Classification', 'Lead time for changes'],
  dateRange: {
    startDate: '2023-03-16T00:00:00.000+08:00',
    endDate: '2023-03-30T23:59:59.999+08:00',
  },
  calendarType: 'Calendar with Chinese Holiday',
  board: {
    type: 'Classic Jira',
    verifyToken: 'mockVerifyToken',
    boardId: '1963',
    token: 'mockToken',
    site: 'mockSite',
    email: 'test@test.com',
    projectKey: 'PLL',
  },
  pipeline: 'mockToken',
  pipelineTool: {
    type: 'BuildKite',
    token: 'mockToken',
  },
  sourceControl: {
    type: 'GitHub',
    token: '',
  },
  crews: ['lucy', 'hi hi', 'Yu Zhang'],
  classification: ['type', 'Parent'],
  cycleTime: [
    {
      'In Analysis': 'To do',
    },
    {
      'Ready For Dev': 'Analysis',
    },
  ],
}

export const MOCK_EXPORT_CSV_REQUEST_PARAMS: CSVReportRequestDTO = {
  csvTimeStamp: 1613664000000,
  dataType: 'pipeline',
  startDate: IMPORTED_NEW_CONFIG_FIXTURE.dateRange.startDate,
  endDate: IMPORTED_NEW_CONFIG_FIXTURE.dateRange.endDate,
}

export const MOCK_IMPORT_FILE = {
  projectName: 'Mock Project Name',
  calendarType: CHINA_CALENDAR,
  dateRange: {
    startDate: '2023-03-15T16:00:00.000Z',
    endDate: '2023-03-29T16:00:00.000Z',
  },
  metrics: [],
}

export const MOCK_JIRA_VERIFY_RESPONSE = {
  jiraColumns: [
    { key: 'indeterminate', value: { name: 'Doing', statuses: ['DOING'] } },
    { key: 'indeterminate', value: { name: 'TODO', statuses: ['TODO'] } },
    { key: 'indeterminate', value: { name: 'Testing', statuses: ['TESTING'] } },
    { key: 'indeterminate', value: { name: 'Blocked', statuses: ['BLOCKED'] } },
    { key: 'done', value: { name: 'Done', statuses: ['DONE', 'CANCELLED'] } },
  ],
  users: ['user 1', 'user 2', 'user 3'],
  targetFields: [
    { key: 'issuetype', name: '事务类型', flag: false },
    { key: 'parent', name: '父级', flag: false },
    { key: 'customfield_10020', name: 'Sprint', flag: false },
    { key: 'project', name: '项目', flag: false },
    { key: 'customfield_10021', name: 'Flagged', flag: false },
    { key: 'fixVersions', name: '修复版本', flag: false },
    { key: 'customfield_10000', name: 'development', flag: false },
    { key: 'priority', name: '优先级', flag: false },
    { key: 'customfield_10037', name: 'Partner', flag: false },
    { key: 'labels', name: '标签', flag: false },
    { key: 'timetracking', name: '时间跟踪', flag: false },
    { key: 'customfield_10015', name: 'Start date', flag: false },
    { key: 'customfield_10016', name: 'Story point estimate', flag: false },
    { key: 'customfield_10038', name: 'QA', flag: false },
    { key: 'customfield_10019', name: 'Rank', flag: false },
    { key: 'assignee', name: '经办人', flag: false },
    { key: 'customfield_10017', name: 'Issue color', flag: false },
    { key: 'customfield_10027', name: 'Feature/Operation', flag: false },
  ],
}

export const MOCK_BUILD_KITE_VERIFY_RESPONSE = {
  pipelineList: [
    {
      id: 'mock id',
      name: 'mock name',
      orgId: 'mock id',
      orgName: 'mock orgName',
      repository: 'mock repository url',
      steps: [],
    },
  ],
}

export const FILTER_CYCLE_TIME_SETTINGS = [
  { name: 'TODO', value: 'TODO' },
  { name: 'BACKLOG', value: 'TODO' },
  { name: 'IN DEV', value: 'IN DEV' },
  { name: 'DOING', value: 'IN DEV' },
  { name: 'DONE', value: 'DONE' },
]

export const MOCK_CYCLE_TIME_SETTING = [
  { name: 'TODO', value: 'TODO' },
  { name: 'IN DEV', value: 'IN DEV' },
  { name: 'DONE', value: 'DONE' },
]
export const MOCK_JIRA_WITH_STATUES_SETTING = [
  { name: 'TODO', statuses: ['TODO', 'BACKLOG'] },
  { name: 'IN DEV', statuses: ['IN DEV', 'DOING'] },
  { name: 'DONE', statuses: ['DONE'] },
]

export const MOCK_GITHUB_VERIFY_RESPONSE = {
  githubRepos: ['https://github.com/xxxx1/repo1', 'https://github.com/xxxx1/repo2'],
}

export const CREWS_SETTING = 'Crew settings'
export const CYCLE_TIME_SETTINGS = 'Cycle time settings'
export const CLASSIFICATION_SETTING = 'Classification setting'
export const REAL_DONE = 'Real done setting'
export const DEPLOYMENT_FREQUENCY_SETTINGS = 'Pipeline settings'

export enum PIPELINE_SETTING_TYPES {
  DEPLOYMENT_FREQUENCY_SETTINGS_TYPE = 'DeploymentFrequencySettings',
}

export const CONFIRM_DIALOG_DESCRIPTION = 'All the filled data will be cleared. Continue to Home page?'

export const MOCK_GET_STEPS_PARAMS = {
  params: {
    pipelineName: 'mock pipeline name',
    repository: 'mock repository',
    orgName: 'mock orgName',
    startTime: 1212112121212,
    endTime: 1313131313131,
  },
  buildId: 'mockBuildId',
  organizationId: 'mockOrganizationId',
  pipelineType: 'BuildKite',
  token: 'mockToken',
}

export const REMOVE_BUTTON = 'Remove'
export const ORGANIZATION = 'Organization'
export const PIPELINE_NAME = 'Pipeline Name'
export const STEP = 'Step'
export const BRANCH = 'Branches'

export const PR_LEAD_TIME = 'PR Lead Time'
export const PIPELINE_LEAD_TIME = 'Pipeline Lead Time'
export const TOTAL_DELAY_TIME = 'Total Lead Time'

export const MOCK_REPORT_RESPONSE = {
  velocity: {
    velocityForSP: 20,
    velocityForCards: 14,
  },
  cycleTime: {
    averageCycleTimePerCard: 30.26,
    averageCycleTimePerSP: 21.18,
    totalTimeForCards: 423.59,
    swimlaneList: [
      {
        optionalItemName: 'Analysis',
        averageTimeForSP: 8.36,
        averageTimeForCards: 11.95,
        totalTime: 167.27,
      },
      {
        optionalItemName: 'In Dev',
        averageTimeForSP: 12.13,
        averageTimeForCards: 17.32,
        totalTime: 242.51,
      },
    ],
  },
  deploymentFrequency: {
    avgDeploymentFrequency: {
      name: 'Average',
      deploymentFrequency: 0.4,
    },
    deploymentFrequencyOfPipelines: [
      {
        name: 'fs-platform-onboarding',
        step: ' :shipit: deploy to PROD',
        deploymentFrequency: 0.3,
        items: [
          {
            date: '9/9/2022',
            count: 1,
          },
        ],
      },
    ],
  },
  meanTimeToRecovery: {
    avgMeanTimeToRecovery: {
      name: 'Average',
      timeToRecovery: 14396108.777777776,
    },
    meanTimeRecoveryPipelines: [
      {
        name: 'Heartbeat',
        step: ':react: Build Frontend',
        timeToRecovery: 15560177,
      },
      {
        name: 'Heartbeat',
        step: ':cloudformation: Deploy infra',
        timeToRecovery: 0,
      },
      {
        name: 'Heartbeat',
        step: ':rocket: Run e2e',
        timeToRecovery: 27628149.333333332,
      },
    ],
  },
  leadTimeForChanges: {
    leadTimeForChangesOfPipelines: [
      {
        name: 'fs-platform-payment-selector',
        step: 'RECORD RELEASE TO PROD',
        prLeadTime: 2702.53,
        pipelineLeadTime: 2587.42,
        totalDelayTime: 5289.95,
      },
    ],
    avgLeadTimeForChanges: {
      name: 'Average',
      prLeadTime: 3647.51,
      pipelineLeadTime: 2341.72,
      totalDelayTime: 5989.22,
    },
  },
  changeFailureRate: {
    avgChangeFailureRate: {
      name: 'Average',
      totalTimes: 6,
      totalFailedTimes: 0,
      failureRate: 0.0,
    },
    changeFailureRateOfPipelines: [
      {
        name: 'fs-platform-onboarding',
        step: ' :shipit: deploy to PROD',
        failedTimesOfPipeline: 0,
        totalTimesOfPipeline: 2,
        failureRate: 0.0,
      },
    ],
  },
  classificationList: [
    {
      fieldName: 'FS Work Type',
      pairList: [
        {
          name: 'Feature Work - Planned',
          value: 0.5714,
        },
      ],
    },
  ],
  exportValidityTime: 1800000,
}

export const MOCK_RETRIEVE_REPORT_RESPONSE = {
  callbackUrl: 'reports/123',
  interval: 10,
}

export const EXPECTED_REPORT_VALUES = {
  velocityList: [
    { id: 0, name: 'Velocity(Story Point)', valueList: [{ value: 20 }] },
    { id: 1, name: 'Throughput(Cards Count)', valueList: [{ value: 14 }] },
  ],
  cycleTimeList: [
    {
      id: 0,
      name: 'Average cycle time',
      valueList: [
        { value: 21.18, unit: '(days/SP)' },
        { value: '30.26', unit: '(days/card)' },
      ],
    },
    {
      id: 1,
      name: 'Total development time / Total cycle time',
      valueList: [{ value: '57.25%' }],
    },
    {
      id: 2,
      name: 'Average development time',
      valueList: [
        { value: '12.13', unit: '(days/SP)' },
        { value: '17.32', unit: '(days/card)' },
      ],
    },
  ],
  classification: [
    {
      id: 0,
      name: 'FS Work Type',
      valuesList: [{ name: 'Feature Work - Planned', value: '57.14%' }],
    },
  ],
  deploymentFrequencyList: [
    {
      id: 0,
      name: 'fs-platform-onboarding/ :shipit: deploy to PROD',
      valuesList: [
        {
          name: 'Deployment frequency(deployments/day)',
          value: '0.30',
        },
      ],
    },
    {
      id: 1,
      name: 'Average',
      valuesList: [
        {
          name: 'Deployment frequency(deployments/day)',
          value: '0.40',
        },
      ],
    },
  ],
  meanTimeToRecoveryList: [
    {
      id: 0,
      name: 'Heartbeat/:react: Build Frontend',
      valuesList: [
        {
          name: 'Mean Time To Recovery',
          value: '4.32',
        },
      ],
    },
    {
      id: 1,
      name: 'Heartbeat/:cloudformation: Deploy infra',
      valuesList: [
        {
          name: 'Mean Time To Recovery',
          value: '0.00',
        },
      ],
    },
    {
      id: 2,
      name: 'Heartbeat/:rocket: Run e2e',
      valuesList: [
        {
          name: 'Mean Time To Recovery',
          value: '7.67',
        },
      ],
    },
    {
      id: 3,
      name: 'Average',
      valuesList: [
        {
          name: 'Mean Time To Recovery',
          value: '4.00',
        },
      ],
    },
  ],
  leadTimeForChangesList: [
    {
      id: 0,
      name: 'fs-platform-payment-selector/RECORD RELEASE TO PROD',
      valuesList: [
        { name: PR_LEAD_TIME, value: '45.04' },
        { name: PIPELINE_LEAD_TIME, value: '43.12' },
        { name: TOTAL_DELAY_TIME, value: '88.17' },
      ],
    },
    {
      id: 1,
      name: 'Average',
      valuesList: [
        { name: PR_LEAD_TIME, value: '60.79' },
        { name: PIPELINE_LEAD_TIME, value: '39.03' },
        { name: TOTAL_DELAY_TIME, value: '99.82' },
      ],
    },
  ],
  changeFailureRateList: [
    {
      id: 0,
      name: 'fs-platform-onboarding/ :shipit: deploy to PROD',
      valuesList: [
        {
          name: 'Failure rate',
          value: '0.00%(0/2)',
        },
      ],
    },
    {
      id: 1,
      name: 'Average',
      valuesList: [
        {
          name: 'Failure rate',
          value: '0.00%(0/6)',
        },
      ],
    },
  ],
  exportValidityTimeMin: 30,
}

export const CONFIG_PAGE_VERIFY_IMPORT_ERROR_MESSAGE =
  'Imported data is not perfectly matched. Please review carefully before going next!'

export const BASIC_IMPORTED_OLD_CONFIG_FIXTURE = {
  projectName: 'ConfigFileForImporting',
  metrics: ['Velocity', 'Cycle time', 'Classification', 'Lead time for changes'],
  startDate: '2023-03-16T00:00:00.000+08:00',
  endDate: '2023-03-30T23:59:59.999+08:00',
  board: {
    type: 'Classic Jira',
    verifyToken: 'mockVerifyToken',
    boardId: '1963',
    token: 'mockToken',
    site: 'mockSite',
    email: 'test@test.com',
    projectKey: 'PLL',
  },
  pipelineTool: {
    type: 'BuildKite',
    verifyToken: 'mockVerifyToken',
    token: 'mockToken',
  },
  sourceControl: {
    type: 'GitHub',
    verifyToken: 'mockVerifyToken',
    token: '',
  },
  crews: ['lucy', 'hi hi', 'Yu Zhang'],
  classifications: ['type', 'Parent'],
  cycleTime: {},
  doneStatus: ['DONE'],
  deployment: [
    {
      pipelineId: 'Heartbeat',
      step: ':rocket: Deploy prod',
      orgId: 'Thoughtworks-Heartbeat',
    },
  ],
  leadTime: [
    {
      pipelineId: 'Heartbeat',
      step: ':rocket: Deploy prod',
      orgId: 'Thoughtworks-Heartbeat',
    },
  ],
}

export const ERROR_MESSAGE_TIME_DURATION = 4000
export const CLASSIFICATION_WARNING_MESSAGE = `Some classifications in import data might be removed.`

export const HOME_VERIFY_IMPORT_WARNING_MESSAGE =
  'The content of the imported JSON file is empty. Please confirm carefully'

export const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error'

export const HOME_PAGE_ROUTE = '/home'

export const ERROR_PAGE_ROUTE = '/error-page'

export const METRICS_PAGE_ROUTE = '/metrics'

export const ERROR_PAGE_MESSAGE =
  'Something on internet is not quite right. Perhaps head back to our homepage and try again.'

export const RETRY_BUTTON = 'Go to homepage'

export const NO_CARD_ERROR_MESSAGE =
  'Sorry there is no card within selected date range, please change your collection date!'

export const LIST_OPEN = 'Open'

export const NO_RESULT_DASH = '----'

export const MOCK_AUTOCOMPLETE_LIST = ['Option 1', 'Option 2', 'Option 3']

export const AUTOCOMPLETE_SELECT_ACTION = 'selectOption'

export const TIME_DISPLAY_TITTLE_START = 'START'
export const TIME_DISPLAY_TITTLE_END = 'END'
export const CYCLE_TIME_SETTINGS_SECTION = 'Cycle time settings section'
export const REAL_DONE_SETTING_SECTION = 'Real done setting section'
export const SELECT_CONSIDER_AS_DONE_MESSAGE = 'Must select which you want to consider as Done'
