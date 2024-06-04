interface SaveTagRequest {
  id?: number
  name: string
  desc: string
  enName: string
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as SaveTagRequest
  if (request.name.trim() && request.desc.trim() && request.enName.trim()) {
    const { name, desc, enName } = request
    await prisma.tag.upsert({
      where: {
        id: request.id,
      },
      update: { name, desc, enName },
      create: { name, desc, enName },
    })
  }
  return {
    success: true,
  }
})
