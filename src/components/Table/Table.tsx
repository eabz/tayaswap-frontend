'use client'

import { Table as ChakraTable, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { type ReactNode, useEffect, useState } from 'react'
import { IconActionButton } from '../Buttons'
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '../Icons'

export type TData = Record<never, unknown>

interface ITableProps<RowDataType extends TData> {
  columns: ColumnDef<RowDataType>[]
  data: RowDataType[]
  loading: boolean
}

const SORTED_ICONS: Record<string, ReactNode> = {
  asc: <ArrowUpIcon height="2" width="2" />,
  desc: <ArrowDownIcon height="2" width="2" />
}

export function Table<RowDataType extends TData>({ columns, data, loading }: ITableProps<RowDataType>) {
  const [tableData, setTableData] = useState(data)

  useEffect(() => {
    setTableData(data)
  }, [data])

  const [sorting, setSorting] = useState<SortingState>([])

  const {
    getState,
    getCanNextPage,
    getCanPreviousPage,
    getPageCount,
    nextPage,
    previousPage,
    getRowModel,
    getCenterTotalSize,
    getHeaderGroups
  } = useReactTable({
    columns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  })

  const renderPagination = () => {
    const page = getState().pagination.pageIndex + 1
    const total = getPageCount()

    return total > 0 ? `Page ${page} of ${total}` : ''
  }

  return (
    <Stack my="5">
      <Flex alignItems="center" flexDirection="column" style={{ minWidth: getCenterTotalSize(), width: '100%' }}>
        <ChakraTable.ScrollArea
          roundedTop="25px"
          width="full"
          borderTop="1px solid"
          borderLeft="1px solid"
          borderRight="1px solid"
          borderColor="table-border"
        >
          <ChakraTable.Root>
            <ChakraTable.Header>
              {getHeaderGroups().map((headerGroup) => (
                <ChakraTable.Row key={headerGroup.id} background="table-outer-background">
                  {headerGroup.headers.map((header) => (
                    <ChakraTable.ColumnHeader
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      <HStack
                        alignItems="center"
                        justifyContent="center"
                        cursor={header.column.getCanSort() ? 'pointer' : undefined}
                        {...{
                          onClick: header.column.getToggleSortingHandler()
                        }}
                      >
                        <Text>{flexRender(header.column.columnDef.header, header.getContext())}</Text>
                        <Text>{SORTED_ICONS[(header.column.getIsSorted() as string) ?? null]}</Text>
                      </HStack>
                    </ChakraTable.ColumnHeader>
                  ))}
                </ChakraTable.Row>
              ))}
            </ChakraTable.Header>
            <ChakraTable.Body>
              {getRowModel().rows.map((row) => {
                return (
                  <ChakraTable.Row key={row.id} background="table-background">
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <ChakraTable.Cell key={cell.id} style={{ width: cell.column.getSize() }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </ChakraTable.Cell>
                      )
                    })}
                  </ChakraTable.Row>
                )
              })}
            </ChakraTable.Body>
          </ChakraTable.Root>
        </ChakraTable.ScrollArea>

        <Flex
          alignItems="center"
          justifyContent="space-between"
          marginTop={2}
          width="100%"
          background="table-outer-background"
          borderBottom="1px solid"
          borderLeft="1px solid"
          borderRight="1px solid"
          borderColor="table-border"
          roundedBottom="25px"
          px="5"
          py="3"
          mt="0"
        >
          <IconActionButton
            disabled={!getCanPreviousPage()}
            rounded="full"
            height="32px"
            icon={<ChevronLeftIcon height="4" width="4" />}
            onClickHandler={() => previousPage()}
          />

          <Text>{renderPagination()}</Text>
          <IconActionButton
            disabled={!getCanNextPage()}
            rounded="full"
            height="32px"
            icon={<ChevronRightIcon height="4" width="4" />}
            onClickHandler={() => nextPage()}
          />
        </Flex>
      </Flex>
    </Stack>
  )
}
