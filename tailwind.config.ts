import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [],
  theme: {
    extend: {
      colors: {

      },
      boxShadow: {
        '10px': '0 0 10px rgba(0, 0, 0, .3)',
      },
    },
  },
}
