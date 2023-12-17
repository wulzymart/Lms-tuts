import { Storage } from "megajs";

export const storage = new Storage({
  email: "wulzymart@gmail.com",
  password: "iamme123",
  userAgent: "lms_tuts/1.0",
});

const getImageFolder = async () => {
  await storage.ready;
  let folder = storage.root.children?.find((file) => file.name === "images");
  if (folder) return folder;
  folder = await storage.mkdir("images");
  return folder;
};
const getVideoFolder = async () => {
  await storage.ready;
  let folder = storage.root.children?.find((file) => file.name === "videos");
  if (folder) return folder;
  folder = await storage.mkdir("videos");
  return folder;
};

export const imagesFolder = getImageFolder();
export const videosFolder = getVideoFolder();
