import styled from '@emotion/styled'
import SendIcon from '@mui/icons-material/Send'
import CallReceivedIcon from '@mui/icons-material/CallReceived'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  margin-top: 45px;
`

export const TableContainer = styled.table`
  width: 90%;
  border-collapse: collapse;
`

export const TableHeader = styled.th`
  text-align: left;
`

export const TableRow = styled.tr`
  height: 56px;
  border-bottom: 1px solid #e0e0e0;
`

export const PagerContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  margin-top: 16px;
  width: 90%;
`

export const PageLabel = styled.label`
  margin-right: 8px;
`

export const PageSelect = styled.select`
  margin-right: 8px;
  border: none;
`

export const PageButton = styled.button`
  margin-right: 8px;
`

export const PamEvent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 3px 20px;
  width: fit-content;

  border-radius: 30px;
  background-color: #00b2e226;
`

export const TamEvent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 3px 20px;
  width: fit-content;

  border-radius: 30px;
  background-color: #459ca726;
`

export const PamIcon = styled(SendIcon)`
  color: #00b2e2;
  width: 20px;
  height: 18px;
  margin-right: 5px;
`
export const TamIcon = styled(CallReceivedIcon)`
  color: #459ca7;
  width: 20px;
  height: 18px;
  margin-right: 5px;
`
