import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dayjs from 'dayjs'
import short from 'short-uuid'
import type { SysConfigDTO } from '~/types'

export default defineEventHandler(async (event) => {
  const { fileType } = (await readBody(event)) as { fileType: string }
  const sysConfig = await prisma.sysConfig.findFirst()
  const sysConfigDTO = sysConfig?.content as unknown as SysConfigDTO

  if (sysConfigDTO.upload.imgStrategy !== 's3' && sysConfigDTO.upload.attachmentStrategy !== 's3') {
    return {
      success: false,
      message: '未开启S3上传',
      preSignedUrl: '',
      imgUrl: '',
    }
  }

  const client = new S3Client({
    region: sysConfigDTO.s3.region,
    endpoint: sysConfigDTO.s3.endpoint,
    credentials: {
      accessKeyId: sysConfigDTO.s3.ak,
      secretAccessKey: sysConfigDTO.s3.sk,
    },
  })

  const key
    = `discussion/${dayjs(new Date()).format('YYYY/MM/DD/')}${short.generate()}`
  const command = new PutObjectCommand({
    Bucket: sysConfigDTO.s3.bucket,
    Key: key,
    ContentType: fileType,
  })
  const url = await getSignedUrl(client, command, { expiresIn: 600 })
  const imgUrl = `${sysConfigDTO.s3.domain}/${key}`
  return {
    success: true,
    message: '',
    preSignedUrl: url,
    imgUrl,
  }
})
