import { fastify } from "fastify"
import { getAllPromptsRoute } from "./routes/get-all-prompts"
import { uploadVideoRoute } from "./routes/upload-video"
import { createTranscriptionRoute } from "./routes/create-transcription"
import { generateAICompletionsRoute } from "./routes/generate-ai-completion"
import { fastifyCors } from "@fastify/cors"

const app = fastify()
app.register(fastifyCors, {
  origin: '*', // qualquer URL frontend vai poder acessar meu backend
})

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAICompletionsRoute)



app.listen({
  port: 3333,
}).then(() => {
	console.log('HTTP Server Running!')
})