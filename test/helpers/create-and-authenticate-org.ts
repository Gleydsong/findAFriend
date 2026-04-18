import { app } from '../../src/app'

interface CreateAndAuthenticateOrgResponse {
  token: string
}

export async function createAndAuthenticateOrg(): Promise<CreateAndAuthenticateOrgResponse> {
  await app.inject({
    method: 'POST',
    url: '/orgs',
    payload: {
      name: 'FindAFriend',
      email: 'contato@findafriend.com',
      password: '123456',
      address: 'Rua das Flores, 100',
      city: 'Sao Paulo',
      state: 'SP',
      cep: '01001000',
      whatsapp: '11999999999',
    },
  })

  const authResponse = await app.inject({
    method: 'POST',
    url: '/sessions',
    payload: {
      email: 'contato@findafriend.com',
      password: '123456',
    },
  })

  const { token } = authResponse.json()

  return { token }
}
