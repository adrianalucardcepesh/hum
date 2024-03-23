const db = require('./database/db-pool.js');

const insertProfileData = async (ctx, { telegramId, fileId, filePath, ...data }) => {

    try {
        const conn = await db.getConnection();
        let fileType;

        if (ctx.message.photo) {
            fileType = 'photo';
        } else if (ctx.message.video) {
            fileType = 'video';
        }

        // Проверяем, есть ли уже анкета для этого пользователя
        async function checkIfUserExists(telegramId) {

            let userExists = false;

            const conn = await db.getConnection();

            const sql = 'SELECT * FROM users WHERE telegram_id = ?';

            const [user] = await conn.query(sql, [telegramId]);

            if (user) {
                userExists = true;
            }

            return userExists;

        }

        const userExists = await checkIfUserExists(ctx.from.id)

        if (userExists) {
            ctx.reply('Вы уже заполняли анкету! Анкету можно заполнить только один раз!1️⃣')
            return
        }


        // Вставляем данные анкеты в таблицу users, включая поле username
        const sql = `
            INSERT INTO users
            (telegram_id, username, name, surname, city, age, role, info, search, goal, fileId, filePath, fileType)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;


            await conn.query(sql, [
            ctx.from.id,
            ctx.from.username,
            data.name,
            data.surname,
            data.city,
            data.age,
            data.role,
            data.info,
            data.search,
            data.goal,
            fileId,
            filePath,
            fileType,
        ]);

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            ctx.reply('Вы уже заполняли анкету. Анкету можно заполнить только один раз!');
            return;
        }

        console.error('Ошибка вставки данных: ', error);
        ctx.reply('Произошла ошибка при сохранении данных');
    }
};

module.exports = {
    insertProfileData
}