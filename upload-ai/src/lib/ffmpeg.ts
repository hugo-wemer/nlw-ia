import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from '@ffmpeg/util'

let ffmpeg: FFmpeg | null
const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'

export async function getFFmpeg(){
  if(ffmpeg){
    return ffmpeg
  }
  ffmpeg = new FFmpeg()

  if(!ffmpeg.loaded){
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`,"text/javascript")
    })
  }
  return ffmpeg
}