import { toast } from 'react-toastify'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import Upload from './upload'
import userEvent from '@testing-library/user-event'

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}))

class DummyFileReader {
  constructor() {
    this.result = 'data:image/png;base64,dummydata'
  }
  readAsDataURL(file) {
    setTimeout(() => {
      this.onload({ target: { result: this.result } })
    }, 0)
  }
  addEventListener(event, callback) {
    if (event === 'load') {
      this.onload = callback
    }
  }
}

describe('Upload component', () => {
  let setImageSource, setImageData

  beforeEach(() => {
    setImageSource = jest.fn()
    setImageData = jest.fn()
    window.FileReader = DummyFileReader
    toast.error.mockClear()
  })

  test('processes a valid file from file input', async () => {
    const { container, getByText } = render(
      <Upload setImageSource={setImageSource} setImageData={setImageData} />,
    )

    const input = container.querySelector('input[type="file"]')
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(setImageData).toHaveBeenCalledWith(file)
      expect(setImageSource).toHaveBeenCalledWith(
        'data:image/png;base64,dummydata',
      )
    })
    expect(toast.error).not.toHaveBeenCalled()
  })

  test('shows error when file is too large', async () => {
    const { container } = render(
      <Upload setImageSource={setImageSource} setImageData={setImageData} />,
    )

    const input = container.querySelector('input[type="file"]')
    const largeFile = new File(['a'.repeat(1024 * 1024 * 6)], 'large.png', {
      type: 'image/png',
    })
    fireEvent.change(input, { target: { files: [largeFile] } })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'This images is not allowed. Size is too large.',
      )
    })
    expect(setImageData).not.toHaveBeenCalled()
    expect(setImageSource).not.toHaveBeenCalled()
  })

  test('handles file drop with a valid file', async () => {
    const { container } = render(
      <Upload setImageSource={setImageSource} setImageData={setImageData} />,
    )

    const file = new File(['dummy content'], 'test.jpeg', {
      type: 'image/jpeg',
    })

    const input = screen.getByTestId('dropzone')

    userEvent.upload(input, file)

    await waitFor(() => {
      expect(setImageData).toHaveBeenCalledWith(file)
      expect(setImageSource).toHaveBeenCalledWith(
        'data:image/png;base64,dummydata',
      )
    })
  })

  test('shows error when invalid file type is dropped', async () => {
    const { container } = render(
      <Upload setImageSource={setImageSource} setImageData={setImageData} />,
    )

    const file = new File(['dummy content'], 'test.gif', { type: 'image/gif' })

    const input = container.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid file type.')
    })
  })
})
