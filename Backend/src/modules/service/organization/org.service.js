import { getProfileRepo, updateProfileRepo } from "../../repository/organization/org.repository.js";

export const getProfileService = async (orgUserId) => {
  return await getProfileRepo(orgUserId);
};

export const updateProfileService = async (orgUserId, data, profilePicPath = null) => {
  await updateProfileRepo(orgUserId, data, profilePicPath);   // ← Pass the path
}