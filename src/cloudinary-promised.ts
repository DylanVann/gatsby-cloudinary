const cloudinary = require('cloudinary')
import { urlExists } from 'url-exists-promise'
import fs from 'fs'
import axios from 'axios'

const videoExtensions = ['mp4']
const imageExtensions = ['png', 'jpg']

export interface CloudinaryOptions {
    cloud_name: string
    api_key: string
    api_secret: string
}

export const isVideo = (localAbsolutePath: string) => {
    for (let i = 0; i < videoExtensions.length; i++) {
        const extension = videoExtensions[i]
        if (localAbsolutePath.endsWith(extension)) return true
    }
    return false
}

export const isImage = (localAbsolutePath: string) => {
    for (let i = 0; i < imageExtensions.length; i++) {
        const extension = imageExtensions[i]
        if (localAbsolutePath.endsWith(extension)) return true
    }
    return false
}

export const uploadFile = (
    id: string,
    localAbsolutePath: string,
    options: CloudinaryOptions,
): Promise<any> =>
    axios
        .post(
            `https://api.cloudinary.com/v1_1/${options.cloud_name}/${
                isVideo(localAbsolutePath) ? 'video' : 'image'
            }>/upload`,
            fs.createReadStream(localAbsolutePath),
            {
                params: {
                    public_id: id,
                    api_key: options.api_key,
                    api_secret: options.api_secret,
                },
            },
        )
        .then(({ data }) => data)

export const getMetadata = (
    id: string,
    localAbsolutePath: string,
    options: CloudinaryOptions,
): Promise<any> =>
    axios.get(
        `https://api.cloudinary.com/v1_1/${options.cloud_name}/${
            isVideo(localAbsolutePath) ? 'video' : 'image'
        }>/upload`,
        {
            params: {
                public_id: id,
                api_key: options.api_key,
                api_secret: options.api_secret,
                image_metadata: true,
            },
        },
    )

export const imageExists = (id: string, options: CloudinaryOptions): Promise<boolean> => {
    const urlImg = `http://res.cloudinary.com/${options.cloud_name}/image/upload/${id}`
    return urlExists(urlImg)
}

export const videoExists = (id: string, options: CloudinaryOptions): Promise<boolean> => {
    const urlVideo = `http://res.cloudinary.com/${options.cloud_name}/video/upload/${id}`
    return urlExists(urlVideo)
}

export const fileExists = (
    id: string,
    localAbsolutePath: string,
    options: CloudinaryOptions,
): Promise<boolean> => {
    if (isVideo(localAbsolutePath)) {
        return videoExists(id, options)
    }
    return imageExists(id, options)
}

export const uploadOrGetMetadata = async (
    id: string,
    localAbsolutePath: string,
    options: CloudinaryOptions,
): Promise<any> => {
    const exists = await fileExists(id, localAbsolutePath, options)
    if (!exists) {
        // Have to upload the image or video
        return uploadFile(id, localAbsolutePath, options)
    } else {
        // Already uploaded, we just get the metadata
        return getMetadata(id, localAbsolutePath, options)
    }
}
