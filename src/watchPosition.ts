export default (successCallback: PositionCallback, errorCallback: PositionErrorCallback): number | null => {
  let lastPosition: Position | null = null;

  if ("geolocation" in navigator) {
    return navigator.geolocation.watchPosition((position) => {
      lastPosition = position;
      successCallback(position);
    }, (error) => {
      if (error.code !== error.POSITION_UNAVAILABLE && lastPosition === null) {
        errorCallback(error);
      }
    });
  }

  return null;
};
