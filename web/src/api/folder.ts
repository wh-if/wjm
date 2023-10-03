import { request } from ".";
export interface Folder {
  id?: number;
  name?: string;
  userId?: number;
}

export function getFolderList() {
  return request({
    url: "/folder",
    method: "get"
  });
}
export function addFolder(name: string) {
  return request({
    url: "/folder",
    method: "post",
    data: {
      name
    }
  });
}
export function updateFolderName(folderId: number, name: string) {
  return request({
    url: "/folder/" + folderId,
    method: "put",
    data: {
      name
    }
  });
}
export function removeFolder(folderIds: number[]) {
  return request({
    url: "/folder",
    method: "delete",
    params: {
      ids: JSON.stringify(folderIds)
    }
  });
}
