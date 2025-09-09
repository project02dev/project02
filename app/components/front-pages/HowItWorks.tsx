export default function HowItWorks() {
  const steps = [
    {
      title: "Browse or Request",
      description:
        "Find ready-made projects or request custom work tailored to your needs",
      icon: "🔍",
    },
    {
      title: "Connect with Creators",
      description: "Chat directly with creators to discuss project details",
      icon: "💬",
    },
    {
      title: "Secure Payment",
      description: "Pay securely through our platform with payment protection",
      icon: "🔒",
    },
    {
      title: "Get Your Project",
      description:
        "Receive your completed project with all source files and documentation",
      icon: "🎓",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How Project02 Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to get the academic projects you need
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
