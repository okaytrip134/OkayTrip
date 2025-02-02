import React from "react";

const UserFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-9">
      <div className="container mx-auto px-4">
        <h2 className="text-[1.2rem] font-bold mb-2">
          © {new Date().getFullYear()} OkayTrip.com All rights reserved.
        </h2>
        <p className="text-base font-normal px-16">
          The content and images used on this site are copyright protected and copyrights vest
          with the respective owners. The usage of the content and images on this website is
          intended to promote the works and no endorsement of the artist shall be implied.
          Unauthorized use is prohibited and punishable by law.
        </p>
      </div>
    </footer>
  );
};

export default UserFooter;
