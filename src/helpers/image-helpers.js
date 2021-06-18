import exifr from "exifr";
export const getImageGPS = async (image) => {
  return await exifr.gps(image);
};
