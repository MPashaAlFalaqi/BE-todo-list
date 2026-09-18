import pool from '../config/db.js';

export const TodoModel = {
    getByUserId: async (userId: number) => {
        const [rows] = await pool.query('SELECT * FROM todos WHERE user_id = ?', [userId]);
        return rows;
    },
    getById: async (id: number, userId: number) => {
        const [rows]: any = await pool.query(
            'SELECT * FROM todos WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0]; // kembalikan 1 data, atau undefined jika tidak ditemukan
    },

    create: async (userId: number, task: string) => {
        const [result]: any = await pool.query(
            'INSERT INTO todos (user_id, task) VALUES (?, ?)',
            [userId, task]
        );
        return result.insertId;
    },

    // Update task dan/atau status is_completed (dynamic — hanya field yang dikirim yang diupdate)
    update: async (id: number, userId: number, task?: string, isCompleted?: boolean) => {
        const fields: string[] = [];
        const values: any[] = [];

        if (task !== undefined) {
            fields.push('task = ?');
            values.push(task);
        }
        if (isCompleted !== undefined) {
            fields.push('is_completed = ?');
            values.push(isCompleted);
        }

        if (fields.length === 0) return 0; // tidak ada field yang dikirim untuk diupdate

        values.push(id, userId);

        const [result]: any = await pool.query(
            `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );
        return result.affectedRows;
    },

    // Hapus todo berdasarkan id dan userId
    delete: async (id: number, userId: number) => {
        const [result]: any = await pool.query(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows;
    }
};