import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { MOCK_PIPELINE_URL, MOCK_PIPELINE_VERIFY_REQUEST_PARAMS, PIPELINE_TOOL_VERIFY_ERROR_MESSAGE } from '../fixtures'
import { pipelineToolClient } from '@src/clients/PipelineToolClient'

const server = setupServer(
  rest.post(MOCK_PIPELINE_URL, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

describe('error notification', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should isPipelineVerified is true when pipelineTool verify response status 200', async () => {
    const result = await pipelineToolClient.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS)

    expect(result.isPipelineToolVerified).toEqual(true)
  })

  it('should throw error when pipelineTool verify response status 400', async () => {
    server.use(rest.post(MOCK_PIPELINE_URL, (req, res, ctx) => res(ctx.status(400))))

    pipelineToolClient.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(PIPELINE_TOOL_VERIFY_ERROR_MESSAGE[400])
    })
  })
  it('should throw error when pipelineTool verify response status 404', async () => {
    server.use(rest.post(MOCK_PIPELINE_URL, (req, res, ctx) => res(ctx.status(404))))

    pipelineToolClient.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(PIPELINE_TOOL_VERIFY_ERROR_MESSAGE[404])
    })
  })

  it('should throw error when pipelineTool verify response status 500', async () => {
    server.use(rest.post(MOCK_PIPELINE_URL, (req, res, ctx) => res(ctx.status(500))))

    pipelineToolClient.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS).catch((e) => {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(PIPELINE_TOOL_VERIFY_ERROR_MESSAGE[500])
    })
  })
})
