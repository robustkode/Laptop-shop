import { getTags } from "@/data-access/tags";
import { PublicError } from "@/lib/errors";

export const GET = async () => {
  try {
    const tags = await getTags();
    return new Response(JSON.stringify(tags));
  } catch (error) {
    const isAllowedError = error instanceof PublicError;
    console.log("tags-api-error", error);
    return new Response(
      JSON.stringify({
        error: {
          message: isAllowedError
            ? error.message
            : "Server error, Something went wrong!",
        },
      }),
      { status: 500 }
    );
  }
};
