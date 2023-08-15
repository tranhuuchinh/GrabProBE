import { Client } from '@elastic/elasticsearch'

export default class ElasticsearchService {
  private static instance: ElasticsearchService
  private client: Client

  private constructor() {
    this.client = new Client({ node: 'http://localhost:9200' })
  }

  public static getInstance(): ElasticsearchService {
    if (!ElasticsearchService.instance) {
      ElasticsearchService.instance = new ElasticsearchService()
    }
    return ElasticsearchService.instance
  }

  public async createIndex(indexNameStr: string): Promise<string> {
    const indexName = this.convertToValidIndexName(indexNameStr)
    console.log(indexName)
    try {
      await this.client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              title: { type: 'text' },
              content: { type: 'text' }
            }
          }
        }
      })
      return indexName
    } catch (e) {
      return ''
    }
    console.log(`Created index '${indexName}'`)
  }

  public async addDocument(indexName: string, document: any): Promise<string> {
    const { body: indexResponse } = await this.client.index({
      index: indexName,
      body: document
    })
    console.log(`Added document to index. ID: ${indexResponse._id}`)
    return indexResponse._id
  }

  public async search(indexNameStr: string, query: string): Promise<any[]> {
    const indexName = this.convertToValidIndexName(indexNameStr)
    const { body: searchResponse } = await this.client.search({
      index: indexName,
      q: query
    })
    console.log('Search results:', searchResponse.hits.hits)
    return searchResponse.hits.hits
  }

  private convertToValidIndexName(inputName: string): string {
    // Replace invalid characters with underscores
    const validName = inputName?.replace(/[ ,"*\\<|>\\/?]/g, '_')

    // Remove consecutive underscores
    const cleanName = validName?.replace(/_+/g, '_')

    // Remove underscores at the beginning and end
    const finalName = cleanName?.replace(/^_+|_+$/g, '')

    return finalName?.toLowerCase()
  }
}
