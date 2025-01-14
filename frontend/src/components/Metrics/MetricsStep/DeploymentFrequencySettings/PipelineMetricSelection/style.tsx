import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { theme } from '@src/theme'

export const PipelineMetricSelectionWrapper = styled('div')`
  position: relative;
  width: 100%;
  padding: 1.5rem 0 0.5rem 0;
  border: 0.07rem solid rgba(0, 0, 0, 0.1);
  box-shadow: none;
  margin-bottom: 1rem;
  line-height: '2rem';
  boarder-radius: 0.25rem;
`

export const ButtonWrapper = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
})

export const RemoveButton = styled(Button)({
  width: '5rem',
  fontSize: '0.8rem',
  fontWeight: '550',
})

export const WarningMessage = styled('p')({
  fontFamily: theme.typography.fontFamily,
  color: '#d32f2f',
  margin: '0 0 0 2.5%',
  width: '95%',
})

export const BranchSelectionWrapper = styled('div')({
  margin: '0 0 1.5rem 2.5%',
  width: '95%',
})
