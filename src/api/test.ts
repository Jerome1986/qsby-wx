import type { TestEvent } from '@/types/Test'
import { request } from '@/utils/http'

export const testApi = () => {
  return request<TestEvent[]>({
    method: 'GET',
    url: 'http://localhost/mp.php/plays/getEventList',
  })
}

export const testAddApi = (testData: any[]) => {
  return request({
    method: 'POST',
    url: 'https://x9zmst6evg.sealoshzh.site/test',
    data: { testData: testData },
  })
}
