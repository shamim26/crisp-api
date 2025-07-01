const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, "-");
};

export default generateSlug;
