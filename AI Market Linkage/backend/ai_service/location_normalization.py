"""Helpers to normalize runtime location values to model-supported city labels."""

from __future__ import annotations

import difflib
import math
import re

DEFAULT_MARKET_CITY = "Harare"

PROVINCE_TO_CITY = {
    "harare": "Harare",
    "midlands": "Gweru",
    "bulawayo": "Bulawayo",
    "manicaland": "Mutare",
    "masvingo": "Masvingo",
    "mashonaland west": "Kadoma",
    "mashonaland east": "Harare",
    "mashonaland central": "Harare",
    "matabeleland north": "Bulawayo",
    "matabeleland south": "Bulawayo",
}

CITY_ALIASES = {
    "gweru urban": "Gweru",
    "city of gweru": "Gweru",
    "city of harare": "Harare",
    "city of bulawayo": "Bulawayo",
    "chitungwiza": "Harare",
    "epworth": "Harare",
    "ruwa": "Harare",
}

TRAINED_CITY_COORDS = {
    "Harare": (-17.8292, 31.0522),
    "Bulawayo": (-20.1325, 28.6265),
    "Gweru": (-19.4517, 29.8175),
    "Mutare": (-18.9707, 32.6709),
    "Masvingo": (-20.0744, 30.8328),
    "Kadoma": (-18.3333, 29.9167),
}

UNTRAINED_CITY_COORDS = {
    "beitbridge": (-22.2167, 30.0000),
    "bindura": (-17.3019, 31.3306),
    "chegutu": (-18.1302, 30.1407),
    "chimanimani": (-19.8000, 32.8667),
    "chinhoyi": (-17.3667, 30.2000),
    "chipinge": (-20.1883, 32.6236),
    "chiredzi": (-21.0500, 31.6667),
    "gokwe": (-18.2167, 28.9333),
    "goromonzi": (-17.8000, 31.3667),
    "gwanda": (-20.9333, 29.0000),
    "gutu": (-19.6833, 31.1667),
    "hwange": (-18.3667, 26.5000),
    "kariba": (-16.5167, 28.8000),
    "karoi": (-16.8167, 29.6833),
    "kwekwe": (-18.9281, 29.8149),
    "lupane": (-18.9333, 27.8000),
    "marondera": (-18.1853, 31.5519),
    "murehwa": (-17.6500, 31.7833),
    "mupandawana": (-19.6833, 31.1667),
    "mutoko": (-17.3970, 32.2268),
    "norton": (-17.8833, 30.7000),
    "plumtree": (-20.4833, 27.8167),
    "redcliff": (-19.0333, 29.7833),
    "rusape": (-18.5278, 32.1284),
    "shamva": (-17.3167, 31.5667),
    "shurugwi": (-19.6667, 30.0000),
    "victoria falls": (-17.9333, 25.8333),
    "zvishavane": (-20.3267, 30.0665),
}


def _clean_location(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip().lower().replace(" province", ""))


def _location_parts(location: str) -> list[str]:
    cleaned = _clean_location(location)
    parts = [_clean_location(part) for part in re.split(r"[,;/|-]", cleaned)]
    return [part for part in [cleaned, *parts] if part]


def _distance_km(first: tuple[float, float], second: tuple[float, float]) -> float:
    lat1, lon1 = map(math.radians, first)
    lat2, lon2 = map(math.radians, second)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 6371.0 * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _nearest_trained_city(city_key: str, known_locations: list[str]) -> str | None:
    source_coords = UNTRAINED_CITY_COORDS.get(city_key)
    if not source_coords:
        return None

    candidates = [
        city
        for city in known_locations
        if city in TRAINED_CITY_COORDS
    ]
    if not candidates:
        return None

    return min(candidates, key=lambda city: _distance_km(source_coords, TRAINED_CITY_COORDS[city]))


def _default_market_city(known_locations: list[str]) -> str:
    known_by_lower = {v.lower(): v for v in known_locations}
    if DEFAULT_MARKET_CITY.lower() in known_by_lower:
        return known_by_lower[DEFAULT_MARKET_CITY.lower()]
    if known_locations:
        return sorted(known_locations)[0]
    raise ValueError("No trained locations are available for price prediction.")


def normalize_location_for_model(raw_location: str, known_locations: list[str]) -> tuple[str, str]:
    """
    Normalize a user location to one of the model-supported location labels.

    Returns:
        (normalized_location, strategy)
    where strategy is one of: exact, alias, province-map, fuzzy, nearest-city, default-market.
    """
    location = str(raw_location or "").strip()
    if not location:
        return _default_market_city(known_locations), "default-market"

    known_by_lower = {v.lower(): v for v in known_locations}
    location_lower = _clean_location(location)

    if location_lower in known_by_lower:
        return known_by_lower[location_lower], "exact"

    for part in _location_parts(location):
        if part in known_by_lower:
            return known_by_lower[part], "exact"

        if part in CITY_ALIASES:
            aliased = CITY_ALIASES[part]
            if aliased.lower() in known_by_lower:
                return known_by_lower[aliased.lower()], "alias"

        if part in PROVINCE_TO_CITY:
            mapped_city = PROVINCE_TO_CITY[part]
            if mapped_city.lower() in known_by_lower:
                return known_by_lower[mapped_city.lower()], "province-map"

        nearest = _nearest_trained_city(part, known_locations)
        if nearest:
            return nearest, "nearest-city"

    # Last chance: fuzzy match to known labels.
    close = difflib.get_close_matches(location, known_locations, n=1, cutoff=0.6)
    if close:
        return close[0], "fuzzy"

    return _default_market_city(known_locations), "default-market"
