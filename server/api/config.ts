import fs from "fs";

export default defineEventHandler(async (event) => {
  const config = await prisma.sysConfig.findFirst({
    select: {
      content: true,
    },
  });
  let version = "1.0";
  try {
    if (fs.existsSync("/app/version")) {
      version = await fs.readFileSync("/app/version", {
        encoding: "utf8",
        flag: "r",
      });
    }
  } catch (e) {
    // console.log('read version file error',e)
  }
  return {
    success: true,
    data: config?.content,
    version,
  };
});
