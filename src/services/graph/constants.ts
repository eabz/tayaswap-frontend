import request, { type RequestDocument } from 'graphql-request'

export const tayaswapSubpgrah = async (query: RequestDocument, variables = {}) =>
  request('https://graph-monad.kindynos.mx/subgraphs/name/tayaswap-v2-subgraph', query, variables)
