import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import userEvent from '@testing-library/user-event'
import { DeploymentFrequencySettings } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings'
import { addADeploymentFrequencySetting } from '@src/context/Metrics/metricsSlice'
import { DEPLOYMENT_FREQUENCY_SETTINGS } from '../../../../fixtures'

const mockValidationCheckContext = {
  errorMessages: [{ id: 1, error: 'error' }],
  clearErrorMessage: jest.fn(),
  checkDuplicatedPipeLine: jest.fn(),
  checkPipelineValidation: jest.fn(),
}

jest.mock('@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection', () => ({
  PipelineMetricSelection: ({ errorMessages }: { errorMessages: string }) => <div>errorMessages: {errorMessages}</div>,
}))

jest.mock('@src/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn().mockReturnValue([{ id: 1, organization: '', pipelineName: '', steps: '' }]),
}))

jest.mock('@src/context/Metrics/metricsSlice', () => ({
  addADeploymentFrequencySetting: jest.fn(),
}))

jest.mock('@src/hooks/useMetricsStepValidationCheckContext', () => ({
  useMetricsStepValidationCheckContext: () => mockValidationCheckContext,
}))

const setUp = () => {
  return render(
    <Provider store={store}>
      <DeploymentFrequencySettings />
    </Provider>
  )
}

describe('DeploymentFrequencySettings', () => {
  const ADD_BUTTON = 'Add'

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render DeploymentFrequencySettings component', () => {
    const { getByText, getByRole } = setUp()

    expect(getByText(DEPLOYMENT_FREQUENCY_SETTINGS)).toBeInTheDocument()
    expect(getByText('errorMessages: error')).toBeInTheDocument()
    expect(getByRole('button', { name: ADD_BUTTON })).toBeInTheDocument()
  })

  it('should call addADeploymentFrequencySetting function when click add another pipeline button', async () => {
    const { getByRole } = await setUp()

    await userEvent.click(getByRole('button', { name: ADD_BUTTON }))

    expect(addADeploymentFrequencySetting).toHaveBeenCalledTimes(1)
  })
})
