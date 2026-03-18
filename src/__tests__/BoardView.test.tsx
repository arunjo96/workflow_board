import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../test-utils'
import { BoardView } from './../features/board/BoardView'

describe('BoardView - Core Workflow', () => {
  test('user can create a task and see it on board', async () => {
    renderWithProviders(<BoardView />)

      const user = userEvent.setup()
      
      await user.click(screen.getByRole('button', { name: /new task/i }))
      
    const modal = await screen.findByRole('dialog')

    await user.type(
      within(modal).getByLabelText(/title/i),
      'Test Task'
    )

    await user.type(
      within(modal).getByLabelText(/description/i),
      'Test Desc'
      )
      
    await user.click(
      within(modal).getByLabelText(/submit-task/i)
    )

    expect(await screen.findByText('Test Task')).toBeInTheDocument()
  })


})