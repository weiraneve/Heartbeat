import { FormHelperText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { saveUsers, selectMetricsContent, savePipelineCrews } from '@src/context/Metrics/metricsSlice'
import { useAppSelector } from '@src/hooks'
import { AssigneeFilter } from '@src/components/Metrics/MetricsStep/Crews/AssigneeFilter'
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete'
import { WarningMessage } from '@src/components/Metrics/MetricsStep/Crews/style'

interface crewsProps {
  options: string[]
  title: string
  label: string
  type?: string
}

export const Crews = ({ options, title, label, type = 'board' }: crewsProps) => {
  const isBoardCrews = type === 'board'
  const dispatch = useAppDispatch()
  const [isEmptyCrewData, setIsEmptyCrewData] = useState<boolean>(false)
  const { users, pipelineCrews } = useAppSelector(selectMetricsContent)
  const [selectedCrews, setSelectedCrews] = useState(isBoardCrews ? users : pipelineCrews)
  const isAllSelected = options.length > 0 && selectedCrews.length === options.length

  useEffect(() => {
    setIsEmptyCrewData(selectedCrews.length === 0)
  }, [selectedCrews])

  const handleCrewChange = (event: React.SyntheticEvent, value: string[]) => {
    if (value[value.length - 1] === 'All') {
      setSelectedCrews(selectedCrews.length === options.length ? [] : options)
      return
    }
    setSelectedCrews([...value])
  }

  useEffect(() => {
    dispatch(isBoardCrews ? saveUsers(selectedCrews) : savePipelineCrews(selectedCrews))
  }, [selectedCrews, dispatch])

  return (
    <>
      <MetricsSettingTitle title={title} />
      <MultiAutoComplete
        optionList={options}
        isError={isEmptyCrewData && isBoardCrews}
        isSelectAll={isAllSelected}
        onChangeHandler={handleCrewChange}
        selectedOption={selectedCrews}
        textFieldLabel={label}
        isBoardCrews={isBoardCrews}
      />
      {isBoardCrews && <AssigneeFilter />}
      <FormHelperText>
        {isEmptyCrewData && isBoardCrews && (
          <WarningMessage>
            {label} is <strong>required</strong>
          </WarningMessage>
        )}
      </FormHelperText>
    </>
  )
}
