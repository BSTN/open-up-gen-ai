export const useLanguage = () => {
  const route = useRoute()
  const { locale } = useI18n()
  const languageCode = computed(() => {
    return locale.value === 'en' ? '' : locale.value
  })
  const markdownPath = computed(() => {
    const pad = route.fullPath === '/' ? '/index' : route.fullPath
    return languageCode.value ? pad + '.' + languageCode.value : route.fullPath
  })
  return {
    markdownPath
  }
}
