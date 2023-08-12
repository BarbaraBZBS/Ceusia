/** @type {import('tailwindcss').Config} */
const colors = require( 'tailwindcss/colors' )

module.exports = {
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
            fontSize: {
                clamp1: 'clamp(1rem, 2.3vw, 1.2rem)',
                clamp2: 'clamp(0.88rem, 2.3vw, 1rem)',
                clamp3: 'clamp(1.4rem, 4vw, 2.2rem)',
                clamp4: 'clamp(1rem, 2.5vw, 1.5rem)',
                clamp5: 'clamp(1.2rem, 3.5vw, 1.5rem)',
                clamp6: 'clamp(1rem, 2.3vw, 1.15rem)',
                clamp7: 'clamp(1.13rem, 2.3vw, 1.25rem)'
            },
            dropShadow: {
                '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
                '4xl': [
                    '0 35px 35px rgba(0, 0, 0, 0.25)',
                    '0 45px 65px rgba(0, 0, 0, 0.15)'
                ],
                'linkTxt': '0 2.9px 1.2px rgba(0,0,0,0.8)',
                'light': '0 1.2px 1.2px rgba(0,0,0,0.8)',
                'lighter': '0 0.5px 0.2px rgba(0,0,0,0.8)'
            },
            boxShadow: {
                'btnpink': '0px 15px 20px rgba(255, 206, 201, 0.4)',
                'btngreen': '0px 15px 20px rgba(217, 255, 197, 0.4)',
            }
        },
        fontFamily: {
            txt: [ 'Ysabeau Office', 'sans-serif' ]
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.neutral,
            stone: colors.stone,
            indigo: colors.indigo,
            violet: colors.violet,
            pink: colors.pink,
            red: colors.rose,
            yellow: colors.amber,
            green: colors.lime,
            appblck: '#00070A',
            appred: '#FD2D01',
            apppink: '#FFC5D9',
            apppinklight: '#F0D7DB',
            apppastgreen: '#C9FFDD',
            appturq: '#2ECEC2',
            appmauvelight: '#E0D7F0',
            appstone: '#4E5166',
            appsand: '#fdfdf9',
            appmagenta: '#B001A2',
            appopred: '#01D1FD',
            appoppink: '#D7FFFF',
            appopstone: '#66634E',
        }
    },
    plugins: [],
}
