import jwt from 'jsonwebtoken';

const JWTGen = data => jwt.sign({ id: data.id, name: data.username }, process.env.JWT_SECRET, {expiresIn: '1d'})


const idGen = () => Math.random().toString(36).substring(2)+Date.now().toString(36);


export {idGen, JWTGen}