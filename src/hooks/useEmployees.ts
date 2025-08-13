// hooks/useEmployees.ts
import { useState, useEffect } from 'react';
import { generateDummyData } from '../lib/dataService';
import { Employee } from '@/types/entities';

// Configuration (could move to environment variables)
const USE_DUMMY_DATA = process.env.NODE_ENV === 'development';

export const useEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);

                if (USE_DUMMY_DATA) {
                    // Use dummy data in development
                    const { dummyEmployees } = generateDummyData();
                    setEmployees(dummyEmployees);
                } else {
                    // Real API call in production
                    const response = await fetch('/api/employees');
                    const data = await response.json();
                    setEmployees(data);
                }
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const addEmployee = async (employee: Omit<Employee, 'id'>) => {
        if (USE_DUMMY_DATA) {
            // Mock addition for dummy data
            const newEmployee = {
                ...employee,
                id: `e${employees.length + 1}`,
                checkIns: []
            };
            setEmployees([...employees, newEmployee]);
            return newEmployee;
        } else {
            // Real API call
            const response = await fetch('/api/employees', {
                method: 'POST',
                body: JSON.stringify(employee)
            });
            const newEmployee = await response.json();
            setEmployees([...employees, newEmployee]);
            return newEmployee;
        }
    };

    return { employees, addEmployee, loading, error };
};