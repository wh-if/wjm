import BaseMapper from "./BaseMapper";
export interface Folder {
  id?: number;
  name?: string;
  userId?: number;
}
class FolderMapper extends BaseMapper<Folder> {
  constructor() {
    super("folder");
  }
}

export const folderMapper = new FolderMapper();
