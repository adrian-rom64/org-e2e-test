import { getInstance } from 'skey-lib'
import * as Transactions from '@waves/waves-transactions'

export const config = {
  genesis: 'waves private node seed with waves tokens',
  nodeUrl: 'http://localhost:6869',
  chainId: 'R'
}

export const lib = getInstance({
  nodeUrl: config.nodeUrl,
  chainId: config.chainId
})

export const createAddress = () => {
  const { address, seed } = lib.createAccount()
  return { address, seed }
}

export const initialContext = (): Context => ({
  dapp: createAddress(),
  org: createAddress(),
  device: createAddress(),
  user: createAddress()
})

export const fund = (receiver: string, amount: number) => {
  return lib.transfer(receiver, amount, config.genesis)
}

export const issueToken = async (seed: string) => {
  const params: Transactions.IIssueParams = {
    quantity: 100_000,
    name: 'test-token',
    description: 'test-desc',
    decimals: 0,
    reissuable: true
  }

  const tx = Transactions.issue(params, seed)
  return lib.broadcast(tx)
}
