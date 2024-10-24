export const useLanguage = () => {
  const route = useRoute()
  const { locale } = useI18n()
  const languageCode = computed(() => {
    return locale.value === 'en' ? '' : locale.value
  })
  const markdownPath = computed(() => {
    const pad = route.path === '/' ? '/index' : route.path
    // disabled
    return pad
    // return languageCode.value ? pad + '.' + languageCode.value : route.path
  })
  return {
    markdownPath
  }
}
