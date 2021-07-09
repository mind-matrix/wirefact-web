import { BaseService } from "./base.service"

export class ClientService extends BaseService {
    

    async post(entity: string, data: object) {
        let response = await this.client.post(`/${entity}`, data)
        return response.data
    }

    async get(entity: string, id: string | null = null, params: { [k: string]: string | number } = {}) {
        let response = await this.client.get(`/${entity}${id ? `/${id}`:''}`, { params })
        return response.data
    }

    async put(entity: string, id: string, data: object = {}) {
        let response = await this.client.put(`/${entity}${id ? `/${id}`:''}`, data)
        return response.data
    }

    async delete(entity: string, id: string) {
        let response = await this.client.delete(`/${entity}${id ? `/${id}`:''}`)
        return response.data
    }
}
