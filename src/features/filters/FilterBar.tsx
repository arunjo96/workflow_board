import React from 'react'
import { Button, Select } from '../../components/ui'
import { useFilters } from '../../hooks/useFilters'
import type { Status } from '../../types'
import { FiSearch } from 'react-icons/fi'
import { FaArrowUpLong, FaArrowDownLong  } from "react-icons/fa6";
import { IoFilterSharp  } from "react-icons/io5";
import styles from './FilterBar.module.css'



const STATUSES: Status[] = ['Backlog', 'In Progress', 'Done']

export const FilterBar: React.FC = () => {
  const { filters, setStatuses, setPriority, setSearch, setSortField, setSortDirection, } =
    useFilters()

  const toggleStatus = (s: Status) => {
    if (filters.statuses.includes(s)) {
      setStatuses(filters.statuses.filter((x) => x !== s))
    } else {
      setStatuses([...filters.statuses, s])
    }
  }

  const hasActiveFilters =
    filters.statuses.length > 0 ||
    filters.priority !== 'All' ||
    filters.search !== ''

  return (
      <div className={styles.bar}>
          <div className={styles.searchWrapper}>
          <FiSearch className={styles.icon} />
      <input
        className={styles.search}
        value={filters.search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        aria-label="Search tasks" />
          </div>

      <div className={styles.statusFilters}>
        {STATUSES.map((s) => (
          <button
            key={s}
            className={[styles.statusBtn, filters.statuses.includes(s) ? styles.active : ''].join(' ')}
            onClick={() => toggleStatus(s)}
            aria-pressed={filters.statuses.includes(s)}
            >

                <IoFilterSharp size={14} />
            {s}
          </button>
        ))}
      </div>

      <Select
        value={filters.priority}
        onChange={(e) => setPriority(e.target.value as typeof filters.priority)}
        options={[
          { value: 'All', label: 'All priorities' },
          { value: 'Low', label: 'Low' },
          { value: 'Medium', label: 'Medium' },
          { value: 'High', label: 'High' },
        ]}
        aria-label="Filter by priority"
      />

      <Select
        value={filters.sortField}
        onChange={(e) => setSortField(e.target.value as typeof filters.sortField)}
        options={[
          { value: 'updatedAt', label: 'Sort: Updated' },
          { value: 'createdAt', label: 'Sort: Created' },
          { value: 'priority', label: 'Sort: Priority' },
        ]}
        aria-label="Sort by"
      />

      <button
        className={[styles.dirBtn, filters.sortDirection === 'asc' ? styles.asc : ''].join(' ')}
        onClick={() => setSortDirection(filters.sortDirection === 'asc' ? 'desc' : 'asc')}
        aria-label={`Sort direction: ${filters.sortDirection}`}
        title="Toggle sort direction"
      >
        {filters.sortDirection === 'asc' ? <FaArrowUpLong/> : <FaArrowDownLong/>}
    
      </button>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setStatuses([]); setPriority('All'); setSearch('') }}
        >
          Clear
        </Button>
      )}
    </div>
  )
}
