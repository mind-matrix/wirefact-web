import axios, { AxiosInstance } from "axios"
import { Store } from "vuex"
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import device from "current-device"

export class BaseService {
    client: AxiosInstance
    constructor(store: Store<any>) {

        this.client = axios.create({
            baseURL: process.env.API_URL!,
            responseType: "json"
        })
        
        this.client.interceptors.request.use(async function (config) {
            if (store.state.token) {
                config.headers["authorization"] = store.state.token
            }
            const fp = await FingerprintJS.load()
            config.headers['client-fingerprint'] = (await fp.get()).visitorId
            config.headers['device-info'] = `${device.type},${device.os}`
            return config
        })
    }
}