import { useEffect, useState } from 'react'
import { Header, Modal, Table } from './components'
import { mockHeaderData, mockTableData } from './mockdata'
import './base.css'
import styled from '@emotion/styled'
import { TableDataInterface } from './components/table/tableData.interface'
import  log  from 'electron-log'


interface WindowAPI {
  messagesFlowHandler: () => Promise<Array<any>>
  getConfig: () => any
}

const Title = styled.h1`
  font-family: Montserrat;
  font-size: 1.5rem;
  font-style: normal;
  line-height: 2rem;
  margin: 42px 0 32px 5%;
`

function App(): JSX.Element {
  const [tableData, setTableData] = useState<TableDataInterface[]>(mockTableData)
  const [headerData] = useState(mockHeaderData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [config, setConfig] = useState(['1','2'])

  const handleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  useEffect(() => {
    window.addEventListener('error', (event) => {
      log.error('Error en la interfaz:', event.error)
    })

    window.addEventListener('unhandledrejection', (event) => {
      log.error('Error en promesa no manejada:', event.reason)
    })

    handleModal()

    const api: WindowAPI = window.api as WindowAPI
    api.messagesFlowHandler().then((messages: Array<any>) => {
      log.info("MESSAGES: ",messages)
      const transformedMessagesDataForTable: TableDataInterface[] = messages.map((message) => ({
        file: message.filename,
        msg: message.header.msg || 0,
        message: message.description,
        institution: message.institution,
        area: message.area || '',
        date: message.date,
        hour: message.hour,
        event: message.event,
      }))
      setTableData(transformedMessagesDataForTable)
    })
    api.getConfig().then(res => {
      console.log('config: ',res)
      setConfig(res)
    })
  }, [])
  return (
    <>
      <Header
        institution={headerData.institution}
        area={headerData.area}
        ftiCode={headerData.ftiCode}
        sessionId={headerData.sessionId}
      />
      <Modal text="Mensajes Sincronizados exitosamente" open={isModalOpen} handleModal={handleModal} />
      <Title>Monitoreo Mensajería FTI: {config[0]}</Title>
      <p>{JSON.stringify(config[1])}</p>
      <Table data={tableData} />
    </>
  )
}

export default App
