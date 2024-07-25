/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            colors: {
                "login-bg-color": "#383838",
                "camera-color": "#342D2D",
                "screen-color": "#E8E8E8",
                "status-success": "#57C769",
                "status-error": "#EF5656",
                secondary: "#134B70",
                primary: "#201E43",
                tertiary: "#508C9B",
                stroke: "9f9d9d",
                "sidebar-hover-color": "#104C83",
                "upload-text-color" : "#078DEF",
            },
            backgroundImage: {
                "app-gradient": "linear-gradient(to bottom, #201E43, #130E75)",
                "overview-gradient":
                    "linear-gradient(to bottom, #201E43, #130E75)",
                "radial-gradient-gray":
                    "radial-gradient(circle, #353131, #191717)",
            },
            fontFamily: {
                "nunito-sans": ["Nunito Sans", "sans-serif"],
            },
            boxShadow: {
                custom: "0 2px 10px rgba(0, 0, 0, 0.1)",
            },
        },
    },
    plugins: [],
};
