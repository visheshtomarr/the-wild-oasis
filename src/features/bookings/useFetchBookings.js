import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

export function useFetchBookings() {
    const [searchParams] = useSearchParams();

    // Filter
    const filteredValue = searchParams.get("status");
    const filter = !filteredValue || filteredValue === "all" ? null : { field: "status", value: filteredValue };

    // Sort
    const sortByParam = searchParams.get("sortBy") || "startDate-desc";
    const [field, direction] = sortByParam.split("-");
    const sortBy = { field, direction };

    const { isLoading, data: bookings, error } = useQuery({
        queryKey: ["bookings", filter, sortBy],
        queryFn: () => getBookings({ filter, sortBy })
    });

    return { isLoading, bookings, error };
}