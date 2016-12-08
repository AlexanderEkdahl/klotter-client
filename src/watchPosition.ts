const enum GeolocationStatus {
  Initializing,
  Watching,
  TemporarilyUnavailable,
  Unavailable,
  Failed,
}

export default function watchPosition(successCallback: PositionCallback, errorCallback: PositionErrorCallback): number {
  let lastPosition: Position | null = null;

  return navigator.geolocation.watchPosition((position) => {
    lastPosition = position;
    successCallback(position);
  }, (error) => {
    if (error.code !== error.POSITION_UNAVAILABLE && lastPosition === null) {
      errorCallback(error);
    }
  });
}