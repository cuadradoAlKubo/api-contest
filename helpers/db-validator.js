const collectionAvailable = async (collection = '', collections = []) => {
  const incluida = collections.includes(collection);
  if (!incluida) {
      throw new Error(`La colección ${collection} no esta permitida - ${collections} `);
  }
  return true
}

module.exports = {
  collectionAvailable
}