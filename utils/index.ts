
export const getAvatarUrl = (hash: string) => {
  const config = useRuntimeConfig();
  return `${config.public.avatarCdn}${hash}`;
};
