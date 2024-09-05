import plugin from 'tailwindcss/plugin';

const config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            keyframes: {
                l4: {
                    'to': {transform: 'rotate(1turn)'},
                },
                scroll: {
                    '0%': {transform: 'translateX(100%)'},
                    '100%': {transform: 'translateX(-100%)'},
                },
            },
            animation: {
                l4: 'l4 1s infinite steps(10)',
                scroll: 'scroll 10s linear infinite',
            },
            colors: {
                customPurple: '#9732C2',
                customGreen: '#8ACE01',
            },
        },
    },
    plugins: [
        plugin(function ({addUtilities}) {
            addUtilities({
                '.loader': {
                    width: '50px',
                    '--b': '8px',
                    'aspect-ratio': '1',
                    'border-radius': '50%',
                    margin: '2rem 50% 2rem 50%',
                    background: 'conic-gradient(#0000 10%,#C162EA) content-box',
                    '-webkit-mask': 'repeating-conic-gradient(#0000 0deg,#000 1deg 20deg,#0000 21deg 36deg), radial-gradient(farthest-side,#0000 calc(100% - var(--b) - 1px),#000 calc(100% - var(--b)))',
                    '-webkit-mask-composite': 'destination-in',
                    'mask-composite': 'intersect',
                    animation: 'l4 1s infinite steps(10)',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        width: 'calc(100% - var(--b))',
                        height: 'calc(100% - var(--b))',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                        background: '#fff',
                        borderRadius: '50%',
                    },
                },
                '@keyframes l4': {
                    'to': {transform: 'rotate(1turn)'},
                }
            });
        }),
    ],
};

export default config;