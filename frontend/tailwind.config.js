/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

module.exports = {
	future: {
		hoverOnlyWhenSupported: true,
	},
	content: [
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./public/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			fontSize: {
				clamp1: "clamp(1.6rem, 2.3vw, 1.82rem)",
				clamp2: "clamp(1.408rem, 2.3vw, 1.6rem)",
				clamp3: "clamp(2.24rem, 2.5vw, 2.52rem)",
				clamp4: "clamp(1.6rem, 2.5vw, 2rem)",
				clamp5: "clamp(1.92rem, 2.3vw, 2.1rem)",
				clamp6: "clamp(1.5rem, 2.3vw, 1.74rem)",
				clamp7: "clamp(1.808rem, 2.3vw, 2rem)",
				clamp8: "clamp(2.16rem, 2.3vw, 2.36rem)",
				clamp9: "clamp(2.72rem, 2.5vw, 3rem)",
			},
			dropShadow: {
				"3xl": "0 35px 35px rgba(0, 0, 0, 0.25)",
				"4xl": [
					"0 35px 35px rgba(0, 0, 0, 0.25)",
					"0 45px 65px rgba(0, 0, 0, 0.15)",
				],
				linkTxt: "0 2.9px 1.2px rgba(0,0,0,0.8)",
				light: "0 1.2px 1.2px rgba(0,0,0,0.8)",
				lighter: "0 0.5px 0.2px rgba(0,0,0,0.8)",
			},
			boxShadow: {
				btnpink: "0px 15px 20px rgba(255, 206, 201, 0.4)",
				btngreen: "0px 15px 20px rgba(217, 255, 197, 0.4)",
				btnindigo: "0px 15px 20px rgba(67, 56, 202, 0.4)",
				btnpastgreen: "0px 15px 20px rgba(201, 255, 221, 0.4)",
				btnblue: "0px 15px 20px rgba(1, 209, 253, 0.4)",
				btnorange: "0px 15px 20px rgba(252, 211, 77, 0.4)",
				btnstone: "0px 15px 20px rgba(78, 81, 102, 0.4)",
				btndred: "0px 15px 20px rgba(190, 18, 60, 0.4)",
				btnlred: "0px 15px 20px rgba(254, 108, 77, 0.4)",
				neatcard: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
				elevated:
					"rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
				sidepinkaccordeon:
					"rgba(240, 46, 170, 0.4) 5px 5px, rgba(240, 46, 170, 0.3) 10px 10px, rgba(240, 46, 170, 0.2) 15px 15px, rgba(240, 46, 170, 0.1) 20px 20px, rgba(240, 46, 170, 0.05) 25px 25px",
				coloredpaperstack:
					"blue 0px 0px 0px 2px inset, rgb(255, 255, 255) 10px -10px 0px -3px, rgb(31, 193, 27) 10px -10px, rgb(255, 255, 255) 20px -20px 0px -3px, rgb(255, 217, 19) 20px -20px, rgb(255, 255, 255) 30px -30px 0px -3px, rgb(255, 156, 85) 30px -30px, rgb(255, 255, 255) 40px -40px 0px -3px, rgb(255, 85, 85) 40px -40px",
				clothesbtn:
					"rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
				inputboxtext:
					"rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
				inputboxtexthov: "0 0 5pt 2pt #D3D3D3",
				inputboxtextfoc: "rgb(38, 57, 77) 0px 20px 30px -10px",
				card: "rgb(38, 57, 77) 0px 20px 30px -10px",
				sunkiced:
					"rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
				strip: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
				bottomline: "0 5px 8px rgba(0,0,0,0.35)",
				bottomlinelight: "0 5px 8px rgba(0,0,0,0.25)",
				topline: "0 -8px 8px -3px rgba(0,0,0,0.35)",
				toplinelight: "0 -8px 8px -3px rgba(0,0,0,0.25)",
				lightinner: "0px 8px 15px rgba(0,0,0,0.35) inset",
			},
			objectPosition: {
				"center-up": "50% 35%",
				"center-down": "50% 75%",
			},
			keyframes: {
				spin: {
					from: { transform: "rotate( 0deg )" },
					to: { transform: "rotate( 360deg )" },
				},
				scale: {
					from: { transform: "scaleY( 0 )" },
					to: { transform: "scaleY( 1 )" },
				},
				fill: {
					"0%": { opacity: 0 },
					"20%": {
						opacity: 0.2,
						transform: "scale(0.3)",
					},
					"40%": {
						opacity: 0.55,
						transform: "scale(0.5)",
					},
					"60%": {
						opacity: 0.85,
						transform: "scale(0.75)",
					},
					"80%": {
						transform: "scale(1.2)",
					},
					"100%": {
						transform: "scale(1)",
					},
				},
				zoom: {
					from: { transform: "scale( 1 )" },
					to: { transform: "scale( 2.5 )" },
				},
				rotatezoom: {
					"0%": {
						animationTimingFunction: "ease-in",
						transform: "rotate(0deg) scale(0.3)",
					},
					"25%": {
						animationTimingFunction: "ease-out",
						transform: "rotate(-180deg) scale(0.6)",
					},
					"50%, 100%": {
						transform: "rotate(-360deg) scale( 1 )",
					},
				},
				pressdown: {
					"0%": {
						transform: "scale(.90)",
						backgroundColor: "#C9FFDD",
					},
					"40%": {
						transform: "scale(1.05)",
					},
					"100%": {
						transform: "scale(1)",
						// backgroundColor: '#7953be'
					},
				},
				pressed: {
					"0%": {
						transform: "scale(0.8)",
					},
					"40%": {
						transform: "scale(1.05)",
					},
					"100%": {
						transform: "scale(1)",
					},
				},
				clicked: {
					"0%": {
						transform: "scale(0.95)",
					},
					"40%, 100%": {
						transform: "scale(1)",
					},
				},
				wiggle: {
					"0%, 100%": { transform: "rotate(-3deg)" },
					"50%": { transform: "rotate(3deg)" },
				},
				bgsize: {
					"0%": { "background-size": "0% 0%" },
					"50%": {
						"background-size": "200% 200%",
						color: "white",
					},
					"100%": { "background-size": "0% 0%" },
				},
				reverseping: {
					"0%": { opacity: 1 },
					"50%, 75%": {
						transform: "scale(1.2)",
						opacity: 0.2,
					},
					"100%": {
						transform: "scale(1)",
						opacity: 1,
					},
				},
				btnflat: {
					"0%": { transform: "scaleY(1)" },
					"60%": { transform: "scaleY(0)" },
					"100%": { transform: "scaleY(1)" },
				},
				reposition: {
					"0%": {
						transform: "translateY(40px)",
						opacity: 0,
					},
					"50%": {
						opacity: 0.2,
					},
					"100%": {
						transform: "translateY(0px)",
						opacity: 1,
					},
				},
				ping2: {
					"75%, 100%": {
						transform: "scale(1.5)",
						opacity: 0,
					},
				},
				resizezoom: {
					from: { transform: "scale(0.6)", opacity: 0.2 },
					to: { transform: "scale(1)", opacity: 1 },
				},
				resizebtn: {
					"10%": { transform: "scale(0.5)", opacity: 0.5 },
					"60%": { transform: "scale(1.2)", opacity: 0.8 },
					"100%": { transform: "scale(1)", opacity: 1 },
				},
				slideleft: {
					"30%": { transform: "translateX(0px)", opacity: 0.5 },
					"100%": { transform: "translateX(-5px)", opacity: 1 },
				},
				slideright: {
					"30%": { transform: "translateX(0px)", opacity: 0.5 },
					"100%": { transform: "translateX(5px)", opacity: 1 },
				},
				pop: {
					to: { backdropFilter: "blur(4px)" },
				},
			},
			animation: {
				spin: "spin infinite 1.3s linear",
				scale: "scale .4s ease-out forwards",
				fill: "fill ease-in-out .4s forwards",
				zoom: "zoom ease-out .2s forwards",
				rotateZoom: "rotatezoom 2s linear",
				pressDown: "pressdown .4s ease-in",
				clicked: "clicked .4s ease-out",
				wiggle: "wiggle 200ms ease-in-out",
				reversePing: "reverseping .3s ease-out forwards",
				btnFlat: "btnflat .6s ease-in-out both",
				bgSize: "bgsize .6s ease-in-out both",
				reposition: "reposition .6s forwards .2s",
				ping2: "ping2 1s cubic-bezier(0, 0, 0.2, 1) backwards",
				resizeZoom: "resizezoom .3s ease-in both",
				resizeBtn: "resizebtn .4s ease-out",
				slideLeft: "slideleft .4s ease-out",
				slideRight: "slideright .4s ease-out",
				pressed: "pressed .4s ease-in-out",
				pop: "pop 1s forwards",
			},
			screens: {
				small: {
					raw: "((min-width: 450px) and (max-width: 639px) and (max-height: 720px))",
				},
				smallLandscape: {
					raw: "((min-width: 700px) and (max-width: 800px) and (max-height: 600px))",
				},
				mob90: {
					raw: "((max-width: 290px))",
				},
				mob00: {
					raw: "((max-width: 300px))",
				},
				mob20: {
					raw: "((max-width: 320px))",
				},
				mob48: {
					raw: "((max-width: 348px))",
				},
				mob88: {
					raw: "((max-width: 388px))",
				},
			},
		},
		colors: {
			transparent: "transparent",
			current: "currentColor",
			black: colors.black,
			white: colors.white,
			gray: colors.neutral,
			stone: colors.stone,
			cyan: colors.cyan,
			sky: colors.sky,
			blue: colors.blue,
			indigo: colors.indigo,
			violet: colors.violet,
			fuchsia: colors.fuchsia,
			pink: colors.pink,
			red: colors.rose,
			yellow: colors.amber,
			green: colors.lime,
			teal: colors.teal,
			emerald: colors.emerald,
			appblck: "#121212",
			appred: "#FD2D01",
			apppink: "#FFC4D8",
			apppinklight: "#F0D7DB",
			apppinklighter: "#ffecf2",
			apppastgreen: "#C9FFDD",
			appturq: "#2ECEC2",
			appmauvelight: "#E0D7F0",
			appmauvelighter: "#f4f1fa",
			appmauvedark: "#7953be",
			appgreenlight: "#65A30D",
			appstone: "#4E5166",
			appsand: "#fdfdf9",
			appmagenta: "#B001A2",
			appopred: "#02d2fe",
			appoppink: "#003b27",
			appopstone: "#b1ae99",
			appmauvedarker: "#3f2869",
			applightdark: "#424242",
		},
	},
	plugins: [
		plugin(({ matchUtilities, theme }) => {
			matchUtilities(
				{
					"animation-delay": (value) => {
						return {
							"animation-delay": value,
						};
					},
				},
				{
					values: theme("transitionDelay"),
				}
			);
		}),
	],
};
