export const baseUrl = "http://localhost:5002/api";

interface ErrorResponse {
  error: true;
  status: number;
  message: string;
}

type PostRequestBody = {
  [key: string]: any;
};

export const postRequest = async (url: string, body: PostRequestBody): Promise<any | ErrorResponse> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      let message = data?.message || data || "An error occurred";
      return { error: true, status: response.status, message };
    }

    return data;
  } catch (error) {
    return { error: true, status: 500, message: error || "Internal Server Error" };
  }
};
