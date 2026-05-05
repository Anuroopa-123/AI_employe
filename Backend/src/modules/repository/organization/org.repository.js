import pool from "../../../config/db.js";

export const getProfileRepo = async (orgUserId) => {
  const [rows] = await pool.query(`
    SELECT 
      u.name,
      u.email,
      ou.id as org_user_id,
      ou.employee_code,
      ou.phone,
      ou.department,
      ou.designation,
      ou.skills,
      ou.bio,
      ou.profile_pic
    FROM users u
    JOIN organization_users ou ON u.id = ou.user_id
    WHERE ou.id = ?
  `, [orgUserId]);

  return rows[0];
};

export const updateProfileRepo = async (orgUserId, data) => {
  const { phone, department, designation, skills, bio } = data;

  await pool.query(`
    UPDATE organization_users
    SET phone = ?, department = ?, designation = ?, skills = ?, bio = ?
    WHERE id = ?
  `, [phone, department, designation, skills, bio, orgUserId]);
};