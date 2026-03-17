import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setFilterStatuses,
  setFilterPriority,
  setSearch,
  setSortField,
  setSortDirection,
  hydrateFilters,
} from '../store/filtersSlice'
import type { Status, FilterPriority, SortField, SortDirection } from '../types'

export function useFilters() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.filters)
  const [searchParams, setSearchParams] = useSearchParams()


  useEffect(() => {
    const statuses = searchParams.getAll('status') as Status[]
    const priority = (searchParams.get('priority') || 'All') as FilterPriority
    const search = searchParams.get('search') || ''
    const sortField = (searchParams.get('sortField') || 'updatedAt') as SortField
    const sortDirection = (searchParams.get('sortDir') || 'desc') as SortDirection
    dispatch(hydrateFilters({ statuses, priority, search, sortField, sortDirection }))
  }, []) 

  
  useEffect(() => {
    const params = new URLSearchParams()
    filters.statuses.forEach((s) => params.append('status', s))
    if (filters.priority !== 'All') params.set('priority', filters.priority)
    if (filters.search) params.set('search', filters.search)
    if (filters.sortField !== 'updatedAt') params.set('sortField', filters.sortField)
    if (filters.sortDirection !== 'desc') params.set('sortDir', filters.sortDirection)
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  return {
    filters,
    setStatuses: (s: Status[]) => dispatch(setFilterStatuses(s)),
    setPriority: (p: FilterPriority) => dispatch(setFilterPriority(p)),
    setSearch: (v: string) => dispatch(setSearch(v)),
    setSortField: (f: SortField) => dispatch(setSortField(f)),
    setSortDirection: (d: SortDirection) => dispatch(setSortDirection(d)),
  }
}
