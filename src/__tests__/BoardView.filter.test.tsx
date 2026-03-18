import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../test-utils'
import { BoardView } from './../features/board/BoardView'

describe('BoardView - Filter Behavior', () => {
  test('user can filter tasks using search input', async () => {
    renderWithProviders(<BoardView />)

    const user = userEvent.setup()


    await user.click(screen.getByRole('button', { name: /new task/i }))
    let modal = await screen.findByRole('dialog')

    await user.type(screen.getByLabelText(/title/i), 'React Task')
    await user.type(screen.getByLabelText(/description/i), 'Learn React')

    await user.click(screen.getByLabelText(/submit-task/i))

 
    await user.click(screen.getByRole('button', { name: /new task/i }))
    modal = await screen.findByRole('dialog')

    await user.type(screen.getByLabelText(/title/i), 'Angular Task')
    await user.type(screen.getByLabelText(/description/i), 'Learn Angular')

    await user.click(screen.getByLabelText(/submit-task/i))

   
    expect(await screen.findByText('React Task')).toBeInTheDocument()
    expect(await screen.findByText('Angular Task')).toBeInTheDocument()

    
    const searchInput = screen.getByPlaceholderText(/search/i)
    await user.type(searchInput, 'React')

   
    expect(await screen.findByText('React Task')).toBeInTheDocument()
    expect(screen.queryByText('Angular Task')).not.toBeInTheDocument()
  })
})