import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8">About</h1>
        
        {/* About the Page Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">About the Site</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            Welcome to the results-declaration web page! This platform is designed to simplify and streamline the process of publishing and accessing results with ease and efficiency. It is a user-friendly application aimed at making result management a seamless experience.
          </p>
        </section>

        {/* About the Developer Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">About the Developer</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            Hi, I’m <span className="font-bold">Shreeti Biswal</span>, the creator of this project.For any querries and issues contact to the given email address. 
          </p>
          <p className="text-lg text-gray-800 leading-relaxed mt-4">
            Feel free to contribute to the project or reach out to me with your ideas and feedback. Let’s make this platform even better together!
          </p>
        </section>

        {/* Contribution Links */}
        <div className="text-center mt-8">
          <a
            href="https://github.com/ShreetiBiswal/Score-Board"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          >
            GitHub Repository
          </a>
        </div>

        {/* Contact Information */}
        <div className="text-center mt-4">
          <p className="text-gray-700">
            Contact me at <span className="font-bold"><a href='mailto:biswalshreeti@gmail.com'>biswalshreeti@gmail.com</a></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
    