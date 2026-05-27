import pool from "../../../config/db.js";

export const getEmployeeCertificatesService =
async (employeeId) => {

  const [rows] = await pool.query(

    `
    SELECT *

    FROM employee_certificates

    WHERE employee_id = ?

    ORDER BY issue_date DESC
    `,

    [employeeId]

  );

  return rows;

};