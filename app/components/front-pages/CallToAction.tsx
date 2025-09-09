export default function CallToAction() {
  return (
    <section className="py-16 bg-indigo-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of students and creators already using Project02 to
          enhance their academic experience.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="/signup?role=student"
            className="px-8 py-3 bg-white text-indigo-600 rounded-md hover:bg-gray-100 transition font-medium"
          >
            Find Projects
          </a>
          <a
            href="/signup?role=creator"
            className="px-8 py-3 border border-white text-white rounded-md hover:bg-indigo-700 transition font-medium"
          >
            Become a Creator
          </a>
        </div>
      </div>
    </section>
  );
}
