import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import {
  BOARD_TYPES,
  PIPELINE_TOOL_TYPES,
  SOURCE_CONTROL_TYPES,
  SELECTED_VALUE_SEPARATOR,
  REQUIRED_DATA,
} from '@src/constants'
import { useState } from 'react'
import { RequireDataSelections } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox/style'
import { Board } from '@src/components/Metrics/ConfigStep/Board'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import {
  selectConfig,
  updateBoard,
  updateBoardVerifyState,
  updateMetrics,
  updatePipelineTool,
  updatePipelineToolVerifyState,
  updateShowBoard,
  updateShowPipeline,
  updateShowSourceControl,
  updateSourceControl,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice'
import { PipelineTool } from '@src/components/Metrics/ConfigStep/PipelineTool'
import { SourceControl } from '@src/components/Metrics/ConfigStep/SourceControl'

export const MetricsTypeCheckbox = () => {
  const dispatch = useAppDispatch()
  const configData = useAppSelector(selectConfig)
  const { isShowBoard, metrics, isShowPipeline, isShowSourceControl } = configData
  const [isEmptyRequireData, setIsEmptyProjectData] = useState<boolean>(false)

  const handleRequireDataChange = (event: SelectChangeEvent<typeof metrics>) => {
    const {
      target: { value },
    } = event
    dispatch(updatePipelineTool({ pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE, token: '' }))
    dispatch(updatePipelineToolVerifyState(false))
    dispatch(updateBoardVerifyState(false))
    dispatch(
      updateBoard({
        type: BOARD_TYPES.JIRA,
        boardId: '',
        email: '',
        projectKey: '',
        site: '',
        token: '',
      })
    )
    dispatch(updateSourceControl({ sourceControl: SOURCE_CONTROL_TYPES.GITHUB, token: '' }))
    dispatch(updateSourceControlVerifyState(false))
    dispatch(updateMetrics(value))
    value.length === 0 ? setIsEmptyProjectData(true) : setIsEmptyProjectData(false)
    dispatch(
      updateShowBoard(
        value.includes(REQUIRED_DATA.VELOCITY) ||
          value.includes(REQUIRED_DATA.CYCLE_TIME) ||
          value.includes(REQUIRED_DATA.CLASSIFICATION)
      )
    )
    dispatch(
      updateShowPipeline(
        value.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES) ||
          value.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) ||
          value.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE) ||
          value.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)
      )
    )
    dispatch(updateShowSourceControl(value.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES)))
  }
  return (
    <>
      <RequireDataSelections variant='standard' required error={isEmptyRequireData}>
        <InputLabel id='require-data-multiple-checkbox-label'>Required Data</InputLabel>
        <Select
          labelId='require-data-multiple-checkbox-label'
          multiple
          value={metrics}
          onChange={handleRequireDataChange}
          renderValue={(selected) => selected.join(SELECTED_VALUE_SEPARATOR)}
        >
          {Object.values(REQUIRED_DATA).map((data) => (
            <MenuItem key={data} value={data}>
              <Checkbox checked={metrics.indexOf(data) > -1} />
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
        {isEmptyRequireData && <FormHelperText>Metrics is required</FormHelperText>}
      </RequireDataSelections>
      {isShowBoard && <Board />}
      {isShowPipeline && <PipelineTool />}
      {isShowSourceControl && <SourceControl />}
    </>
  )
}
