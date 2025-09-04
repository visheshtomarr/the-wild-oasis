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

    // Pagination
    const page = searchParams.get("page")
        ? Number(searchParams.get("page"))
        : 1;

    const { isLoading, data: { data: bookings, count } = {}, error } = useQuery({
        queryKey: ["bookings", filter, sortBy, page],
        queryFn: () => getBookings({ filter, sortBy, page })
    });

    return { isLoading, bookings, error, count };
}