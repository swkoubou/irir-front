export const imagesLoader = async (basePath, count) => {
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  };

  const images = [];
  for (let i = 1; i <= count; i++) {
    const src = `/images/${basePath}${i}.svg`;
    const img = await loadImage(src);
    images.push(img);
  }
  return images;
};
