import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { FiltersState, Status, FilterPriority, SortField, SortDirection } from '../types'

const initialState: FiltersState = {
  statuses: [],
  priority: 'All',
  search: '',
  sortField: 'updatedAt',
  sortDirection: 'desc',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilterStatuses(state, action: PayloadAction<Status[]>) {
      state.statuses = action.payload
    },
    setFilterPriority(state, action: PayloadAction<FilterPriority>) {
      state.priority = action.payload
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setSortField(state, action: PayloadAction<SortField>) {
      state.sortField = action.payload
    },
    setSortDirection(state, action: PayloadAction<SortDirection>) {
      state.sortDirection = action.payload
    },
    hydrateFilters(state, action: PayloadAction<Partial<FiltersState>>) {
      return { ...state, ...action.payload }
    },
    resetFilters() {
      return initialState
    },
  },
})

export const {
  setFilterStatuses,
  setFilterPriority,
  setSearch,
  setSortField,
  setSortDirection,
  hydrateFilters,
  resetFilters,
} = filtersSlice.actions

export default filtersSlice.reducer
