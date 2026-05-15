import pool from "../../../config/db.js";

export const verifyCertificate =
async (token) => {

  const [rows] =
    await pool.query(

      `
      SELECT
        ec.*,
        u.name

      FROM employee_certificates ec

      JOIN users u
      ON ec.employee_id = u.id

      WHERE verification_token = ?
      `,

      [token]
    );

  if (!rows.length) {

    return {
      valid: false
    };

  }

  return {

    valid: true,

    certificate: rows[0]

  };

};