import { GITHUB_TOKEN } from '../fixtures/fixtures'
import homePage from '../pages/home'
import configPage from '../pages/metrics/config'
import metricsPage from '../pages/metrics/metrics'
import reportPage from '../pages/metrics/report'

const cycleTimeData = [
  { label: 'Name', value: 'Value' },
  { label: 'Average cycle time', value: '6.71(days/SP)' },
  { label: '8.39(days/card)' },
  { label: 'Total development time / Total cycle time', value: '0.64' },
  { label: 'Total waiting for testing time / Total cycle time', value: '0.02' },
  { label: 'Total block time / Total cycle time', value: '0.28' },
  { label: 'Total review time / Total cycle time', value: '0.04' },
  { label: 'Total testing time / Total cycle time', value: '0.01' },
  { label: 'Average development time', value: '4.32(days/SP)' },
  { label: '5.4(days/card)' },
  { label: 'Average waiting for testing time', value: '0.16(days/SP)' },
  { label: '0.2(days/card)' },
  { label: 'Average block time', value: '1.88(days/SP)' },
  { label: '2.35(days/card)' },
  { label: 'Average review time', value: '0.26(days/SP)' },
  { label: '0.32(days/card)' },
  { label: 'Average testing time', value: '0.1(days/SP)' },
  { label: '0.12(days/card)' },
]
const velocityData = [
  { label: 'Name', value: 'Value' },
  { label: 'Velocity(Story Point)', value: '20' },
  { label: 'Throughput(Cards Count)', value: '16' },
]

const metricsTextList = [
  'Crews setting',
  'Brian Ong',
  'Harsh Singal',
  'Prashant Agarwal',
  'Sumit Narang',
  'Yu Zhang',
  'Peihang Yu',
  'Mengyang Sun',
  'HanWei Wang',
  'Aaron Camilleri',
  'Qian Zhang',
  'Gerard Ho',
  'Anthony Tse',
  'Yonghee Jeon Jeon',
  'Cycle time settings',
  'Analysis',
  'To do',
  'In Dev',
  'Block',
  'Waiting for testing',
  'Testing',
  'Review',
  'Done',
  'Real done',
  'DONE, CLOSED',
  'Classification setting',
  'Issue Type',
  'Has Dependancies',
  'FS R&D Classification',
  'Parent',
  'Components',
  'Project',
  'Reporter',
  'Parent Link',
  'Fix versions',
  'Priority',
  'Paired Member',
  'Labels',
  'Story Points',
  'Sprint',
  'Epic Link',
  'Assignee',
  'FS Work Categorization',
  'FS Work Type',
  'Epic Name',
  'Acceptance Criteria',
  'Environment',
  'Affects versions',
  'FS Domains',
  'PIR Completed',
  'Team',
  'Incident Priority',
  'Resolution Details',
  'Time to Resolution - Hrs',
  'Time to Detect - Hrs',
  'Cause by - System',
  'Deployment frequency settings',
  'XXXX',
  'fs-platform-payment-selector',
  'RECORD RELEASE TO PROD',
  'Lead time for changes',
  'XXXX',
  'fs-platform-onboarding',
  'RECORD RELEASE TO PROD',
]

const configTextList = [
  'Project name *',
  'Velocity, Cycle time, Classification, Lead time for changes, Deployment frequency, Change failure rate, Mean time to recovery',
  'Classic Jira',
  'BuildKite',
  'GitHub',
]

const textInputValues = [
  { index: 0, value: 'E2E Project' },
  { index: 1, value: '03 / 16 / 2023' },
  { index: 2, value: '03 / 30 / 2023' },
  { index: 3, value: '1963' },
  { index: 4, value: 'test@test.com' },
  { index: 5, value: 'PLL' },
  { index: 6, value: 'site' },
]

const tokenInputValues = [
  { index: 0, value: 'mockToken' },
  { index: 1, value: 'mock1234'.repeat(5) },
  { index: 2, value: `${GITHUB_TOKEN}` },
]

interface BoardDataItem {
  label: string
  value?: string
}

const checkBoardCalculation = (testId: string, boardData: BoardDataItem[]) => {
  cy.get(testId)
    .find('tr')
    .each((row, index) => {
      cy.wrap(row).within(() => {
        cy.contains(boardData[index].label).should('exist')
        if (boardData[index].value) {
          cy.contains(boardData[index].value).should('exist')
        }
      })
    })
}

