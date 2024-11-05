import React from 'react'
import { CheckIcon, CloseButton, ModalContent, ModalWrapper, Text } from './style'

interface ModalProps {
  text: string
  open: boolean
  handleModal: () => void
}

const Modal: React.FC<ModalProps> = ({ text, open, handleModal }) => {
  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleModal()
    }
  }

  return (
    <>
      {open && (
        <ModalWrapper onClick={handleBackgroundClick}>
          <ModalContent>
            <CheckIcon color="success" />
            <Text>{text}</Text>
            <CloseButton variant="contained" color="primary" onClick={handleModal}>
              Cerrar
            </CloseButton>
          </ModalContent>
        </ModalWrapper>
      )}
    </>
  )
}

export default Modal
