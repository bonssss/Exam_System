const db = require('../config/db');

class User {
    static async findById(id) {
        const [user] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        return user[0];
    }

    static async findByEmail(email) {
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return user[0];
    }

    static async create(user) {
        const { name, email, password, role } = user;
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return result.insertId;
    }
}

module.exports = User;