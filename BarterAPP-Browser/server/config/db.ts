const config = {
  url : process.env.MONGODB_URI || 'mongodb://localhost:27017/test' 
};
//Especificacion de la base de datos
//Este el fichero que es necesario cambiar para pasar
//de BD local a un servidor real en la web
export default config;
