import { readFileSync } from 'fs'
import * as helper from './helper'

const { lib, config } = helper

describe('Organisation e2e test', () => {
  const ctx = helper.initialContext()

  beforeAll(() => {
    console.log(ctx)
  })

  it('transfer funds', async () => {
    await Promise.all([
      helper.fund(ctx.dapp.address, 2),
      helper.fund(ctx.org.address, 2),
      helper.fund(ctx.device.address, 2),
      helper.fund(ctx.user.address, 2)
    ])
  })

  it('set scripts', async () => {
    const dappScript = readFileSync('./assets/dapp.base64').toString()
    const orgScript = readFileSync('./assets/org.base64').toString()
    const deviceScript = readFileSync('./assets/dapp.base64').toString()

    const dappTx = lib.setScript(dappScript, ctx.dapp.seed)
    const orgTx = lib.setScript(orgScript, ctx.org.seed)
    const deviceTx = lib.setScript(deviceScript, ctx.device.seed)

    await Promise.all([dappTx, orgTx, deviceTx])
  })

  it('issue organisation token', async () => {
    ctx.orgToken = await helper.issueToken(ctx.org.seed)
    await helper.lib.transferKey(ctx.user.address, ctx.orgToken, ctx.org.seed)
  })

  it('set data entries', async () => {
    const promises = [
      lib.insertData(
        [
          { key: `org_${ctx.org.address}`, value: 'active' },
          { key: `device_${ctx.device.address}`, value: 'active' }
        ],
        ctx.dapp.seed
      ),
      lib.insertData(
        [
          { key: `user_${ctx.user.address}`, value: 'active' },
          { key: `token_${ctx.orgToken}`, value: 'active' }
        ],
        ctx.org.seed
      ),
      lib.insertData(
        [
          { key: 'dapp', value: ctx.dapp.address },
          { key: 'owner', value: ctx.dapp.address }
        ],
        ctx.device.seed
      )
    ]

    await Promise.all(promises)
  })
})
