"use client";

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { RejectedCheck } from "@/types/bcra"

type SortConfig = {
  key: keyof RejectedCheck
  direction: 'asc' | 'desc' | null
}

type RejectedChecksTableProps = {
  rejectedChecks: RejectedCheck[]
}

export default function RejectedChecksTable({ rejectedChecks }: RejectedChecksTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nroCheque', direction: null })

  const sortedRejectedChecks = useMemo(() => {
    if (sortConfig.direction === null) {
      return rejectedChecks
    }

    return [...rejectedChecks].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [rejectedChecks, sortConfig])

  const requestSort = (key: keyof RejectedCheck) => {
    let direction: 'asc' | 'desc' | null = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key: keyof RejectedCheck) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        return <ArrowUp className="ml-2 h-4 w-4" />
      } else if (sortConfig.direction === 'desc') {
        return <ArrowDown className="ml-2 h-4 w-4" />
      }
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  if (rejectedChecks.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No se encontraron cheques rechazados para este ID.</p>
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Cheques Rechazados</h3>
        <Button
          onClick={() => setSortConfig({ key: 'nroCheque', direction: null })}
          variant="outline"
          size="sm"
        >
          Restablecer orden original
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {(Object.keys(sortedRejectedChecks[0]) as Array<keyof RejectedCheck>).map((key) => (
                <TableHead key={key} className="cursor-pointer" onClick={() => requestSort(key)}>
                  <div className="flex items-center">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {getSortIcon(key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRejectedChecks.map((check, index) => (
              <TableRow key={index}>
                {(Object.keys(check) as Array<keyof RejectedCheck>).map((key) => (
                  <TableCell key={key}>
                    {key === 'monto'
                      ? check[key].toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : check[key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}