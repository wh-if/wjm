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

export function checkFileShard(data: {
  fileKey: string;
  shardTotalCount: number;
  fileSuffix: string;
}) {
  return request({
    url: "/file/shard/check",
    method: "post",
    data
  });
}

export function uploadFileShard(formData: FormData) {
  return request({
    url: "/file/shard/upload",
    method: "post",
    data: formData
  });
}
export function mergeFileShard(data: {
  fileKey: string;
  shardTotalCount: number;
  fileSuffix: string;
}) {
  return request({
    url: "/file/shard/merge",
    method: "post",
    data
  });
}
