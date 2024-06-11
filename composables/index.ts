import type { SysConfigDTO } from '~/types'

export function useAbsoluteUrl() {
  const url = useRequestURL()
  const getAbsoluteUrl = (path: string) => {
    const baseUrl = `${url.protocol}//${url.host}`
    return baseUrl + path
  }
  return { getAbsoluteUrl }
}

export function useGlobalConfig() {
  return useState('globalConfig', () => {
    return { sysConfig: {} as SysConfigDTO, version: '' }
  })
}
