import { LeafyGreen } from 'lucide-react';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        LeafyGreen: '#92e3a9',
      },
    },
  },
  plugins: [],
};
