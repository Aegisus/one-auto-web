export const createEventSource = (
  onMessage: (data: any) => void,
  onError: (error: any) => void
) => {
  const url = "http://127.0.0.1:5000/comport";
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      onMessage(parsedData);
    } catch (error) {
      onError(error);
    }
  };

  eventSource.onerror = (error) => {
    onError(error);
    eventSource.close();
  };

  return eventSource;
};
