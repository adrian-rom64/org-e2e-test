declare type Address = {
  address: string
  seed: string
}

declare type Context = {
  dapp: Address
  org: Address
  device: Address
  user: Address
  orgToken?: string
}
