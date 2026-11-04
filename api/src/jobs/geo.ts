/** Approximate city centroids (India) for nearby/radius search when jobs lack lat/lng. */
const CITY_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  palani: { lat: 10.4503, lng: 77.5202 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  salem: { lat: 11.6643, lng: 78.146 },
  trichy: { lat: 10.7905, lng: 78.7047 },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047 },
  erode: { lat: 11.341, lng: 77.7172 },
  dindigul: { lat: 10.3673, lng: 77.9803 },
  theni: { lat: 10.0104, lng: 77.4768 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  delhi: { lat: 28.6139, lng: 77.209 },
  'new delhi': { lat: 28.6139, lng: 77.209 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
};

export function cityCentroid(
  city?: string | null,
): { lat: number; lng: number } | null {
  if (!city?.trim()) return null;
  return CITY_CENTROIDS[city.trim().toLowerCase()] ?? null;
}

export function resolveCoords(input: {
  lat?: number | null;
  lng?: number | null;
  city?: string | null;
}): { lat: number; lng: number } | null {
  if (
    input.lat != null &&
    input.lng != null &&
    Number.isFinite(input.lat) &&
    Number.isFinite(input.lng)
  ) {
    return { lat: input.lat, lng: input.lng };
  }
  return cityCentroid(input.city);
}

/** Great-circle distance in km (Haversine). */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
