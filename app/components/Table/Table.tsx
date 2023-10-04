"use client";

import { COLORS, WEIGHTS } from "@/app/constants";
import styled from "@emotion/styled";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  PaginationState,
} from "@tanstack/react-table";

import VisuallyHidden from "../VisuallyHidden";
import Icon from "../Icon";
import Spacer from "../Spacer";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  pageCount: number;
}

export default function Table<T>({
  data,
  columns,
  pagination,
  setPagination,
  pageCount,
}: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount,
    state: {
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  return (
    <div>
      <Spacer size={16} />
      <TableContainer>
        <TableWrapper>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeading key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHeading>
                ))}
              </tr>
            ))}
          </TableHead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <TableRowBody key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableData key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableData>
                ))}
              </TableRowBody>
            ))}
          </tbody>
        </TableWrapper>
      </TableContainer>
      <Spacer size={16} />
      <PaginationWrapper>
        <div>
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          <strong>{table.getPageCount()}</strong>
        </div>
        <PaginationButtonWrapper>
          <ButtonIcon onClick={() => table.setPageIndex(0)}>
            <VisuallyHidden>First Page</VisuallyHidden>
            <Icon id="chevrons-left" size={16} />
          </ButtonIcon>
          <ButtonIcon
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <VisuallyHidden>Previous Page</VisuallyHidden>
            <Icon id="chevron-left" size={16} />
          </ButtonIcon>
          <ButtonIcon
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <VisuallyHidden>Next Page</VisuallyHidden>
            <Icon id="chevron-right" size={16} />
          </ButtonIcon>
          <ButtonIcon
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            <VisuallyHidden>Last Page</VisuallyHidden>
            <Icon id="chevrons-right" size={16} />
          </ButtonIcon>
        </PaginationButtonWrapper>
      </PaginationWrapper>
    </div>
  );
}

const TableContainer = styled.div`
  --color: rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  box-shadow: 0 1px 4px var(--color);
  border: 1px solid var(--color);
  border-radius: 6px;
  text-align: left;
`;

const TableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${COLORS.green[50]};
  border-bottom: 1px solid var(--color);
`;

const TableHeading = styled.th`
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  font-weight: ${WEIGHTS.bold};
  color: ${COLORS.gray[900]};
`;

const TableRowBody = styled.tr`
  &:nth-of-type(even) {
    background-color: ${COLORS.gray[50]};
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color);
  }
`;

const TableData = styled.td`
  padding: 0.875rem 1rem;
  /* vertical-align: top; */
`;

const PaginationWrapper = styled.div`
  padding-top: 12px;
  border-top: 1px solid ${COLORS.gray[300]};
  display: flex;
  gap: 6px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const PaginationButtonWrapper = styled.div`
  --border-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background-color: #fff;
  overflow: hidden;
  width: fit-content;
`;

const ButtonIcon = styled.button`
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  color: ${COLORS.green[600]};
  background-color: transparent;
  border: none;

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:last-child) {
    border-right: 1px solid var(--border-color);
  }

  &:not([disabled]):hover {
    background-color: ${COLORS.green[50]};
  }
`;
