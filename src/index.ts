import { uploadOrGetMetadata, isVideo, isImage, CloudinaryOptions } from './cloudinary-promised'
import { FastImageVideoBestProps, FastImageImageBestProps } from 'react-fast-image'
import getResponsiveWidths from './getResponsiveWidths'
import getBase64FromUrl from './getBase64FromUrl'
import getSrcSet from './getSrcSet'
const md5File = require('md5-file/promise')

interface Options {
    path: string
    maxWidth?: number
    toImgFormat?: 'jpg' | 'png'
    toVideoFormat?: 'mp4'
    toVideoPosterFormat?: 'jpg' | 'png'
    config: CloudinaryOptions
}

type BestProps = FastImageImageBestProps | FastImageVideoBestProps

export const getData = async (options: Options): Promise<BestProps> => {
    const {
        path,
        maxWidth = 1024,
        toImgFormat = 'jpg',
        toVideoFormat = 'mp4',
        toVideoPosterFormat = 'jpg',
        config,
    } = options
    const name = config.cloud_name
    const id = await md5File(path)
    const data = await uploadOrGetMetadata(id, path, config)
    const { width, height } = data

    if (isVideo(path)) {
        const videoSrc = `https://res.cloudinary.com/${name}/video/upload/w_${maxWidth}/${id}.${toVideoFormat}`

        const videoPosterSrc = `https://res.cloudinary.com/${name}/video/upload/w_${maxWidth}/${id}.${toVideoPosterFormat}`

        const videoPosterWebPSrc = `https://res.cloudinary.com/${name}/video/upload/w_${maxWidth}/${id}.webp`

        const videoPosterBase64 = await getBase64FromUrl(
            `https://res.cloudinary.com/${config.cloud_name}/video/upload/w_10/${id}.jpg`,
        )

        const props: FastImageVideoBestProps = {
            videoPosterSrc,
            videoPosterWebPSrc,
            videoPosterBase64,
            videoSrc,
            width,
            height,
        }
        return props
    }

    if (isImage(path)) {
        const imgSrc = `https://res.cloudinary.com/${name}/image/upload/w_${maxWidth}/${id}.${toImgFormat}`

        const imgWebPSrc = `https://res.cloudinary.com/${name}/image/upload/w_${maxWidth}/${id}.webp`

        const imgBase64 = await getBase64FromUrl(
            `https://res.cloudinary.com/${config.cloud_name}/image/upload/w_10/${id}.jpg`,
        )

        const widths = getResponsiveWidths(maxWidth, width)
        const imgSrcSet = getSrcSet(
            widths,
            w => `https://res.cloudinary.com/${name}/image/upload/w_${w}/${id}.${toImgFormat}`,
        )

        const imgWebPSrcSet = getSrcSet(
            widths,
            w => `https://res.cloudinary.com/${name}/image/upload/w_${w}/${id}.webp`,
        )

        const props: FastImageImageBestProps = {
            imgAlt: '',
            imgSizes: '',
            imgSrc,
            imgWebPSrc,
            imgSrcSet,
            imgWebPSrcSet,
            imgBase64,
            width,
            height,
        }
        return props
    }

    throw new Error('Not a recognized format.')
}
