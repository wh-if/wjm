import { request } from ".";

export function uploadFile(formData: FormData) {
  return request({
    url: "/file/upload",
    method: "post",
    data: formData
  });
}

export function getFile(fileKey: string, mimetype: string) {
  return request({
    url: "/file/target/" + fileKey,
    method: "get",
    responseType: "blob",
    headers: {
      Accept: mimetype
    }
  });
}
