declare type Address = {
  address: string
  seed: string
}

declare type Context = {
  dappFather: Address
  dapp: Address
  org: Address
  device: Address
  user: Address
  orgToken?: string
  key?: string
}
