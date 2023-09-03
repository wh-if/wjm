import BaseMapper from "./BaseMapper";
export interface User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  status?: string;
  
}
class UserMapper extends BaseMapper<User> {
  constructor() {
    super("user");
  }
}

export const userMapper = new UserMapper();
