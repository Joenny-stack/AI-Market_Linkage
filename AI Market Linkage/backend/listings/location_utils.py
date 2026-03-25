"""Location normalization and coordinate mapping helpers for listings."""

from __future__ import annotations

from typing import Optional, Tuple

LOCATION_TO_COORDS = {
    "gweru": (-19.45, 29.81),
    "harare": (-17.83, 31.05),
    "bulawayo": (-20.15, 28.58),
    "mutare": (-18.97, 32.67),
    "masvingo": (-20.07, 30.83),
    "kadoma": (-18.33, 29.92),
    # Province-level mappings to nearest major city
    "midlands": (-19.45, 29.81),
    "manicaland": (-18.97, 32.67),
    "mashonaland west": (-18.33, 29.92),
    "mashonaland east": (-17.83, 31.05),
    "mashonaland central": (-17.83, 31.05),
    "matabeleland north": (-20.15, 28.58),
    "matabeleland south": (-20.15, 28.58),
}


def map_location_to_coordinates(location: str) -> Optional[Tuple[float, float]]:
    """Return (latitude, longitude) for a known location string, else None."""
    key = str(location or "").strip().lower()
    if not key:
        return None
    return LOCATION_TO_COORDS.get(key)
