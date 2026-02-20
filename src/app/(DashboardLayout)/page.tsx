import RevenueForecast from "../components/dashboard/RevenueForecast";
import NewCustomers from "../components/dashboard/NewCustomers";
import TotalIncome from "../components/dashboard/TotalIncome";
import ProductRevenue from "../components/dashboard/ProductRevenue";
import DailyActivity from "../components/dashboard/DailyActivity";
import BlogCards from "../components/dashboard/BlogCards";
import Link from "next/link";

const page = () => {
  return (
    <div className="grid grid-cols-12 gap-30">
      <div className="col-span-12 lg:col-span-3">
        <div className="bg-white dark:bg-darkgray p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-3">
        <div className="bg-white dark:bg-darkgray p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Courses</h3>
          <p className="text-3xl font-bold text-success">0</p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-3">
        <div className="bg-white dark:bg-darkgray p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Monthly Admissions</h3>
          <p className="text-3xl font-bold text-warning">0</p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-3">
        <div className="bg-white dark:bg-darkgray p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Fees</h3>
          <p className="text-3xl font-bold text-error">₹0</p>
        </div>
      </div>
    </div>
  );
};

export default page;