const checkPipelineCalculation = (testId: string) => {
  cy.get(testId).find('tr').contains('Deployment frequency(deployments/day)').should('exist')
}

const checkDeploymentFrequency = (testId: string) => {
  reportPage.deploymentFrequencyTitle().should('exist')
  checkPipelineCalculation(testId)
}

const checkVelocity = (testId: string, velocityData: BoardDataItem[]) => {
  reportPage.velocityTitle().should('exist')
  checkBoardCalculation(testId, velocityData)
}

const checkCycleTime = (testId: string, cycleTimeData: BoardDataItem[]) => {
  reportPage.cycleTimeTitle().should('exist')
  checkBoardCalculation(testId, cycleTimeData)
}

const checkPipelineCSV = () => {
  cy.wait(2000)
  return cy.task('readDir', 'cypress/downloads').then((files) => {
    expect(files).to.match(new RegExp(/pipeline-data-.*\.csv/))
  })
}

const checkFieldsExist = (fields: string[]) => {
  fields.forEach((item) => {
    cy.contains(item).should('exist')
  })
}

const checkTextInputValuesExist = (fields: { index: number; value: string }[]) => {
  fields.forEach(({ index, value }) => {
    cy.get('.MuiInputBase-root input[type="text"]').eq(index).should('have.value', value)
  })
}

const checkTokenInputValuesExist = (fields: { index: number; value: string }[]) => {
  fields.forEach(({ index, value }) => {
    cy.get('[type="password"]').eq(index).should('have.value', value)
  })
}

describe('Create a new project', () => {
  it('Should create a new project manually', () => {
    homePage.navigate()

    homePage.createANewProject()
    cy.url().should('include', '/metrics')

    configPage.typeProjectName('E2E Project')

    configPage.goHomePage()

    homePage.createANewProject()
    cy.contains('Project name *').should('have.value', '')

    configPage.typeProjectName('E2E Project')

    configPage.selectDateRange()

    const nextButton = () => cy.get('button:contains("Next")')
    nextButton().should('be.disabled')

    configPage.selectMetricsData()

    configPage.fillBoardInfoAndVerifyWithClassicJira('1963', 'test@test.com', 'PLL', 'site', 'mockToken')

    cy.contains('Verified').should('exist')
    cy.contains('Reset').should('exist')

    configPage.fillPipelineToolFieldsInfoAndVerify('mock1234'.repeat(5))

    configPage.fillSourceControlFieldsInfoAndVerify(`${GITHUB_TOKEN}`)

    nextButton().should('be.enabled')

    configPage.CancelBackToHomePage()

    configPage.goMetricsStep()

    metricsPage.BackToConfigStep()

    checkFieldsExist(configTextList)

    checkTextInputValuesExist(textInputValues)

    checkTokenInputValuesExist(tokenInputValues)

    configPage.goMetricsStep()

    nextButton().should('be.disabled')

    cy.contains('Crews setting').should('exist')

    cy.contains('Cycle time settings').should('exist')

    metricsPage.checkCycleTime()

    cy.contains('Real done').should('exist')

    metricsPage.checkRealDone()

    metricsPage.checkClassification()

    metricsPage.checkDeploymentFrequencySettings()

    metricsPage.checkLeadTimeForChanges()

    nextButton().should('be.enabled')

    metricsPage.BackToConfigStep()

    checkFieldsExist(configTextList)

    checkTextInputValuesExist(textInputValues)

    checkTokenInputValuesExist(tokenInputValues)

    configPage.goMetricsStep()

    checkFieldsExist(metricsTextList)

    metricsPage.goReportStep()

    cy.wait(10000)

    checkVelocity('[data-test-id="Velocity"]', velocityData)

    checkCycleTime('[data-test-id="Cycle time"]', cycleTimeData)

    checkDeploymentFrequency('[data-test-id="Deployment frequency"]')

    reportPage.exportPipelineDataButton().should('be.enabled')

    reportPage.exportPipelineData()

    checkPipelineCSV()

    reportPage.backToMetricsStep()

    checkFieldsExist(metricsTextList)

    metricsPage.BackToConfigStep()

    checkFieldsExist(configTextList)

    checkTextInputValuesExist(textInputValues)

    checkTokenInputValuesExist(tokenInputValues)
  })
})
