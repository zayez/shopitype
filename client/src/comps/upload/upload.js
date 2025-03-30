import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'

const IMAGE_MAX_SIZE_MB = 5
const IMAGE_MAX_SIZE = 1024 * (1024 * IMAGE_MAX_SIZE_MB)

// Aspect ratio:
// 57 : 64

const Upload = ({ setImageSource, setImageData }) => {
  const verifyFile = (file) => {
    if (file) {
      const fileType = file.type
      const fileSize = file.size
      if (fileSize > IMAGE_MAX_SIZE) {
        toast.error('This images is not allowed. Size is too large.')
        return false
      }
      return true
    }
  }

  const processImage = (file) => {
    console.log(file)
    setImageData(file)
    const reader = new FileReader()
    reader.addEventListener(
      'load',
      () => {
        setImageSource(reader.result)
      },
      false,
    )
    reader.readAsDataURL(file)
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    const isVerified = verifyFile(file)
    if (isVerified) {
      processImage(file)
    } else {
      toast.error('There was an error in processing the image.')
    }
  }

  const handleOnDrop = useCallback((files, rejFiles) => {
    const isVerified = verifyFile(files[0])
    if (isVerified) {
      const file = files[0]
      processImage(file)
    }
    if (rejFiles.length > 0) {
      toast.error('Invalid file type.')
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: handleOnDrop,
      accept: { 'image/png': [], 'image/jpeg': [] },
      multiple: false,
    })
  return (
    <div className="field">
      <div className="field-label">
        <label>Image</label>
      </div>
      <div className="field-body">
        <div className="upload-container" {...getRootProps()}>
          <input {...getInputProps()} onChange={handleFile} />
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <p>Drag 'n' drop some file here, or click to select a file</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Upload
