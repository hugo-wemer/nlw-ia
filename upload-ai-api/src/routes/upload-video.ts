import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart"
import { prisma } from "../lib/prisma";
import path from "node:path";
import { randomUUID } from "node:crypto"
import { pipeline } from "node:stream"
import { promisify } from "node:util"
import fs from "node:fs"

const pump = promisify(pipeline)


export async function uploadVideoRoute(app: FastifyInstance){
  app.register(fastifyMultipart, {
    limits: {
      // tamanho máximo do arquivo = 25 MB (1048576/1024)
      fileSize: 1048576 * 25 
    } 
  })

  app.post('/videos', async (request, reply) => {
    const data = await request.file()
    if (!data){
      return reply.status(400).send({error: 'Missing file input.'})
    }

    const extension = path.extname(data.filename)

    if(extension !== '.mp3'){
      return reply.status(400).send({error: 'Invalid input type, please upload a mp3.'})
    }

    // renomeia arquivo para evitar repetições no banco 
    const fileBaseName = path.basename(data.filename, extension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`

    const uploadDestination = path.resolve(__dirname,'../../tmp', fileUploadName)

    // vai escrevendo o arquivo enquanto o upload vai chegando
    await pump(data.file, fs.createWriteStream(uploadDestination))

    // salva no banco de dados
    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination
      }
    })

    return {
      video
    }
  })
}