/** @type {import('tailwindcss').Config} */
const colors = require( 'tailwindcss/colors' )

module.exports = {
    content: [
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './public/**/*.{js,ts,jsx,tsx,mdx}'
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
                clamp7: 'clamp(1.13rem, 2.3vw, 1.25rem)',
                clamp8: 'clamp(1.35rem, 4vw, 2rem)',
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
                'btnindigo': '0px 15px 20px rgba(67, 56, 202, 0.4)',
                'btnpastgreen': '0px 15px 20px rgba(201, 255, 221, 0.4)',
                'btnblue': '0px 15px 20px rgba(1, 209, 253, 0.4)',
                'btnorange': '0px 15px 20px rgba(252, 211, 77, 0.4)',
                'btnstone': '0px 15px 20px rgba(78, 81, 102, 0.4)',
                'neatcard': 'rgba(0, 0, 0, 0.35) 0px 5px 15px;',
                'elevated': 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;',
                'sidepinkaccordeon': 'rgba(240, 46, 170, 0.4) 5px 5px, rgba(240, 46, 170, 0.3) 10px 10px, rgba(240, 46, 170, 0.2) 15px 15px, rgba(240, 46, 170, 0.1) 20px 20px, rgba(240, 46, 170, 0.05) 25px 25px;',
                'coloredpaperstack': 'blue 0px 0px 0px 2px inset, rgb(255, 255, 255) 10px -10px 0px -3px, rgb(31, 193, 27) 10px -10px, rgb(255, 255, 255) 20px -20px 0px -3px, rgb(255, 217, 19) 20px -20px, rgb(255, 255, 255) 30px -30px 0px -3px, rgb(255, 156, 85) 30px -30px, rgb(255, 255, 255) 40px -40px 0px -3px, rgb(255, 85, 85) 40px -40px;',
                'clothesbtn': 'rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;',
            },
            objectPosition: {
                'center-up': '50% 35%',
                'center-down': '50% 75%',
            },
        },
        // fontFamily: {
        //     txt: [ 'Ysabeau Office', 'sans-serif' ]
        // },
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
