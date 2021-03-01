export const getFileSize = fileSize => {
  let size = Math.round(fileSize / 1024);

  if (size > 1024) {
    size = Math.round(size / 1024);
  } else {
    return `${size}KB`;
  }
  return `${size}MB`;
};
