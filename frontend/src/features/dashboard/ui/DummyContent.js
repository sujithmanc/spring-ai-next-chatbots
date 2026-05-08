// Manual 10-second delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function DummyContent() {
  // Simulate heavy data fetching
  await delay(10000); 

  return (
    <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
      <p className="text-primary font-medium text-lg italic">
        "Hello, this is just a dummy page. The data from Spring Boot has arrived!"
      </p>
      <div className="mt-4 badge badge-success gap-2">
        Fetch Complete
      </div>
    </div>
  );
}