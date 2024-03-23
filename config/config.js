


// config.js
const { Telegraf } = require('telegraf');

const botToken = '6735084293:AAFR7IyROl0V8B_iZAMREmYM9duAYE5CTa0'; // Замените на свой токен

// const botToken = '6663382739:AAGtlUrUoE5yxEUYxI9bxkCjXv1uEJK0TFg'; // Замените на свой токен





const bot = new Telegraf(botToken);

module.exports = bot;