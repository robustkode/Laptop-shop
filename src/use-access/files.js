import { assertModerator } from "@/lib/authorization";
import { getPresignedPostUrl } from "@/lib/file";
import { randomUUID } from "crypto";

export async function getImageUploadURLUseCase({ dir, contentType }) {
  await assertModerator();
  const imageId = randomUUID();
  const fileName = dir + "/" + imageId;
  return getPresignedPostUrl(fileName, contentType);
}
