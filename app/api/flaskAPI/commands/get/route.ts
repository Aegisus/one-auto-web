export const runScript = async (): Promise<string> => {
  try {
    const response = await fetch("http://localhost:5000/run-script", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.output;
  } catch (error) {
    console.error("Error running script:", error);
    throw error;
  }
};
