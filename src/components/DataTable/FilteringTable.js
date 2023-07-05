import React from 'react'
import {
  useTable,
  useGlobalFilter,
  useFilters,
  usePagination,
} from 'react-table'
import { GlobalFilter } from './GlobalFilter'
import './filtering.css'
import { Button, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'

export const FilteringTable = ({
  title,
  columns,
  data,
  onUpdate,
  onDelete,
  onBlock,
  setType,
}) => {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useGlobalFilter,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    page,
    gotoPage,
    pageCount,
    pageOptions,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    setGlobalFilter,
  } = tableInstance

  const { globalFilter, pageIndex } = state

  return (
    <Stack
      className="card"
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#000' : 'white'),
        color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
      }}
    >
      <div className="card-header">
        <Typography
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#000' : 'white',
            color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
          }}
          className="card-title"
        >
          {title}
        </Typography>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <table {...getTableProps()} className="table dataTable display">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    return (
                      <th
                        style={{ display: column.id === '_id' ? 'none' : '' }}
                        {...column.getHeaderProps()}
                      >
                        <Typography
                          sx={{
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark' ? '#000' : 'white',
                            color: (theme) =>
                              theme.palette.mode === 'dark' ? '#fff' : '#000',
                          }}
                        >
                          {column.render('Header')}
                        </Typography>
                        {column.canFilter ? column.render('Filter') : null}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="">
              {page.map((row) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          style={{
                            display: cell.column.id === '_id' ? 'none' : '',
                          }}
                          {...cell.getCellProps()}
                        >
                          <div>
                            <Typography
                              sx={{
                                color: (theme) =>
                                  theme.palette.mode === 'dark'
                                    ? '#fff'
                                    : '#000',
                              }}
                            >
                              {cell.column.type === 'img' ? (
                                <img />
                              ) : cell.column.type === 'date' ? (
                                dayjs(
                                  cell.render('Cell').props.cell.value
                                ).format('DD-MM-YYYY')
                              ) : cell.column.type === 'array' ? (
                                cell
                                  .render('Cell')
                                  .props.cell.value.map((v) => {
                                    return v[cell.column.field] + ' , '
                                  })
                              ) : cell.column.type === 'object' ? (
                                true ? (
                                  console.log(
                                    row.original['gerant'] &&
                                      row.original['gerant']['cp']
                                  )
                                ) : (
                                  'CCCC'
                                )
                              ) : (
                                cell.render('Cell')
                              )}
                            </Typography>
                          </div>
                        </td>
                      )
                    })}
                    <td>
                      <Stack direction={'row'} spacing={3}>
                        {!row.original.deletedAt &&
                          !row.original.blockedAt &&
                          onUpdate && (
                            <Button
                              onClick={() => {
                                setType('Update')
                                onUpdate(row.original)
                              }}
                              color="warning"
                              variant="contained"
                            >
                              Modifier
                            </Button>
                          )}
                        {!row.original.deletedAt &&
                          !row.original.blockedAt &&
                          onDelete && (
                            <Button
                              onClick={() => {
                                setType('Delete')
                                onDelete(row.original)
                              }}
                              color="error"
                              variant="contained"
                            >
                              Supprimer
                            </Button>
                          )}
                        {!row.original.deletedAt &&
                          !row.original.blockedAt &&
                          onBlock && (
                            <Button
                              onClick={() => {
                                setType('Block')
                                onBlock(row.original)
                              }}
                              color="error"
                              variant="contained"
                            >
                              Bloquer
                            </Button>
                          )}

                        {row.original.deletedAt && (
                          <Typography>Supprimé</Typography>
                        )}
                        {row.original.blockedAt && (
                          <Typography>Bloqué</Typography>
                        )}
                      </Stack>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="d-flex justify-content-between">
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <span className="table-index">
              Go to page :{' '}
              <input
                type="number"
                className="ml-2"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const pageNumber = e.target.value
                    ? Number(e.target.value) - 1
                    : 0
                  gotoPage(pageNumber)
                }}
              />
            </span>
          </div>
          <Stack className="text-center mb-3">
            <Stack
              direction={'row'}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#000' : 'white',
                color: (theme) =>
                  theme.palette.mode === 'dark' ? '#fff' : '#000',
              }}
              className="filter-pagination  mt-3"
            >
              <button
                style={{ cursor: 'pointer' }}
                className=" previous-button"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {'<<'}
              </button>

              <button
                style={{ cursor: 'pointer' }}
                className="previous-button"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Previous
              </button>
              <button
                style={{ cursor: 'pointer' }}
                className="next-button"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next
              </button>
              <button
                style={{ cursor: 'pointer' }}
                className=" next-button"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {'>>'}
              </button>
            </Stack>
          </Stack>
        </div>
      </div>
    </Stack>
  )
}
export default FilteringTable
