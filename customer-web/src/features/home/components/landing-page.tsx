import { Button } from "../../../components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
        Experience Fine Dining
      </h1>
      <p className="max-w-2xl text-xl text-gray-600">
        Order online, reserve a table, and track your orders in real-time.
      </p>
      <div className="flex gap-4">
        <Button size="lg">Order Now</Button>
        <Button variant="outline" size="lg">Book a Table</Button>
      </div>
    </div>
  );
}
