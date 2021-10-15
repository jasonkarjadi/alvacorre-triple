module.exports = {
  locales: ["en", "jp", "id"],
  defaultLocale: "en",
  pages: {
    "*": ["navbar"],
    "/": ["home"],
    "/preface": ["preface", "prefaceFill"],
    "/globe": ["globe", "globeFill"],
    "/creator": ["creator", "creatorFill"],
  },
};
