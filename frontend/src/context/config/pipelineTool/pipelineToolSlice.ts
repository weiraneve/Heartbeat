import { PIPELINE_TOOL_TYPES } from '@src/constants/resources'
import { initialPipelineToolVerifiedResponseState, IPipelineToolVerifyResponse } from './verifyResponseSlice'

export interface IPipelineToolState {
  config: { type: string; token: string }
  isVerified: boolean
  isShow: boolean
  verifiedResponse: IPipelineToolVerifyResponse
}

export const initialPipelineToolState: IPipelineToolState = {
  config: {
    type: PIPELINE_TOOL_TYPES.BUILD_KITE,
    token: '',
  },
  isVerified: false,
  isShow: false,
  verifiedResponse: initialPipelineToolVerifiedResponseState,
}
