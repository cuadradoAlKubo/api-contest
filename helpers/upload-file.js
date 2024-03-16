const path = require('path');
const { v4: uuidv4 } = require('uuid');

const extensiones = ['png','jpg','jpeg','gif','PNG'] 

const uploadFile = ( files, extensionesValidas = extensiones , carpeta = '' ) => {

    return new Promise( (resolve, reject) => {

    const {file} = files;
    const shortName = file.name.split('.');
    const extension = shortName[shortName.length - 1];
    const extensionPermitida = extensionesValidas.includes(extension)
    if ( !extensionPermitida ) {
        return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
    }
      
      const tempName = uuidv4() + '.' + extension;
       const uploadPath = path.join(__dirname , '../uploads/', carpeta , tempName);
      
        // Use the mv() method to place the file somewhere on your server
        file.mv(uploadPath, (err)=> {
          if (err)
              reject(err)
              });
      
           resolve(tempName)
        });
    
      

}

module.exports = {
    uploadFile
}