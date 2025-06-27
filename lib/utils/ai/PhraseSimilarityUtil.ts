import { Duration } from 'luxon'

import { WaitUtils } from '~utils/date-and-time/WaitUtils'
import { logger } from '~utils/logger/Logger'

export class PhraseSimilarityUtil {
    async getPhraseSimilarity(phrase1: string, phrase2: string): Promise<number> {
        // Step 1: Import TensorFlow.js Node backend dynamically to set up the environment.
        await import('@tensorflow/tfjs-node')

        // Step 2: Import the Universal Sentence Encoder module dynamically.
        const use = await import('@tensorflow-models/universal-sentence-encoder')

        await WaitUtils.waitForDuration(Duration.fromObject({ seconds: 2 }))
        // Step 3: Load the Universal Sentence Encoder model.
        const model = await use.load()

        // Step 4: Embed the two phrases into numerical vectors.
        const embeddings = await model.embed([
            phrase1, phrase2,
        ])

        // Step 5: Convert the embeddings tensor into a JavaScript array.
        const vectors = await embeddings.array() as number[][]
        const vector1 = vectors[0]
        const vector2 = vectors[1]
        
        // Step 6: Compute cosine similarity between the two vectors.
        const dotProduct = vector1.reduce((sum, val, idx) => sum + val * vector2[idx], 0)
        const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0))
        const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0))
        const similarity = dotProduct / (magnitude1 * magnitude2)

        logger.info(`Similarity calculated successfully:\n Phrase 1: ${phrase1}\n Phrase 2: ${phrase2}\n Similarity: ${similarity.toFixed(4)}`)
    
        return similarity
    }
}