

export async function uploadFileToCloudinaryClientUsage(
  file: File,
  folder: string,
) {
  const body = new FormData();
  body.append("file", file);
  body.append(
    "upload_preset",
    "iptn-test",
  );
  body.append("asset_folder", folder);
  body.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

  const ret = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
    {
      method: "POST",
      body: body,
    },
  );

  const response = await ret.json();
  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.secure_url;
}
