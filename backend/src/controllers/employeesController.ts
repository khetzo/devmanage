import { Request, Response } from 'express';
import pool from '../config/database';


export const getEmployees = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
      SELECT * FROM employees ORDER BY created_at DESC
    `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};

export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM employees WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const {
            full_name,
            email,
            role_title,
            status,
            work_mode,
            years_experience,
            completed_this_month,
            on_hold_this_month,
            check_ins
        } = req.body;

        const result = await pool.query(
            `INSERT INTO employees 
       (full_name, email, role_title, status, work_mode, years_experience, completed_this_month, on_hold_this_month, check_ins)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
            [
                full_name,
                email,
                role_title,
                status || 'On Duty',
                work_mode || 'Remote',
                years_experience || 0,
                completed_this_month || 0,
                on_hold_this_month || 0,
                JSON.stringify(check_ins || [])
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        if (error.code === '23505') { // Unique violation
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create employee' });
        }
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const setClause = Object.keys(updates)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');

        const values = Object.values(updates);
        values.push(id);

        const result = await pool.query(
            `UPDATE employees SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${values.length} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update employee' });
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM employees WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
};