export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const token = useCookie(config.public.tokenKey);
  const needLoginUrls = ["/post/new", "/member/settings"];
  const sliderOpen = useState("sliderOpen");
  if (sliderOpen.value) {
    sliderOpen.value = false;
  }

  if (
    !token.value &&
    (needLoginUrls.includes(to.fullPath) ||
      needLoginUrls.some((x) => to.fullPath.startsWith(x)))
  ) {
    return navigateTo("/member/login");
  }
  return;
});
