import { getProfileRepo, updateProfileRepo } from "../../repository/organization/org.repository.js";

export const getProfileService = async (orgUserId) => {
  return await getProfileRepo(orgUserId);
};

export const updateProfileService = async (orgUserId, data) => {
  await updateProfileRepo(orgUserId, data);
};