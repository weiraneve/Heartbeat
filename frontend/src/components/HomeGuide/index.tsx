import Button, { ButtonProps } from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

import { theme } from '@src/theme'
import { useNavigate } from 'react-router-dom'

const basicStyle = {
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  margin: '2rem',
  width: '15rem',
  minWidth: '10rem',
  minHeight: '3rem',
}
const GuideButton = styled(Button)<ButtonProps>({
  ...basicStyle,
  '&:hover': {
    ...basicStyle,
  },
  '&:active': {
    ...basicStyle,
  },
  '&:focus': {
    ...basicStyle,
  },
})

export const HomeGuide = () => {
  const navigate = useNavigate()

  return (
    <Stack direction='column' justifyContent='center' alignItems='center' flex={'auto'}>
      <GuideButton>
        <span>Import project from file</span>
      </GuideButton>
      <GuideButton onClick={() => navigate('/metrics')}>Create a new project</GuideButton>
    </Stack>
  )
}
