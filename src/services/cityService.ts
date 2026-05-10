// City/GeoDB API Service
// Using GeoDB Cities API as the primary source

export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region?: string;
  latitude: number;
  longitude: number;
  population?: number;
}

const GEODB_API_BASE = "https://wft-geo-db.p.rapidapi.com/v1/geo";

export const cityService = {
  // Search cities
  searchCities: async (
    query: string,
    countryFilter?: string,
  ): Promise<City[]> => {
    try {
      const url = new URL(`${GEODB_API_BASE}/cities`);
      url.searchParams.append("namePrefix", query);
      url.searchParams.append("limit", "10");

      if (countryFilter) {
        url.searchParams.append("countryIds", countryFilter);
      }

      const response = await fetch(url.toString(), {
        headers: {
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
          "x-rapidapi-key": process.env.NEXT_PUBLIC_GEODB_API_KEY || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }

      const data = await response.json();

      return (
        data.data?.map((city: any) => ({
          id: city.id.toString(),
          name: city.name,
          country: city.country,
          countryCode: city.countryCode,
          region: city.adminCode1,
          latitude: city.latitude,
          longitude: city.longitude,
          population: city.population,
        })) || []
      );
    } catch (error) {
      console.error("Error searching cities:", error);
      return [];
    }
  },

  // Get popular cities
  getPopularCities: async (): Promise<City[]> => {
    const popularCities = [
      "Paris",
      "Tokyo",
      "Barcelona",
      "Dubai",
      "New York",
      "London",
      "Rome",
      "Bangkok",
    ];

    const cities: City[] = [];

    for (const cityName of popularCities) {
      const results = await cityService.searchCities(cityName);
      if (results.length > 0) {
        cities.push(results[0]);
      }
    }

    return cities;
  },

  // Get cities by country
  getCitiesByCountry: async (countryCode: string): Promise<City[]> => {
    try {
      const url = new URL(`${GEODB_API_BASE}/countries/${countryCode}/cities`);
      url.searchParams.append("limit", "50");

      const response = await fetch(url.toString(), {
        headers: {
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
          "x-rapidapi-key": process.env.NEXT_PUBLIC_GEODB_API_KEY || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cities by country");
      }

      const data = await response.json();

      return (
        data.data?.map((city: any) => ({
          id: city.id.toString(),
          name: city.name,
          country: city.country,
          countryCode: city.countryCode,
          region: city.adminCode1,
          latitude: city.latitude,
          longitude: city.longitude,
          population: city.population,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching cities by country:", error);
      return [];
    }
  },

  // Get city details
  getCityDetails: async (cityId: string): Promise<City | null> => {
    try {
      const url = new URL(`${GEODB_API_BASE}/cities/${cityId}`);

      const response = await fetch(url.toString(), {
        headers: {
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
          "x-rapidapi-key": process.env.NEXT_PUBLIC_GEODB_API_KEY || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch city details");
      }

      const data = await response.json();

      return {
        id: data.id.toString(),
        name: data.name,
        country: data.country,
        countryCode: data.countryCode,
        region: data.adminCode1,
        latitude: data.latitude,
        longitude: data.longitude,
        population: data.population,
      };
    } catch (error) {
      console.error("Error fetching city details:", error);
      return null;
    }
  },
};

// Alternative: Google Places API Service
export const googlePlacesService = {
  searchCities: async (query: string): Promise<any[]> => {
    try {
      const response = await fetch("/api/services/places/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to search places");
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching places:", error);
      return [];
    }
  },

  getPlaceDetails: async (placeId: string): Promise<any> => {
    try {
      const response = await fetch(`/api/services/places/${placeId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch place details");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching place details:", error);
      return null;
    }
  },
};
