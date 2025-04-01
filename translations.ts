export const translations = {
  en: {
    orderNow: "Order Now",
    customize: "Customize",
    addToOrder: "Add to Order",
    total: "Total",
    quantity: "Quantity",
    spiceLevel: "Spice Level",
    ingredients: "Ingredients",
    allergens: "Allergens",
    orderSummary: "Order Summary",
    confirmOrder: "Confirm Order",
    cancelOrder: "Cancel Order",
    tryAgain: "Try Again",
    errorMessage: "Something went wrong",
    askAboutMenu: "Ask about our menu..."
  },
  es: {
    orderNow: "Ordenar",
    customize: "Personalizar",
    addToOrder: "Agregar",
    total: "Total",
    quantity: "Cantidad",
    spiceLevel: "Picante",
    ingredients: "Ingredientes",
    allergens: "Alérgenos",
    orderSummary: "Resumen",
    confirmOrder: "Confirmar",
    cancelOrder: "Cancelar",
    tryAgain: "Reintentar",
    errorMessage: "Error",
    askAboutMenu: "Pregunta sobre el menú..."
  },
  zh: {
    orderNow: "立即订购",
    customize: "定制",
    addToOrder: "添加",
    total: "总计",
    quantity: "数量",
    spiceLevel: "辣度",
    ingredients: "配料",
    allergens: "过敏原",
    orderSummary: "订单",
    confirmOrder: "确认",
    cancelOrder: "取消",
    tryAgain: "重试",
    errorMessage: "错误",
    askAboutMenu: "询问菜单..."
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export const getTranslation = (language: Language, key: TranslationKey): string => 
  translations[language][key];