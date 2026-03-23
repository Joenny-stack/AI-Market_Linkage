"""Helpers to normalize runtime location values to model-supported city labels."""

from __future__ import annotations

import difflib

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
}


def normalize_location_for_model(raw_location: str, known_locations: list[str]) -> tuple[str, str]:
    """
    Normalize a user location to one of the model-supported location labels.

    Returns:
        (normalized_location, strategy)
    where strategy is one of: exact, alias, province-map, fuzzy.

    Raises:
        ValueError when no confident mapping is possible.
    """
    location = str(raw_location or "").strip()
    if not location:
        raise ValueError("Location is required for price prediction.")

    known_by_lower = {v.lower(): v for v in known_locations}
    location_lower = location.lower()

    if location_lower in known_by_lower:
        return known_by_lower[location_lower], "exact"

    if location_lower in CITY_ALIASES:
        aliased = CITY_ALIASES[location_lower]
        if aliased.lower() in known_by_lower:
            return known_by_lower[aliased.lower()], "alias"

    if location_lower in PROVINCE_TO_CITY:
        mapped_city = PROVINCE_TO_CITY[location_lower]
        if mapped_city.lower() in known_by_lower:
            return known_by_lower[mapped_city.lower()], "province-map"

    # Last chance: fuzzy match to known labels.
    close = difflib.get_close_matches(location, known_locations, n=1, cutoff=0.6)
    if close:
        return close[0], "fuzzy"

    raise ValueError(
        f"Unsupported location '{location}'. Supported values: {', '.join(sorted(known_locations))}"
    )
