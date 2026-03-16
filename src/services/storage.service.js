const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint:
    process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/Aman8141/",
});

module.exports = {
  uploadFile: async (base64Data, filename) => {
    try {
      const response = await imagekit.upload({
        file: base64Data, // base64 string
        fileName: filename,
      });
      return { url: response.url };
    } catch (err) {
      console.error("ImageKit upload error:", err);
      return { url: null };
    }
  },
};
