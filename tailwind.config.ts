import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

const config: Config = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    screens: {
      sm: '768px',
      md: '1024px',
      lg: '1280px',
      xl: '1740px',
    },
  },
  plugins: [daisyui],
  daisyui: {
    darkTheme: false, // 禁用 DaisyUI 的 dark mode
  },
}
export default config
