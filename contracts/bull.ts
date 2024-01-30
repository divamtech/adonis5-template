declare module '@ioc:Rocketseat/Bull' {
  interface BullConnectionsList {
    bull: BullConnectionContract
    direct_uri?: string
  }
}

type HashType = Record<string, any>
