import 'dotenv/config'
import { uploadFile } from './cloudinary-promised'
import * as path from 'path'

const cloudName: string = (process.env.CLOUDINARY_CLOUD_NAME as any) as string
const apiSecret: string = (process.env.CLOUDINARY_API_SECRET as any) as string
const apiKey: string = (process.env.CLOUDINARY_API_KEY as any) as string

test('upload', async () => {
    try {
        await uploadFile('cloudinary', path.join(__dirname, './cloudinary.png'), {
            cloud_name: cloudName,
            api_secret: apiSecret,
            api_key: apiKey,
        }).then(data => {
            console.log('success')
        })
    } catch (e) {
        console.log('caught exception')
    }
})
