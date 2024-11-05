import { useEffect, useMemo, useState } from 'react'
import { TableDataInterface } from './tableData.interface'
import {
  Container,
  TableRow,
  PageSelect,
  PagerContainer,
  TableContainer,
  TableHeader,
  PamEvent,
  TamEvent,
  PamIcon,
  TamIcon,
} from './style'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

const Table = ({ data }: { data: TableDataInterface[] }) => {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [fullData, setFullData] = useState(data)

  useEffect(() => {
    setFullData(data)
  }, [data])

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value))
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedData = useMemo(
    () =>
      [...fullData].sort((a, b) => {
        switch (sortColumn) {
          case 'MSG':
            const msgA = Number(a.msg)
            const msgB = Number(b.msg)
            return sortDirection === 'asc' ? msgA - msgB : msgB - msgA
          case 'Institucion':
            return sortDirection === 'asc'
              ? a.institution.localeCompare(b.institution)
              : b.institution.localeCompare(a.institution)
          case 'Area':
            const areaA = Number(a.area)
            const areaB = Number(b.area)
            return sortDirection === 'asc' ? areaA - areaB : areaB - areaA
          case 'Fecha':
            const parseDate = (date: string) => {
              const [day, month, year] = date.split('/').map(Number)
              const fullYear = year + 2000 // Adjust for the correct century
              return new Date(fullYear, month - 1, day)
            }
            const dateA = new Date(parseDate(a.date))
            const dateB = new Date(parseDate(b.date))
            return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
          default:
            return 0
        }
      }),
    [sortColumn, sortDirection, fullData],
  )

  const returnSortArrow = () => {
    const arrowStyle = { width: '16px', height: '16px', color: '#898989' }
    return sortDirection === 'asc' ? <ArrowUpwardIcon style={arrowStyle} /> : <ArrowDownwardIcon style={arrowStyle} />
  }

  return (
    <Container>
      <TableContainer>
        <thead>
          <tr>
            <TableHeader>Archivo</TableHeader>
            <TableHeader onClick={() => handleSort('MSG')}>MSG {sortColumn === 'MSG' && returnSortArrow()}</TableHeader>
            <TableHeader>Mensaje</TableHeader>
            <TableHeader onClick={() => handleSort('Institucion')}>
              Institucion {sortColumn === 'Institucion' && returnSortArrow()}
            </TableHeader>
            <TableHeader onClick={() => handleSort('Area')}>
              Área {sortColumn === 'Area' && returnSortArrow()}
            </TableHeader>
            <TableHeader onClick={() => handleSort('Fecha')}>
              Fecha {sortColumn === 'Fecha' && returnSortArrow()}
            </TableHeader>
            <TableHeader>Hora</TableHeader>
            <TableHeader>Evento</TableHeader>
          </tr>
        </thead>
        <tbody>
          {sortedData.slice(startIndex, endIndex).map((row, index) => (
            <TableRow key={index}>
              <td>{row.file}</td>
              <td>{row.msg}</td>
              <td>{row.message}</td>
              <td>{row.institution}</td>
              <td>{row.area}</td>
              <td>{row.date}</td>
              <td>{row.hour}</td>
              <td>
                {row.event === 'pam' ? (
                  <PamEvent>
                    <PamIcon /> PAMS Enviado
                  </PamEvent>
                ) : (
                  <TamEvent>
                    <TamIcon />
                    TAMS Recibido
                  </TamEvent>
                )}
              </td>
            </TableRow>
          ))}
        </tbody>
      </TableContainer>

      <PagerContainer>
        <div>
          Registros por página:{' '}
          <PageSelect id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </PageSelect>
        </div>
        <div>
          Página {currentPage} de {totalPages}
        </div>

        <ChevronLeftIcon onClick={handlePreviousPage} />
        <ChevronRightIcon onClick={handleNextPage} />
      </PagerContainer>
    </Container>
  )
}

export default Table
