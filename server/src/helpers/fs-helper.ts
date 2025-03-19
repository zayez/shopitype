import path from 'path'
import * as fsSync from 'fs'
import { promises as fs } from 'fs'
import config from '../config/config'

const { isProd, isDev } = config

const existsFile = async (filepath: string) =>
  await new Promise((resolve, reject) => {
    const fileExists = fsSync.existsSync(filepath)
    resolve(fileExists)
  })

const deleteFile = async (filepath: string) => {
  const filedir = isDev || isProd ? 'public' : 'tests/data'
  const file = path.join(filedir, filepath)
  try {
    if (await existsFile(file)) {
      await fs.unlink(file)
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export { deleteFile, existsFile }
