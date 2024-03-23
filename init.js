const { Telegraf, Markup, Scenes, session } = require('telegraf');
const bot = require('./config/config');
const { startCommand } = require('./keyboard');
const { createScenes } = require('./scenes');
// const userDelete = require('./delete')
// const dateUsers = require('./users')
// const sendProfile = require('./users')



bot.use(session());
bot.hears('Вернуться в главное меню', startCommand);
bot.command('start', startCommand);
bot.use((ctx, next) => {
    if (!ctx.session) {
        ctx.session = {};
    }
    if (!ctx.session.profiles) {
        ctx.session.profiles = []; // Инициализируйте массив анкет здесь
    }
    if (ctx.session.currentUserIndex === undefined) {
        ctx.session.currentUserIndex = 0; // Инициализируйте индекс текущего пользователя
    }
    return next()
});

bot.hears('Вернуться в главное меню', startCommand);
bot.command('start', startCommand);

bot.use(session());

createScenes(bot);


// Обработчик команды /start
bot.start((ctx) => {
    console.log('Обработчик startCommand вызван'); // Добавьте эту строку
    startCommand(ctx); // Вызываем функцию startCommand для отправки клавиатуры
});


bot.action('create', async (ctx) => {

    try {

        // После создания сцен можно войти в нужную
        ctx.scene.enter('name');

    } catch (err) {

        console.error(err);

        await ctx.reply('Произошла ошибка при создании сцен!');

    }

});


bot.action('delete', async (ctx) => {
    try {
        await userDelete.deleteFunction(ctx);
    } catch (err) {
        console.error(err);
        ctx.reply('У вас нету заполненной анкеты.');
    }
});

bot.action('search', async (ctx) => {
    try {
        await dateUsers.dateUsers(ctx);
    } catch (err) {
        console.error(err);
        ctx.reply('Вы просмотрели все доступные анкеты');
    }
});

// В обработчике кнопки 'like'
bot.action('like', async (ctx) => {
        const { profiles, currentProfileIndex } = ctx.session;

    if (profiles && Array.isArray(profiles) && currentProfileIndex < profiles.length) {
            const profile = profiles[currentProfileIndex];

            // Проверяем, есть ли у профиля имя пользователя (username)
            if (profile.username) {
                const telegramUrl = `https://t.me/${profile.username}`;
                ctx.reply(`Приятного общения 😼 ${telegramUrl}`);

            } else if (profile.telegram_id) {
                const firstName = `${profile.name} ${profile.surname}`;

                const formattedName = `[${firstName}](tg://user?id=${profile.telegram_id})`;
                const textPredict = "Приятного общения 😼"; // Замените эту строку на ваш текст
                const messageText = `${formattedName}, ${textPredict}`;

                ctx.replyWithMarkdownV2(messageText);

            } else {
                // Если нет ни имени пользователя, ни telegram_id
                ctx.reply('Информация о контакте пользователя отсутствует.');
            }

            let text = `👻`;

            ctx.reply(text, {
                reply_markup: {
                    keyboard: [
                        [{text: 'Вернуться в главное меню'}],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            });
        }
});

bot.action('next', async (ctx) => {
    ctx.session.currentProfileIndex++;

    // Зацикливание
    if (ctx.session.currentProfileIndex >= ctx.session.profiles.length) {
        ctx.session.currentProfileIndex %= ctx.session.profiles.length;

    }
    await sendProfile.sendProfile(ctx);
});

bot.action('complain', async (ctx) => {
    try {
        // Отправляем сообщение пользователю о возможности подать жалобу
        await ctx.reply('Ваши жалобы на эту анкету будут рассмотрены администрацией чат-бота в ближайшее время 🕵🏼');
    } catch (error) {
        console.error('Ошибка в обработчике complain:', error);
    }
});

bot.action('update', async (ctx) =>  {
    await ctx.reply('В РАЗРАБОТКЕ ‍💻');
});

bot.action('updater', async (ctx) =>  {
    await ctx.reply('В РАЗРАБОТКЕ ‍💻');
});



// bot.launch()


const PORT = process.env.PORT || 3000;

bot.launch({
    webhook: {
        domain: 'https://lgbtdatebot-c2354d487ef9.herokuapp.com',
        port: PORT
    }
}).then(() => {
    console.log(`Bot running on port ${PORT}`);
}).catch(error => {
    console.log('Error launching bot', error);
});
