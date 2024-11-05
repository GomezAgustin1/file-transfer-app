import styled from '@emotion/styled'
import { Button } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export const ModalWrapper = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`

export const ModalContent = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 523px;
  height: 276px;

  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
`

export const Text = styled.p`
  margin-top: 20px;
  margin-bottom: 40px;
  font-weight: bold;
`

export const CheckIcon = styled(CheckCircleIcon)`
  width: 40px;
  height: 40px;
  color: #00bc70;
`

export const CloseButton = styled(Button)`
  background-color: #00b2e2;
  border-radius: 15px;
`
