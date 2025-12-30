"use server";
import userModel from "base/models/User";
import { cookies } from "next/headers";
import connectToDB from "base/configs/db";
import { verifyToken } from "./auth";

export const authUser = async () => {
  await connectToDB();
  const token = cookies().get("token")?.value;
  if (token) {
    const tokenPayLoad = verifyToken(token);
    if (tokenPayLoad) {
      return JSON.parse(
        JSON.stringify(await userModel.findOne({ phone: tokenPayLoad.phone }))
      );
    } else {
      return false;
    }
  } else {
    return false;
  }
};
