import { getInstance } from 'skey-lib'
import * as Transactions from '@waves/waves-transactions'
import config from '../config'

export const lib = getInstance({
  nodeUrl: config.nodeUrl,
  chainId: config.chainId
})

export const createAddress = () => {
  const { address, seed } = lib.createAccount()
  return { address, seed }
}

export const initialContext = (): Context => ({
  dappFather: createAddress(),
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
    reissuable: true,
    chainId: config.chainId,
    fee: lib.WVS + 4 * lib.FEE_MULTIPLIER
  }

  const tx = Transactions.issue(params, seed)
  return lib.broadcast(tx)
}

export const activateKey = async (assetId: string, dapp: string, seed: string) => {
  const params: Transactions.IInvokeScriptParams = {
    dApp: dapp,
    call: { function: 'activate' },
    payment: [{ assetId, amount: 1 }],
    chainId: config.chainId,
    fee: 5 * lib.FEE_MULTIPLIER
  }

  const tx = Transactions.invokeScript(params, seed)
  return lib.broadcast(tx)
}
