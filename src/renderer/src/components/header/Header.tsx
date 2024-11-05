import { HeaderContainer, HeaderLogo, RightContainer, Field, FieldTitle, FieldValue } from './style'
import sinacofiLogo from '../../assets/sinacofi.svg'

interface HeaderProps {
  institution: string
  area: string
  ftiCode: string
  sessionId: number
}

const Header = ({ institution, area, ftiCode, sessionId }: HeaderProps) => {
  const getCurrentHour = () => {
    const date = new Date()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return (
    <HeaderContainer className="main-header">
      <RightContainer>
        <Field style={{ marginLeft: 0 }}>
          <HeaderLogo alt="logo" src={sinacofiLogo} />
          <p>FTI Monitor 3.0</p>
        </Field>
        <Field>
          <FieldTitle>Institución</FieldTitle>
          <FieldValue>{institution}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Área</FieldTitle>
          <FieldValue>{area}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Código FTI</FieldTitle>
          <FieldValue>{ftiCode}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>ID de Sesión</FieldTitle>
          <FieldValue>{sessionId}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Hora Local</FieldTitle>
          <FieldValue>{getCurrentHour()}</FieldValue>
        </Field>
      </RightContainer>
      <div />
    </HeaderContainer>
  )
}

export default Header
