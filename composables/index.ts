export const useAbsoluteUrl=()=>{
  const url = useRequestURL();
  const getAbsoluteUrl=(path:string)=>{
    const baseUrl=url.protocol+'//'+ url.host
    return baseUrl+path
  };
  return {getAbsoluteUrl}
}