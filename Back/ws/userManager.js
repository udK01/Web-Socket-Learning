const sessionUsers = new Map();
import User from "../models/user.js";

export async function getUserBySession(sessionID) {
  if (sessionUsers.has(sessionID)) {
    return sessionUsers.get(sessionID);
  }

  const newUser = await addNewUser();
  sessionUsers.set(sessionID, newUser);
  return newUser;
}

export async function addNewUser() {
  const newUser = new User();
  return await newUser.save();
}
