import bcrypt from "bcrypt";

const hash = await bcrypt.hash("adminpassword", 10);
console.log(hash);
