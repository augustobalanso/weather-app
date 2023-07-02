import type { Current } from "./current";
import type { Location } from "./location";

export type WeatherAPI = {
    location: Location;
    current:  Current;
}
