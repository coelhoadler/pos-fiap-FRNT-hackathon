// tailwind.config.js
module.exports = {
  content: [
    "./web/mindease/src/**/*.{js,ts,jsx,tsx}", // todos os arquivos do front-end
    "./web/mindease/public/index.html",        // se você usa HTML direto
  ],
  theme: {
    extend: {
      colors: {
        'custom-black': '#000000',
        'custom-slate': '#4A6572',  //Textos principais
        'custom-mist': '#A3BACF',   //Cor de destaque
        'custom-fog': '#E0EADD',    //Sucesso confirmação
        'custom-sand': '#F5EFE6',   //Fundo Principal
        'custom-cream': '#F9F7F2',  //Superficies
      },
    },
  },
  plugins: [],
};