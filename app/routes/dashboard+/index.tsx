import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Dashboard() {
    return (
        <div className="flex flex-row gap-2">
            <Button asChild>
                <Link to="/dashboard/add-data">Add New</Link>
            </Button>
            <Button asChild>
                <Link to="/add-new">Upload</Link>
            </Button>
        </div>
    )
}