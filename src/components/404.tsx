// import { Button } from '@/components/ui/button';
// import { useNavigate } from 'react-router-dom';

import { Link } from "react-router-dom";

const Error404Page = () => {
//   const navigate = useNavigate();

  return (
    <div className="grid min-h-full place-items-center px-6 py-20 sm:py-24 lg:px-8">
      <div className="text-center">
        <p className="text-4xl font-semibold text-sidebar-primary">404</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-200 sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-sidebar-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sidebar-primary/50 hover:text-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-primary/60"
          >
            Go back home
          </Link>
          <Link to="/help-center" className="text-sm font-semibold hover:underline text-gray-900 dark:text-gray-200">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error404Page;